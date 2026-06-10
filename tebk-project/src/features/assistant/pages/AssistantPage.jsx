import { useState, useEffect, useRef } from 'react'

const WEBHOOK_URL = 'https://n8n-production-7180.up.railway.app/webhook/1f9fd43d-9d33-4553-96c5-43bb74339c6c/chat'
const MAX_USER_MESSAGES = 30

function getSessionId() {
  let id = sessionStorage.getItem('tebk_session')
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2) + Date.now()
    sessionStorage.setItem('tebk_session', id)
  }
  return id
}

function getLang() {
  return document.documentElement.lang?.startsWith('ar') ||
    localStorage.getItem('i18nextLng')?.startsWith('ar') ? 'ar' : 'en'
}

function getChatHistory() {
  try { return JSON.parse(localStorage.getItem('tebk_chats') || '[]') }
  catch { return [] }
}

function saveChatHistory(chats) {
  localStorage.setItem('tebk_chats', JSON.stringify(chats))
}

function getSessionMessages(sessionId) {
  try { return JSON.parse(localStorage.getItem('tebk_msgs_' + sessionId) || '[]') }
  catch { return [] }
}

function saveSessionMessages(sessionId, messages) {
  localStorage.setItem('tebk_msgs_' + sessionId, JSON.stringify(messages))
}

const T = {
  ar: {
    welcome: 'صباح النور يا دكتور! أنا مساعد طِبك الذكي. ابحث عن أي مستلزم طبي أو ابعت صورته وأنا هساعدك فوراً 😊',
    tagline: 'مساعدك الذكي لتجهيز عيادتك بأفضل المستلزمات الطبية',
    online: 'متاح الآن',
    newChat: '+ محادثة جديدة',
    history: 'المحادثات السابقة',
    noHistory: 'مفيش محادثات سابقة\nابدأ محادثة جديدة!',
    placeholder: 'اكتب رسالتك أو ارفع صورة المنتج...',
    subtitle: 'بيساعدك تلاقي وتطلب أي مستلزم طبي',
    title: 'مساعد طِبك الذكي',
    error: 'عذراً، في مشكلة في الاتصال. حاول تاني.',
    imgMsg: 'ابعت صورة للبحث',
    limitMsg: '⚠️ المحادثة طالت كتير. برجاء بدء محادثة جديدة للحصول على أفضل خدمة.',
    newChatBtn: 'ابدأ محادثة جديدة',
    features: [
      { icon: '🔍', label: 'بحث ذكي' },
      { icon: '📷', label: 'بحث بالصور' },
      { icon: '🔔', label: 'تنبيه تلقائي' },
      { icon: '📦', label: 'طلب سريع' },
    ],
    today: 'اليوم',
    dir: 'rtl',
    imageSaved: 'صورة محفوظة وجاهزة للإرسال',
  },
  en: {
    welcome: 'Hello Doctor! I\'m Tebk Smart Assistant. Search for any medical supply or send a photo and I\'ll help you right away 😊',
    tagline: 'Your smart assistant for equipping your clinic with the best medical supplies',
    online: 'Online now',
    newChat: '+ New Chat',
    history: 'Previous Chats',
    noHistory: 'No previous chats\nStart a new one!',
    placeholder: 'Type your message or upload a product image...',
    subtitle: 'Helps you find and order any medical supply',
    title: 'Tebk Smart Assistant',
    error: 'Sorry, connection issue. Please try again.',
    imgMsg: 'Searching by image',
    limitMsg: '⚠️ This chat has gotten too long. Please start a new conversation for the best experience.',
    newChatBtn: 'Start New Chat',
    features: [
      { icon: '🔍', label: 'Smart Search' },
      { icon: '📷', label: 'Image Search' },
      { icon: '🔔', label: 'Auto Alerts' },
      { icon: '📦', label: 'Quick Order' },
    ],
    today: 'Today',
    dir: 'ltr',
    imageSaved: 'Image ready to send',
  }
}

export function AssistantPage() {
  const lang = getLang()
  const t = T[lang]
  const isMobile = window.innerWidth < 640

  const [sessionId, setSessionId] = useState(getSessionId)
  const [chatHistory, setChatHistory] = useState(getChatHistory)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingChatId, setEditingChatId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLimit, setShowLimit] = useState(false)
  const [pendingImage, setPendingImage] = useState(null)

  const initMessages = () => {
    const saved = getSessionMessages(sessionId)
    return saved.length > 0 ? saved : [{ id: 1, role: 'bot', text: t.welcome }]
  }

  const [messages, setMessages] = useState(initMessages)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (messages.length > 1) {
      saveSessionMessages(sessionId, messages)
    }
    const userCount = messages.filter(m => m.role === 'user').length
    if (userCount >= MAX_USER_MESSAGES) setShowLimit(true)
  }, [messages])

  const sendMessage = async (text, imageBase64 = null) => {
    if (!text.trim() && !imageBase64) return
    if (showLimit) return

    const userMsg = { id: Date.now(), role: 'user', text, image: imageBase64 }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setPendingImage(null)
    setLoading(true)

    // save chat title on first message
    const userCount = newMessages.filter(m => m.role === 'user').length
    if (userCount === 1 && text.trim()) {
      const title = text.slice(0, 28)
      const newChat = {
        id: sessionId, title,
        time: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        date: t.today
      }
      const updated = [newChat, ...chatHistory.filter(c => c.id !== sessionId)]
      setChatHistory(updated)
      saveChatHistory(updated)
    }

    try {
      const body = { sessionId, chatInput: text }
      if (imageBase64) body.image = imageBase64
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      const reply = data.output || data.text || data.message || t.error
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }])
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: t.error }])
    } finally {
      setLoading(false)
    }
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPendingImage({ file: reader.result.split(',')[1], name: file.name })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

const startNewChat = () => {
  // مسح كل حاجة متعلقة بالسيشن الحالي
  const oldId = sessionStorage.getItem('tebk_session')
  if (oldId) {
    localStorage.removeItem('tebk_msgs_' + oldId)
  }
  
  // عمل session ID جديد خالص
  const newId = 'sess_' + Math.random().toString(36).slice(2) + Date.now()
  sessionStorage.setItem('tebk_session', newId)
  setSessionId(newId)
  setMessages([{ id: 1, role: 'bot', text: t.welcome }])
  setShowLimit(false)
  setInput('')
  setSidebarOpen(false)
}
  const loadChat = (chatId) => {
    const saved = getSessionMessages(chatId)
    if (saved.length > 0) {
      sessionStorage.setItem('tebk_session', chatId)
      setSessionId(chatId)
      setMessages(saved)
      setShowLimit(saved.filter(m => m.role === 'user').length >= MAX_USER_MESSAGES)
      setSidebarOpen(false)
    }
  }

  const saveEditTitle = (id) => {
    if (!editingTitle.trim()) { setEditingChatId(null); return }
    const updated = chatHistory.map(c => c.id === id ? { ...c, title: editingTitle.trim() } : c)
    setChatHistory(updated)
    saveChatHistory(updated)
    setEditingChatId(null)
    setEditingTitle('')
  }

  return (
    <div style={{
      fontFamily: "'Cairo', sans-serif",
      height: '100%',
      background: '#e8f7f2',
      direction: t.dir,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch',
      padding: '16px 20px'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Inner container */}
      <div style={{
        display: 'flex', width: '100%', maxWidth: 960,
        flex: 1, minHeight: 0, borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,100,70,.12)',
        border: '0.5px solid #c0e8d8'
      }}>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 9 }} />
        )}

        {/* SIDEBAR */}
        <div style={{
          width: 220, flexShrink: 0, background: '#f0faf6',
          borderLeft: lang === 'ar' ? 'none' : '0.5px solid #c0e8d8',
          borderRight: lang === 'ar' ? '0.5px solid #c0e8d8' : 'none',
          display: 'flex', flexDirection: 'column', zIndex: 10,
          position: isMobile ? 'fixed' : 'relative',
          [lang === 'ar' ? 'right' : 'left']: isMobile ? (sidebarOpen ? 0 : -220) : 0,
          top: 0, bottom: 0, transition: 'right .25s, left .25s',
          boxShadow: isMobile && sidebarOpen ? '2px 0 16px rgba(0,0,0,.12)' : 'none'
        }}>
          <div style={{ padding: '14px 12px 10px', borderBottom: '0.5px solid #c0e8d8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
              <div style={{ width: 30, height: 30, background: '#0F6E56', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>T</div>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#085041' }}>طِبك AI</span>
            </div>
            <div style={{ fontSize: 10.5, color: '#0F6E56', lineHeight: 1.5, marginBottom: 7 }}>{t.tagline}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: '#0F6E56', background: '#d4f0e5', padding: '3px 9px', borderRadius: 20, width: 'fit-content' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#1D9E75', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              {t.online}
            </div>
          </div>

          <button onClick={startNewChat} style={{ margin: '10px 12px 3px', padding: '8px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 8, fontFamily: "'Cairo', sans-serif", fontSize: 11.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            {t.newChat}
          </button>

          <div style={{ fontSize: 9.5, color: '#0F6E56', padding: '10px 12px 4px', fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase' }}>{t.history}</div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {chatHistory.length === 0 ? (
              <div style={{ padding: '14px 12px', textAlign: 'center', color: '#0F6E56', fontSize: 10.5, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{t.noHistory}</div>
            ) : chatHistory.map(chat => (
              <div key={chat.id}
                onClick={() => loadChat(chat.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', cursor: 'pointer',
                  background: chat.id === sessionId ? '#d4f0e5' : 'transparent',
                  borderRight: lang === 'ar' && chat.id === sessionId ? '3px solid #0F6E56' : lang === 'ar' ? '3px solid transparent' : 'none',
                  borderLeft: lang === 'en' && chat.id === sessionId ? '3px solid #0F6E56' : lang === 'en' ? '3px solid transparent' : 'none',
                  transition: 'background .15s'
                }}>
                <span style={{ color: '#0F6E56', fontSize: 12, flexShrink: 0 }}>💬</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingChatId === chat.id ? (
                    <input
                      autoFocus
                      value={editingTitle}
                      onChange={e => setEditingTitle(e.target.value)}
                      onBlur={() => saveEditTitle(chat.id)}
                      onKeyDown={e => e.key === 'Enter' && saveEditTitle(chat.id)}
                      onClick={e => e.stopPropagation()}
                      style={{ width: '100%', fontSize: 11.5, fontFamily: "'Cairo', sans-serif", border: '0.5px solid #0F6E56', borderRadius: 4, padding: '2px 5px', background: '#fff', color: '#085041', outline: 'none' }}
                    />
                  ) : (
               <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
  <div
    onDoubleClick={e => { e.stopPropagation(); setEditingChatId(chat.id); setEditingTitle(chat.title) }}
    title="Double click to rename"
    style={{ fontSize: 11.5, fontWeight: 600, color: '#085041', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}
  >{chat.title}</div>
  <button
    onClick={e => {
      e.stopPropagation()
      // حذف الرسائل من localStorage
      localStorage.removeItem('tebk_msgs_' + chat.id)
      // حذف المحادثة من القائمة
      const updated = chatHistory.filter(c => c.id !== chat.id)
      setChatHistory(updated)
      saveChatHistory(updated)
      // لو المحادثة المحذوفة هي الحالية ابدأ جديد
      if (chat.id === sessionId) startNewChat()
    }}
    title="Delete chat"
    style={{ width: 16, height: 16, borderRadius: '50%', border: 'none', background: 'transparent', color: '#0F6E56', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: 0.5, lineHeight: 1 }}
    onMouseEnter={e => e.target.style.opacity = 1}
    onMouseLeave={e => e.target.style.opacity = 0.5}
  >×</button>
</div>
                  )}
                  <div style={{ fontSize: 9.5, color: '#0F6E56' }}>{chat.date}، {chat.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CHAT */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '10px 14px', background: '#fff', borderBottom: '0.5px solid #e0f0ea', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {isMobile && (
                <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 26, height: 26, borderRadius: '50%', border: '0.5px solid #c0e8d8', background: '#f0faf6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0F6E56', fontSize: 13 }}>☰</button>
              )}
              <div style={{ width: 30, height: 30, background: '#0F6E56', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700 }}>T</div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a1a' }}>{t.title}</div>
                <div style={{ fontSize: 10.5, color: '#0F6E56' }}>{t.subtitle}</div>
              </div>
            </div>
            <button onClick={startNewChat} style={{ width: 26, height: 26, borderRadius: '50%', border: '0.5px solid #e0e0e0', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, color: '#666' }}>↺</button>
          </div>

          {/* Messages — flex: 1 + overflow scroll */}
          <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto', background: '#f8fffe', minHeight: 0 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex', gap: 6, maxWidth: '78%',
                alignSelf: msg.role === 'bot' ? (lang === 'ar' ? 'flex-end' : 'flex-start') : (lang === 'ar' ? 'flex-start' : 'flex-end'),
                flexDirection: msg.role === 'bot' ? (lang === 'ar' ? 'row-reverse' : 'row') : (lang === 'ar' ? 'row' : 'row-reverse')
              }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: msg.role === 'bot' ? '#0F6E56' : '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                  {msg.role === 'bot' ? 'T' : lang === 'ar' ? 'د' : 'Dr'}
                </div>
                <div>
                  {msg.image && <img src={`data:image/jpeg;base64,${msg.image}`} alt="" style={{ maxWidth: 160, borderRadius: 10, marginBottom: 4 }} />}
                  <div style={{
                    padding: '8px 12px', borderRadius: 12, fontSize: 12.5, lineHeight: 1.7,
                    background: msg.role === 'bot' ? '#fff' : '#0F6E56',
                    color: msg.role === 'bot' ? '#1a1a1a' : '#fff',
                    border: msg.role === 'bot' ? '0.5px solid #e0f0ea' : 'none',
                    borderBottomRightRadius: msg.role === 'bot' ? (lang === 'ar' ? 3 : 12) : (lang === 'ar' ? 12 : 3),
                    borderBottomLeftRadius: msg.role === 'bot' ? (lang === 'ar' ? 12 : 3) : (lang === 'ar' ? 3 : 12),
                    whiteSpace: 'pre-wrap', direction: lang === 'ar' ? 'rtl' : 'ltr'
                  }}>{msg.text}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: 6, alignSelf: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>T</div>
                <div style={{ padding: '9px 13px', background: '#fff', border: '0.5px solid #e0f0ea', borderRadius: 12, display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#1D9E75', display: 'inline-block', animation: `bounce 0.8s ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Limit warning */}
            {showLimit && (
              <div style={{ alignSelf: 'center', background: '#fff8e6', border: '0.5px solid #f0c060', borderRadius: 12, padding: '10px 16px', fontSize: 12, color: '#7a5a00', textAlign: 'center', maxWidth: '90%' }}>
                <div style={{ marginBottom: 8 }}>{t.limitMsg}</div>
                <button onClick={startNewChat} style={{ padding: '6px 16px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: 8, fontFamily: "'Cairo', sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                  {t.newChatBtn}
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Area — fixed at bottom */}
          <div style={{ background: '#fff', borderTop: '0.5px solid #e0f0ea', flexShrink: 0 }}>
            {/* Image preview */}
            {pendingImage && (
              <div style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '0.5px solid #e0f0ea' }}>
                <img src={`data:image/jpeg;base64,${pendingImage.file}`} alt="preview" style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                <div style={{ flex: 1, fontSize: 12, color: '#0F6E56' }}>{t.imageSaved}</div>
                <button
                  onClick={() => setPendingImage(null)}
                  style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', fontSize: 14 }}
                >×</button>
              </div>
            )}
            <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => sendMessage(input, pendingImage?.file || null)}
                disabled={loading || (!input.trim() && !pendingImage) || showLimit}
                style={{ width: 30, height: 30, borderRadius: '50%', background: (input.trim() || pendingImage) && !showLimit ? '#0F6E56' : '#a0d4c4', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (input.trim() || pendingImage) && !showLimit ? 'pointer' : 'default', color: '#fff', fontSize: 13, flexShrink: 0, transition: 'background .2s' }}
              >➤</button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input, pendingImage?.file || null)}
                placeholder={showLimit ? (lang === 'ar' ? 'برجاء بدء محادثة جديدة...' : 'Please start a new chat...') : t.placeholder}
                disabled={showLimit}
                style={{ flex: 1, padding: '8px 12px', background: showLimit ? '#f5f5f5' : '#f0faf6', border: '0.5px solid #c0e8d8', borderRadius: 20, fontFamily: "'Cairo', sans-serif", fontSize: 12.5, color: '#1a1a1a', outline: 'none', direction: t.dir, minWidth: 0, opacity: showLimit ? 0.6 : 1 }}
              />
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={showLimit}
                style={{ width: 30, height: 30, borderRadius: '50%', border: '0.5px solid #c0e8d8', background: '#f0faf6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0F6E56', fontSize: 16, flexShrink: 0, opacity: showLimit ? 0.4 : 1 }}
              >+</button>
            </div>

            <div style={{ padding: '0 10px 8px', display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
              {t.features.map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 20, border: '0.5px solid #c0e8d8', background: '#f0faf6' }}>
                  <span style={{ fontSize: 11 }}>{f.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#085041' }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c0e8d8; border-radius: 4px; }
      `}</style>
    </div>
  )
}

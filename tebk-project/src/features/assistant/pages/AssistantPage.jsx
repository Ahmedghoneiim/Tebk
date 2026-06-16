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
    welcome: 'أهلاً دكتور! أنا مساعد TEBK الذكي، هنا لمساعدتك في العثور على أي مستلزمات طبية أو تجهيز عيادتك. يمكنك البحث بأفضل المعدات، بحث عن منتج أو حتى إرسال صورة وسأقوم بمساعدتك فوراً 🌟',
    tagline: 'مساعدك الذكي لتجهيز عيادتك',
    online: 'نشط الآن',
    newChat: 'New Chat +',
    history: 'PREVIOUS CHATS',
    noHistory: 'مفيش محادثات سابقة\nابدأ محادثة جديدة!',
    placeholder: 'اكتب رسالتك أو قم برفع صورة المنتج..',
    subtitle: 'مساعدك للعيادة',
    title: 'TEBK Smart Assistant',
    error: 'عذراً، في مشكلة في الاتصال. حاول تاني.',
    imgMsg: 'ابعت صورة للبحث',
    limitMsg: '⚠️ المحادثة طالت كتير. برجاء بدء محادثة جديدة للحصول على أفضل خدمة.',
    newChatBtn: 'ابدأ محادثة جديدة',
    features: [
      { icon: '🛒', label: 'Quick Order' },
      { icon: '🔔', label: 'Auto Alerts' },
      { icon: '📷', label: 'Image Search' },
      { icon: '🔍', label: 'Smart Search' },
    ],
    settings: 'Settings',
    help: 'Help',
    today: 'اليوم',
    dir: 'rtl',
    imageSaved: 'صورة محفوظة وجاهزة للإرسال',
    clinicalAssistant: 'Your clinical assistant',
  },
  en: {
    welcome: 'Hello Doctor! I\'m Tebk Smart Assistant. Search for any medical supply or send a photo and I\'ll help you right away 😊',
    tagline: 'Your smart assistant for equipping your clinic',
    online: 'Online now',
    newChat: 'New Chat +',
    history: 'PREVIOUS CHATS',
    noHistory: 'No previous chats\nStart a new one!',
    placeholder: 'Type your message or upload a product image..',
    subtitle: 'Your clinical assistant',
    title: 'TEBK Smart Assistant',
    error: 'Sorry, connection issue. Please try again.',
    imgMsg: 'Searching by image',
    limitMsg: '⚠️ This chat has gotten too long. Please start a new conversation for the best experience.',
    newChatBtn: 'Start New Chat',
    features: [
      { icon: '🛒', label: 'Quick Order' },
      { icon: '🔔', label: 'Auto Alerts' },
      { icon: '📷', label: 'Image Search' },
      { icon: '🔍', label: 'Smart Search' },
    ],
    settings: 'Settings',
    help: 'Help',
    today: 'Today',
    dir: 'ltr',
    imageSaved: 'Image ready to send',
    clinicalAssistant: 'Your clinical assistant',
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
    const oldId = sessionStorage.getItem('tebk_session')
    if (oldId) localStorage.removeItem('tebk_msgs_' + oldId)
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

  const deleteChat = (e, chat) => {
    e.stopPropagation()
    localStorage.removeItem('tebk_msgs_' + chat.id)
    const updated = chatHistory.filter(c => c.id !== chat.id)
    setChatHistory(updated)
    saveChatHistory(updated)
    if (chat.id === sessionId) startNewChat()
  }

  // ─── icon button shared style ───
  const iconBtn = {
    width: 28, height: 28, borderRadius: '50%',
    border: '0.5px solid #e0f0ea', background: '#f8fffe',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#666', fontSize: 13, flexShrink: 0,
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
      padding: '16px 20px',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── Outer wrapper ── */}
      <div style={{
        display: 'flex', width: '100%', maxWidth: 960,
        flex: 1, minHeight: 0, borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,100,70,.14)',
        border: '0.5px solid #c0e8d8',
      }}>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9 }}
          />
        )}

        {/* ════════════════════════════════════════
            SIDEBAR — Dark theme
        ════════════════════════════════════════ */}
        <div style={{
          width: 230, flexShrink: 0,
          background: '#0d1f17',
          borderLeft:  lang === 'ar' ? 'none'                  : '1px solid #1a3d2e',
          borderRight: lang === 'ar' ? '1px solid #1a3d2e'     : 'none',
          display: 'flex', flexDirection: 'column', zIndex: 10,
          position: isMobile ? 'fixed' : 'relative',
          [lang === 'ar' ? 'right' : 'left']: isMobile ? (sidebarOpen ? 0 : -230) : 0,
          top: 0, bottom: 0,
          transition: 'right .25s, left .25s',
          boxShadow: isMobile && sidebarOpen ? '4px 0 24px rgba(0,0,0,.3)' : 'none',
        }}>

          {/* ── Sidebar Header ── */}
          <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1a3d2e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, background: '#17C3CE', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>🤖</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#e8f5f0', letterSpacing: '-0.2px' }}>
                  TEBK AI
                </div>
                <div style={{ fontSize: 10.5, color: '#6b9e8a', marginTop: 1 }}>
                  {t.clinicalAssistant}
                </div>
              </div>
            </div>
          </div>

          {/* ── New Chat button ── */}
          <button
            onClick={startNewChat}
            style={{
              margin: '14px 14px 4px',
              padding: '9px 12px',
              background: '#17C3CE',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontFamily: "'Cairo', sans-serif",
              fontSize: 12.5, fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#0EA3AC'}
            onMouseLeave={e => e.currentTarget.style.background = '#17C3CE'}
          >
            {t.newChat}
          </button>

          {/* ── History label ── */}
          <div style={{
            fontSize: 9, color: '#4a7a64',
            padding: '14px 16px 5px',
            fontWeight: 700, letterSpacing: '1.2px',
            textTransform: 'uppercase',
          }}>
            {t.history}
          </div>

          {/* ── Chat list ── */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {chatHistory.length === 0 ? (
              <div style={{
                padding: '18px 14px', textAlign: 'center',
                color: '#4a7a64', fontSize: 10.5,
                lineHeight: 1.7, whiteSpace: 'pre-line',
              }}>
                {t.noHistory}
              </div>
            ) : chatHistory.map(chat => (
              <div
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px',
                  margin: '1px 8px',
                  cursor: 'pointer',
                  background: chat.id === sessionId ? '#1a3d2e' : 'transparent',
                  borderRight: lang === 'ar' && chat.id === sessionId ? '2px solid #17C3CE' : lang === 'ar' ? '2px solid transparent' : 'none',
                  borderLeft:  lang === 'en' && chat.id === sessionId ? '2px solid #17C3CE' : lang === 'en' ? '2px solid transparent' : 'none',
                  borderRadius: 8,
                  transition: 'background .15s',
                }}
              >
                {/* Chat icon */}
                <span style={{ color: '#4a7a64', fontSize: 12, flexShrink: 0 }}>💬</span>

                {/* Title */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingChatId === chat.id ? (
                    <input
                      autoFocus
                      value={editingTitle}
                      onChange={e => setEditingTitle(e.target.value)}
                      onBlur={() => saveEditTitle(chat.id)}
                      onKeyDown={e => e.key === 'Enter' && saveEditTitle(chat.id)}
                      onClick={e => e.stopPropagation()}
                      style={{
                        width: '100%', fontSize: 11.5,
                        fontFamily: "'Cairo', sans-serif",
                        border: '1px solid #17C3CE', borderRadius: 4,
                        padding: '2px 5px', background: '#0a1a11',
                        color: '#e8f5f0', outline: 'none',
                      }}
                    />
                  ) : (
                    <div
                      onDoubleClick={e => { e.stopPropagation(); setEditingChatId(chat.id); setEditingTitle(chat.title) }}
                      title="Double click to rename"
                      style={{
                        fontSize: 11.5, fontWeight: 500,
                        color: chat.id === sessionId ? '#d4f0e4' : '#8ab5a0',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}
                    >
                      {chat.title}
                    </div>
                  )}
                </div>

                {/* Clock + time + delete */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                  <span style={{ fontSize: 9, color: '#4a7a64' }}>🕐</span>
                  <span style={{ fontSize: 9, color: '#4a7a64', minWidth: 28 }}>{chat.time}</span>
                  <button
                    onClick={e => deleteChat(e, chat)}
                    title="Delete chat"
                    style={{
                      width: 15, height: 15, borderRadius: '50%',
                      border: 'none', background: 'transparent',
                      color: '#4a7a64', fontSize: 13,
                      cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, opacity: 0.5, lineHeight: 1,
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
                  >×</button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Sidebar Footer: Settings + Help ── */}
          <div style={{ borderTop: '1px solid #1a3d2e', padding: '8px 10px' }}>
            {[
              { icon: '⚙️', label: t.settings },
              { icon: '❓', label: t.help },
            ].map(item => (
              <button
                key={item.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 8px', background: 'transparent',
                  border: 'none', cursor: 'pointer',
                  borderRadius: 8, color: '#6b9e8a',
                  fontSize: 12, fontFamily: "'Cairo', sans-serif",
                  fontWeight: 500, width: '100%',
                  textAlign: lang === 'ar' ? 'right' : 'left',
                  transition: 'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a3d2e'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════
            MAIN CHAT PANEL
        ════════════════════════════════════════ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>

          {/* ── Chat Header ── */}
          <div style={{
            padding: '10px 14px',
            background: '#fff',
            borderBottom: '0.5px solid #e0f0ea',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            {/* START side (RIGHT in RTL): avatar + title + online */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  style={{ ...iconBtn, border: '0.5px solid #c0e8d8', background: '#f0faf6', color: '#17C3CE', fontSize: 14 }}
                >☰</button>
              )}
              <div style={{
                width: 34, height: 34, background: '#17C3CE', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>T</div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a1a' }}>{t.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#17C3CE',
                    display: 'inline-block', animation: 'pulse 1.5s infinite',
                  }} />
                  <span style={{ fontSize: 10.5, color: '#17C3CE', fontWeight: 600 }}>{t.online}</span>
                </div>
              </div>
            </div>

            {/* END side (LEFT in RTL): action icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button style={iconBtn} title="Menu">⋮</button>
              <button style={iconBtn} title="New chat" onClick={startNewChat}>↺</button>
              <button style={iconBtn} title="Search">🔍</button>
            </div>
          </div>

          {/* ── Messages area ── */}
          <div style={{
            flex: 1, padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 10,
            overflowY: 'auto', background: '#f8fffe', minHeight: 0,
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex', gap: 6, maxWidth: '78%',
                alignSelf: msg.role === 'bot'
                  ? (lang === 'ar' ? 'flex-end' : 'flex-start')
                  : (lang === 'ar' ? 'flex-start' : 'flex-end'),
                flexDirection: msg.role === 'bot'
                  ? (lang === 'ar' ? 'row-reverse' : 'row')
                  : (lang === 'ar' ? 'row' : 'row-reverse'),
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: msg.role === 'bot' ? '#17C3CE' : '#17C3CE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 8, fontWeight: 700,
                  flexShrink: 0, marginTop: 2,
                }}>
                  {msg.role === 'bot' ? 'T' : lang === 'ar' ? 'د' : 'Dr'}
                </div>
                <div>
                  {msg.image && (
                    <img
                      src={`data:image/jpeg;base64,${msg.image}`}
                      alt=""
                      style={{ maxWidth: 160, borderRadius: 10, marginBottom: 4 }}
                    />
                  )}
                  <div style={{
                    padding: '8px 12px', borderRadius: 12,
                    fontSize: 12.5, lineHeight: 1.7,
                    background: msg.role === 'bot' ? '#fff' : '#17C3CE',
                    color: msg.role === 'bot' ? '#1a1a1a' : '#fff',
                    border: msg.role === 'bot' ? '0.5px solid #e0f0ea' : 'none',
                    borderBottomRightRadius: msg.role === 'bot' ? (lang === 'ar' ? 3 : 12) : (lang === 'ar' ? 12 : 3),
                    borderBottomLeftRadius:  msg.role === 'bot' ? (lang === 'ar' ? 12 : 3) : (lang === 'ar' ? 3 : 12),
                    whiteSpace: 'pre-wrap', direction: lang === 'ar' ? 'rtl' : 'ltr',
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', gap: 6, alignSelf: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', background: '#17C3CE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 8, fontWeight: 700, flexShrink: 0, marginTop: 2,
                }}>T</div>
                <div style={{
                  padding: '10px 14px', background: '#fff',
                  border: '0.5px solid #e0f0ea', borderRadius: 12,
                  display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: '#17C3CE', display: 'inline-block',
                      animation: `bounce 0.8s ${i * 0.15}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Limit warning */}
            {showLimit && (
              <div style={{
                alignSelf: 'center', background: '#fff8e6',
                border: '0.5px solid #f0c060', borderRadius: 12,
                padding: '10px 16px', fontSize: 12, color: '#7a5a00',
                textAlign: 'center', maxWidth: '90%',
              }}>
                <div style={{ marginBottom: 8 }}>{t.limitMsg}</div>
                <button
                  onClick={startNewChat}
                  style={{
                    padding: '6px 16px', background: '#17C3CE', color: '#fff',
                    border: 'none', borderRadius: 8,
                    fontFamily: "'Cairo', sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {t.newChatBtn}
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Bottom area ── */}
          <div style={{ background: '#fff', borderTop: '0.5px solid #e0f0ea', flexShrink: 0 }}>

            {/* Image preview */}
            {pendingImage && (
              <div style={{
                padding: '8px 14px',
                display: 'flex', alignItems: 'center', gap: 8,
                borderBottom: '0.5px solid #e0f0ea',
              }}>
                <img
                  src={`data:image/jpeg;base64,${pendingImage.file}`}
                  alt="preview"
                  style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                />
                <div style={{ flex: 1, fontSize: 12, color: '#17C3CE' }}>{t.imageSaved}</div>
                <button
                  onClick={() => setPendingImage(null)}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', border: 'none',
                    background: '#f0f0f0', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: '#666', fontSize: 14,
                  }}
                >×</button>
              </div>
            )}

            {/* Input row */}
            <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Send button */}
              <button
                onClick={() => sendMessage(input, pendingImage?.file || null)}
                disabled={loading || (!input.trim() && !pendingImage) || showLimit}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: (input.trim() || pendingImage) && !showLimit ? '#17C3CE' : 'rgba(23,195,206,0.35)',
                  border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: (input.trim() || pendingImage) && !showLimit ? 'pointer' : 'default',
                  color: '#fff', fontSize: 14, flexShrink: 0, transition: 'background .2s',
                }}
              >➤</button>

              {/* Mic button */}
              <button
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  border: '0.5px solid #c0e8d8', background: '#f0faf6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#17C3CE', fontSize: 14, flexShrink: 0,
                }}
              >🎤</button>

              {/* Text input */}
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input, pendingImage?.file || null)}
                placeholder={showLimit
                  ? (lang === 'ar' ? 'برجاء بدء محادثة جديدة...' : 'Please start a new chat...')
                  : t.placeholder}
                disabled={showLimit}
                style={{
                  flex: 1, padding: '8px 14px',
                  background: showLimit ? '#f5f5f5' : '#f0faf6',
                  border: '0.5px solid #c0e8d8',
                  borderRadius: 20,
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: 12.5, color: '#1a1a1a',
                  outline: 'none', direction: t.dir, minWidth: 0,
                  opacity: showLimit ? 0.6 : 1,
                }}
              />

              {/* Upload button */}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={showLimit}
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  border: '0.5px solid #c0e8d8', background: '#f0faf6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#17C3CE', fontSize: 16,
                  flexShrink: 0, opacity: showLimit ? 0.4 : 1,
                }}
              >+</button>
            </div>

            {/* Feature chips */}
            <div style={{ padding: '0 10px 9px', display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
              {t.features.map(f => (
                <div key={f.label} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px', borderRadius: 20,
                  border: '0.5px solid #c0e8d8', background: '#f0faf6',
                  cursor: 'default',
                }}>
                  <span style={{ fontSize: 12 }}>{f.icon}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: '#0C7F87' }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a3d2e; border-radius: 4px; }
      `}</style>
    </div>
  )
}

/**
 * Cloudinary URL transformation helpers.
 *
 * All functions inject transformation params right after "/upload/" in the URL.
 * Non-Cloudinary URLs and null values are returned safely without modification.
 *
 * Usage:
 *   import { cl } from '@/utils/cloudinary'
 *
 *   <img src={cl.optimized(product.image_url)} />
 *   <img src={cl.thumb(product.image_url, 400)} />
 *   <img src={cl.combined(product.image_url, 800, 600)} />
 */

const UPLOAD_MARKER = '/upload/'

/**
 * Inject a transformation string into a Cloudinary URL.
 * Returns the original URL unchanged if it isn't a Cloudinary URL.
 * Returns null if the URL is falsy.
 *
 * @param {string|null|undefined} url
 * @param {string} transformation  e.g. "q_auto,f_auto"
 * @returns {string|null}
 */
function transform(url, transformation) {
  if (!url) return null
  const idx = url.indexOf(UPLOAD_MARKER)
  if (idx === -1) return url  // not a Cloudinary URL — pass through unchanged
  const insertAt = idx + UPLOAD_MARKER.length
  return url.slice(0, insertAt) + transformation + '/' + url.slice(insertAt)
}

export const cl = {
  /**
   * Automatic quality + format (WebP/AVIF in modern browsers).
   * Best default for every <img> on the site.
   *
   * @example
   *   <img src={cl.optimized(image_url)} />
   * Result URL:
   *   .../upload/q_auto,f_auto/v.../photo.jpg
   */
  optimized(url) {
    return transform(url, 'q_auto,f_auto')
  },

  /**
   * Resize to exact width × height with smart-crop (keeps subject in frame).
   *
   * @param {number} width
   * @param {number} height
   * @example
   *   <img src={cl.resized(image_url, 800, 600)} />
   * Result URL:
   *   .../upload/w_800,h_600,c_fill,g_auto/v.../photo.jpg
   */
  resized(url, width, height) {
    return transform(url, `w_${width},h_${height},c_fill,g_auto`)
  },

  /**
   * Square thumbnail — shortcut for equal width & height.
   *
   * @param {number} size  Width and height in pixels
   * @example
   *   <img src={cl.thumb(image_url, 400)} />
   * Result URL:
   *   .../upload/w_400,h_400,c_fill,g_auto/v.../photo.jpg
   */
  thumb(url, size) {
    return transform(url, `w_${size},h_${size},c_fill,g_auto`)
  },

  /**
   * Quality optimisation + resize in one request — the recommended choice
   * for most product/bundle images where you know the display size.
   *
   * @param {number} width
   * @param {number} height
   * @example
   *   <img src={cl.combined(image_url, 800, 600)} />
   * Result URL:
   *   .../upload/q_auto,f_auto,w_800,h_600,c_fill,g_auto/v.../photo.jpg
   */
  combined(url, width, height) {
    return transform(url, `q_auto,f_auto,w_${width},h_${height},c_fill,g_auto`)
  },
}

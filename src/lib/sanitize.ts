// HTML/CSS Sanitization utilities

/**
 * Basic HTML sanitization - removes potentially dangerous tags and attributes
 * For production, consider using DOMPurify
 */
export function sanitizeHtml(html: string): string {
  // Remove script tags
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: URLs (potential XSS vector)
  sanitized = sanitized.replace(/data:/gi, '');
  
  return sanitized;
}

/**
 * Sanitize CSS to prevent injection attacks
 */
export function sanitizeCss(css: string): string {
  // Remove expressions (IE)
  let sanitized = css.replace(/expression\s*\([^)]*\)/gi, '');
  
  // Remove url() with javascript
  sanitized = sanitized.replace(/url\s*\(\s*["']?\s*javascript:[^)]*\)/gi, '');
  
  // Remove behavior (IE)
  sanitized = sanitized.replace(/behavior\s*:[^;]*/gi, '');
  
  // Remove -moz-binding
  sanitized = sanitized.replace(/-moz-binding\s*:[^;]*/gi, '');
  
  return sanitized;
}

/**
 * Validate and sanitize Tailwind class names
 */
export function sanitizeTailwindClasses(classes: string): string {
  // Only allow valid Tailwind class characters
  const validClassPattern = /^[a-zA-Z0-9_\-:\[\]\/\.%]+$/;
  
  return classes
    .split(/\s+/)
    .filter(cls => cls && validClassPattern.test(cls))
    .join(' ');
}

/**
 * Escape HTML entities for safe display
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}

/**
 * Unescape HTML entities
 */
export function unescapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'"
  };
  
  return text.replace(/&(?:amp|lt|gt|quot|#039);/g, (m) => map[m] || m);
}

const langMap: Record<string, string> = {
  JAPANESE: 'ja-JP',
  ENGLISH: 'en-US',
}

let pendingTimeout: ReturnType<typeof setTimeout> | null = null

export const speak = (text: string, language: string) => {
  if (!window.speechSynthesis) return

  // 取消前一個尚未執行的 setTimeout，避免播錯單字
  if (pendingTimeout !== null) {
    clearTimeout(pendingTimeout)
    pendingTimeout = null
  }

  window.speechSynthesis.cancel()

  // Safari workaround：切換分頁後 synthesis 可能進入暫停狀態
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume()
  }

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = langMap[language] ?? 'en-US'
  utterance.rate = 0.7
  utterance.onerror = (e) => console.warn('TTS error:', e.error)

  // cancel 後稍微延遲再 speak，避免 Chrome/Firefox race condition
  pendingTimeout = setTimeout(() => {
    pendingTimeout = null
    window.speechSynthesis.speak(utterance)
  }, 50)
}

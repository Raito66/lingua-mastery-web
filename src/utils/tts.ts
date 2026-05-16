const langMap: Record<string, string> = {
  JAPANESE: 'ja-JP',
  ENGLISH: 'en-US',
}

export const speak = (text: string, language: string) => {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  // Safari workaround：切換分頁後 synthesis 可能進入暫停狀態
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume()
  }

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = langMap[language] ?? 'en-US'
  utterance.rate = 0.9
  utterance.onerror = (e) => console.warn('TTS error:', e.error)

  // Chrome race condition workaround：cancel 後稍微延遲再 speak
  setTimeout(() => window.speechSynthesis.speak(utterance), 50)
}

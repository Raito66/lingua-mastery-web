# LinguaMastery Web

[English](#english) | [繁體中文](#繁體中文)

> **線上體驗**：https://lingua-mastery-web.vercel.app

---

## 繁體中文

### 專案簡介

LinguaMastery 前端網頁應用，使用 React + TypeScript 開發，提供使用者登入、單字書管理、單字學習與統計等功能。

### 技術棧

- **框架**：React 19
- **語言**：TypeScript
- **建置工具**：Vite
- **樣式**：Tailwind CSS
- **HTTP**：Axios
- **路由**：React Router v7
- **部署**：Vercel

### 主要功能

- 使用者註冊 / 登入（密碼欄位支援顯示/隱藏切換）
- Email 驗證流程
- 忘記密碼 / 重設密碼
- 註冊密碼強度驗證（至少 8 碼，須含英文字母與數字）
- 單字書管理（含編輯名稱、語言）
- 單字管理（CRUD）+ 熟練度 badge 顯示 + 進度條統計 + 搜尋與篩選
- CSV 批次匯入單字（含語言對應範例檔下載、500 筆上限提示）
- 單字勾選批次刪除
- 閃卡學習模式（含自動朗讀 TTS）
- 選擇題測驗（四選一，答後顯示綠✓紅✗）
- 間隔重複複習（SRS）
- 學習統計
- 每日學習 Streak（🔥 連續天數 + 今日練習數）
- 會員專區（顯示名稱編輯、更改密碼、關於頁）

### 本地啟動

#### 前置條件

- Node.js 18+
- 後端 API（本地或 Render）

#### 安裝與啟動

```bash
npm install
npm run dev
```

本地預設連線至 `http://localhost:8080`，可透過環境變數調整：

```bash
# .env.local
VITE_API_URL=http://localhost:8080
```

網頁預設運行於 `http://localhost:5173`

### 專案結構

```
src/
├── api/          # API 呼叫（axios）
│   ├── auth.ts
│   ├── books.ts
│   ├── words.ts
│   ├── study.ts
│   └── review.ts
├── utils/
│   └── tts.ts    # Web Speech API 封裝
├── pages/        # 各頁面元件
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── VerifyEmailPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── BooksPage.tsx
│   ├── WordsPage.tsx
│   ├── StudyPage.tsx
│   ├── QuizPage.tsx
│   ├── ReviewPage.tsx
│   └── StatsPage.tsx
└── App.tsx       # 路由設定
```

---

## English

### Overview

Frontend web application for LinguaMastery, a gamified language learning platform. Built with React + TypeScript and Vite.

> **Live Demo**: https://lingua-mastery-web.vercel.app

### Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP**: Axios
- **Routing**: React Router v7
- **Deploy**: Vercel

### Features

- User registration / login (password visibility toggle)
- Email verification flow
- Forgot password / password reset
- Registration password strength validation (min 8 chars, letters + numbers)
- Vocabulary book management (edit name & language)
- Word management (CRUD) + proficiency badge display
- CSV batch word import (language-specific sample file download, 500 row / 5MB limit info)
- Checkbox-based batch word deletion
- Flashcard study mode (with auto TTS)
- Multiple choice quiz (4 options, correct ✓ / wrong ✗ feedback)
- Spaced repetition review (SRS)
- Learning statistics
- Daily learning streak (🔥 consecutive days + today's count)
- Member profile (edit display name, change password, About page)

### Getting Started

#### Prerequisites

- Node.js 18+
- Backend API (local or Render)

#### Install & Run

```bash
npm install
npm run dev
```

Defaults to `http://localhost:8080`. Override with:

```bash
# .env.local
VITE_API_URL=http://localhost:8080
```

App runs at `http://localhost:5173`

### Project Structure

```
src/
├── api/          # API calls (axios)
│   ├── auth.ts
│   ├── books.ts
│   ├── words.ts
│   ├── study.ts
│   └── review.ts
├── utils/
│   └── tts.ts    # Web Speech API wrapper
├── pages/        # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── VerifyEmailPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── BooksPage.tsx
│   ├── WordsPage.tsx
│   ├── StudyPage.tsx
│   ├── QuizPage.tsx
│   ├── ReviewPage.tsx
│   └── StatsPage.tsx
└── App.tsx       # Route configuration
```

---

## 更新日誌 / Changelog

### v1.0.4 (2026-05-27)
- 新增：單字列表顯示每本書獨立的練習次數與答題準確率

### v1.0.3 (2026-05-25)
- 新增：單字列表支援即時搜尋（單字 / 翻譯 / 讀音）與熟練度篩選

### v1.0.2 (2026-05-25)
- 新增：單字列表頁加入熟練度進度條與各等級數量統計（已精通 / 已熟悉 / 學習中 / 未學習）

### v1.0.1 (2026-05-22)
- 新增：註冊頁加入顯示名稱欄位
- 修正：重設密碼前端驗證改為 8 碼+英數，加入 axios 30 秒 timeout

### v1.0.0 (2026-05-22)
- 新增：會員專區頁面（`/profile`）— 頭像（姓名縮寫）、顯示名稱、編輯名稱、更改密碼、關於
- 新增：頂部導覽列以頭像圓圈按鈕進入會員專區，並移除獨立登出按鈕

### v0.9.7 (2026-05-22)
- 安全：加入 401 response interceptor，token 過期自動登出並跳回登入頁
- 修正：Word 型別 reading / example 改為 string | null，符合 API 實際回傳
- 修正：StudyPage / ReviewPage submitResult 補 try/catch，失敗不中斷學習流程
- 修正：StudyPage / ReviewPage 進度條改 (index+1)/total，第一題不再顯示 0%
- 修正：WordsPage handleDelete / handleSave 補錯誤處理並顯示提示訊息
- 修正：補上 bookId NaN guard，非數字路由直接導回單字本列表

### v0.9.6 (2026-05-21)
- CSV 匯入顯示語言對應 level 說明（JLPT / TOEIC）
- 新增「下載範例檔」連結（依單字本語言自動切換日文 / 英文範例）
- 顯示匯入限制說明（500 筆、5MB、支援 Shift-JIS）

### v0.9.5 (2026-05-21)
- 登入 / 註冊頁面新增密碼眼睛 toggle（可顯示/隱藏輸入內容）
- 註冊頁新增前端密碼強度驗證（至少 8 碼，須含英文字母與數字）

### v0.8.0 (2026-05-19)
- 部署至 Vercel（https://lingua-mastery-web.vercel.app）

### v0.7.0 (2026-05-19)
- 單字列表新增熟練度 badge（未學習 / 學習中 / 已熟悉 / 已精通）

### v0.6.0 (2026-05-19)
- 新增選擇題測驗頁面（答後顯示綠✓紅✗，支援 TTS 朗讀）
- 書卡「測驗」改名「閃卡」，新增「選擇題」按鈕

### v0.5.0 (2026-05-19)
- 首頁新增 🔥 Streak 區塊（連續天數 + 今日練習數）

### v0.4.0 (2026-05-16)
- 新增 CSV 批次匯入單字（含格式錯誤提示、部分成功顯示）
- 新增單字勾選批次刪除
- 新增 TTS 發音功能（閃卡自動朗讀 + 🔊 手動重播）
- 修正跨瀏覽器 TTS race condition（Firefox / Safari）

### v0.3.0 (2026-05-15)
- 新增 SRS 間隔重複複習頁面（今日到期 + 新單字）
- 單字本列表顯示今日待複習數量徽章
- 新增單字本編輯功能（重新命名、切換語言）

### v0.2.0
- 新增 Email 驗證、忘記密碼、重設密碼頁面

### v0.1.0
- 初始版本：登入、單字書管理、閃卡測驗、學習統計

---

### v1.0.4 (2026-05-27)
- Add: Per-book study count and accuracy displayed in word list

### v1.0.3 (2026-05-25)
- Add: Word list supports live search (word / translation / reading) and proficiency filter

### v1.0.2 (2026-05-25)
- Add: Proficiency progress bar and level stats added to word list

### v1.0.1 (2026-05-22)
- Add: Display name field on register page
- Fix: Reset password frontend validation updated to 8+ chars; axios 30s timeout added

### v1.0.0 (2026-05-22)
- Add: Member profile page (/profile) — avatar (initials), display name, edit name, change password, About
- Add: Avatar circle button in header navigates to profile; standalone logout button removed

### v0.9.7 (2026-05-22)
- Security: 401 response interceptor added — auto logout on token expiry
- Fix: Word type reading / example changed to string | null
- Fix: StudyPage / ReviewPage submitResult wrapped in try/catch, failures don't interrupt flow
- Fix: Progress bar changed to (index+1)/total — no longer shows 0% on first card
- Fix: WordsPage handleDelete / handleSave error handling with user-facing messages
- Fix: bookId NaN guard added, invalid routes redirect to books list

### v0.9.6 (2026-05-21)
- CSV import: language-specific level hints (JLPT / TOEIC)
- Added language-specific sample CSV download link (Japanese / English)
- Displays import limits (500 rows, 5MB, Shift-JIS supported)

### v0.9.5 (2026-05-21)
- Added password visibility toggle on login & register pages
- Added frontend password strength validation on register page

### v0.8.0 (2026-05-19)
- Deployed to Vercel (https://lingua-mastery-web.vercel.app)

### v0.7.0 (2026-05-19)
- Added proficiency badge on word list (not learned / learning / familiar / mastered)

### v0.6.0 (2026-05-19)
- Added multiple choice quiz page (green ✓ / red ✗ feedback, TTS auto-play)
- Renamed "測驗" to "閃卡", added "選擇題" button on book cards

### v0.5.0 (2026-05-19)
- Added 🔥 Streak widget on home page (consecutive days + today's count)

### v0.4.0 (2026-05-16)
- Added CSV batch word import (with error reporting & partial success display)
- Added checkbox-based batch word deletion
- Added TTS pronunciation (auto-play on flashcard + 🔊 manual replay)
- Fixed cross-browser TTS race condition (Firefox / Safari)

### v0.3.0 (2026-05-15)
- Added SRS review page (due + new words per session)
- Review count badge on book list
- Added vocabulary book edit (rename & language switch)

### v0.2.0
- Added email verification, forgot password, password reset pages

### v0.1.0
- Initial release: login, vocabulary book management, flashcard study, learning statistics

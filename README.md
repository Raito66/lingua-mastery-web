# LinguaMastery Web

[English](#english) | [繁體中文](#繁體中文)

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

### 主要功能

- 使用者註冊 / 登入
- Email 驗證流程
- 忘記密碼 / 重設密碼
- 單字書管理（含編輯名稱、語言）
- 單字管理（CRUD）
- CSV 批次匯入單字
- 單字勾選批次刪除
- 閃卡學習模式（含自動朗讀 TTS）
- 選擇題測驗（四選一，答後顯示綠✓紅✗）
- 間隔重複複習（SRS）
- 學習統計
- 每日學習 Streak（🔥 連續天數 + 今日練習數）

### 本地啟動

#### 前置條件

- Node.js 18+
- 後端 API 運行於 `http://localhost:8080`

#### 安裝與啟動

```bash
npm install
npm run dev
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
│   ├── ReviewPage.tsx
│   └── StatsPage.tsx
└── App.tsx       # 路由設定
```

---

## English

### Overview

Frontend web application for LinguaMastery, a gamified language learning platform. Built with React + TypeScript and Vite.

### Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP**: Axios
- **Routing**: React Router v7

### Features

- User registration / login
- Email verification flow
- Forgot password / password reset
- Vocabulary book management (edit name & language)
- Word management (CRUD)
- CSV batch word import
- Checkbox-based batch word deletion
- Flashcard study mode (with auto TTS)
- Multiple choice quiz (4 options, correct ✓ / wrong ✗ feedback)
- Spaced repetition review (SRS)
- Learning statistics
- Daily learning streak (🔥 consecutive days + today's count)

### Getting Started

#### Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8080`

#### Install & Run

```bash
npm install
npm run dev
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
│   ├── ReviewPage.tsx
│   └── StatsPage.tsx
└── App.tsx       # Route configuration
```

---

## 更新日誌 / Changelog

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

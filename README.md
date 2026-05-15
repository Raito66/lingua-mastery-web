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
- 單字書管理
- 單字學習（翻牌模式）
- 學習統計

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
├── pages/        # 各頁面元件
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── VerifyEmailPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── BooksPage.tsx
│   ├── WordsPage.tsx
│   └── StudyPage.tsx
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
- Vocabulary book management
- Word study (flashcard mode)
- Learning statistics

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
├── pages/        # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── VerifyEmailPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   ├── BooksPage.tsx
│   ├── WordsPage.tsx
│   └── StudyPage.tsx
└── App.tsx       # Route configuration
```

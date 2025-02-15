# 聊天網站實作

```
npm install
npm run start
```

```
cd server
npm install
npm run start
```

## 原始碼

[GitHub Repository](https://github.com/maxhu787/react-redis-chat)

## 主要功能

- 創建帳號、個人檔案 (頭像、自介等)
- 加好友、創建群組
- 即時訊息、上線狀態
- Login session (可避免每次重新登入)
- 傳送圖片、表情符號、圖片嵌入 (image embedding)

## 使用語言與框架

### 前端

- ReactJS
- Sass
- Chakra UI
- Framer Motion (動畫)
- Formik (表單驗證)

### 後端

- Node.js
- Express
- Socket.io
- Redis
- PostgreSQL

## 實作細節

### 帳號管理

- 用戶帳號資料存儲於 PostgreSQL，包括：
  - 用戶 ID
  - 用戶名
  - 密碼 Hash
  - 頭像
  - 個人簡介
- 登錄時，使用 `express-session` + Redis 儲存 session，使用戶可在一週內免重新登入。

### 訊息傳輸

- 訊息透過 `socket.io` 即時廣播給其他用戶。
- 訊息同時存入 Redis，以提高讀取速度。

### 群組與好友

- 群組及好友關係數據存儲於 Redis，提高存取效能。
- PostgreSQL 主要用於存儲帳號資料。

### 前端開發

- 使用 Chakra UI 建立 UI。
- 利用 Framer Motion 提供動畫效果，例如：
  - 載入畫面 Logo 動畫
  - 新訊息彈出動畫

### 其他

- 採用 Docker 容器，提高系統相容性與可擴展性。

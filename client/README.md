# 🌐 Frontend - NC Score Application

This is the frontend for the **NC SCore**, built with **NextJS**.

---

## ⚙️ Getting Started

### 1️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

### 2️⃣ Start Development Server

```bash
npm run dev
# or
yarn run dev
```

By default, the app will be available at:
👉 http://localhost:3000

### 📦 Environment Variables

This project uses environment variables stored in a .env file.

A template is provided:
📄 [`./.env.example`](./.env.example)
Then update the values accordingly.

### 🧾 Environment Variables Description


| Variable Name                                            | Description                                                                                                                            |
| :------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXTAUTH_URL`                                       | Based on the port number you define (Default is usually http://localhost:3000)                                                         |
| `NEXT_PUBLIC_BackendURL`                                       | Based on the port number you define with /api after (Default is usually http://localhost:8081/api)                                     |
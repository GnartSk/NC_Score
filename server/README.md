# 🌐 Backend - NC Score Application

This is the backend for the **NC Score**, built with **NestJS**.

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
👉 http://localhost:8081

### 📦 Environment Variables

This project uses environment variables stored in a .env file.

A template is provided:
📄 [`./.env.example`](./.env.example)
Then update the values accordingly.

### 🧾 Environment Variables Description

| Variable Name                                                               | Description                                                                                                                                                                                              |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`                                                               | MongoDB connection string. See [MongoDB Atlas Guide](https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/)                                                                               |
| `PORT`                                                                      | Server port (default: `8081`)                                                                                                                                                                            |
| `JWT_SECRET`                                                                | Secret key for signing JWT tokens                                                                                                                                                                        |
| `JWT_ACCESS_TOKEN_EXPIRED`                                                  | JWT access token expiry time, e.g., `30m`                                                                                                                                                                |
| `MAIL_USER`, `MAIL_PASSWORD`                                                | Gmail account and app password. See [Google Support](https://support.google.com/accounts/answer/185833?hl=vi) and [Google Security](https://myaccount.google.com/security)                               |
| `GOOGLE_CLIENT_ID`, `GOOGLE_SECRET`, `GOOGLE_CALLBACK_URL`                  | Google OAuth2 credentials. Follow [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2/web-server) and create credentials at [Google Console](https://console.cloud.google.com/) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`      | Cloudinary credentials. See [Cloudinary Docs](https://cloudinary.com/documentation/finding_your_credentials_tutorial?utm_source=chatgpt.com)                                                             |
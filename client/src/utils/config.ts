export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.API_BASE_URL || 'https://your-render-domain.onrender.com'
  : 'http://localhost:3000';

export const CLIENT_BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXTAUTH_URL || 'https://your-vercel-domain.vercel.app'
  : 'http://localhost:3000'; 
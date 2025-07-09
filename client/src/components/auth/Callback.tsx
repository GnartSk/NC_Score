'use client';
import { useEffect } from 'react';

export default function Callback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.removeItem('html_score_data');
      localStorage.removeItem('current_subject_codes');
      localStorage.setItem('NCToken', token);
      window.location.href = '/';
    } else {
      alert('Không nhận được token!');
    }
  }, []);

  return <div>Đang xác thực...</div>;
} 
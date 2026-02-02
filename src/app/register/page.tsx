'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: 'USER',
  });

  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  const register = async () => {
    setError('');
    setSuccess('');

    if (captchaInput.toUpperCase() !== captcha) {
      setError('Captcha does not match');
      refreshCaptcha();
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error('Registration failed');
      }

      setSuccess('Account created successfully!');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>
          Join us and start booking your trips today.
        </p>

        <input
          className={styles.input}
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className={styles.input}
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className={styles.select}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="USER">Register as User</option>
          <option value="ADMIN">Register as Admin</option>
        </select>

        {/* New Captcha */}
        <div className={styles.captchaBox}>
          <div className={styles.captchaCode}>{captcha}</div>
          <button
            type="button"
            className={styles.refresh}
            onClick={refreshCaptcha}
            title="Refresh captcha"
          >
            ↻
          </button>
        </div>

        <input
          className={styles.input}
          placeholder="Enter captcha"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
        />

        <button className={styles.button} onClick={register}>
          Register
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </div>
    </div>
  );
}

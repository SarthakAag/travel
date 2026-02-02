'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const login = async () => {
    setError('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('Invalid username or password');

      const data = await res.json();

      // 🔑 THIS WAS MISSING
      localStorage.setItem('user', JSON.stringify(data));

      if (data.role === 'ADMIN') {
        router.push('/admin/flights');
      } else {
        router.push('/flights');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>

        <input
          className={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.button} onClick={login}>
          Login
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

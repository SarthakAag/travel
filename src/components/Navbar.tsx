'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

type User = {
  id: string;
  username: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false); // 🍔 mobile menu
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);

    setOpen(false); // close menu on route change
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className={styles.navbar}>
      {/* LOGO */}
      <div className={styles.logo}>✈️ Travel</div>

      {/* HAMBURGER */}
      <button
        className={styles.hamburger}
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* LINKS */}
      <div className={`${styles.links} ${open ? styles.open : ''}`}>
        {/* ================= NOT LOGGED IN ================= */}
        {!user && (
          <>
            <div className={styles.dropdown}>
              <span className={styles.dropbtn}>Login ▾</span>
              <div className={styles.dropdownMenu}>
                <Link href="/login?role=user">User Login</Link>
                <Link href="/login?role=admin">Admin Login</Link>
              </div>
            </div>

            <Link href="/register" className={styles.register}>
              Register
            </Link>
          </>
        )}

        {/* ================= USER ================= */}
        {user?.role === 'USER' && (
          <>
            <span className={styles.welcome}>
              Hi, {user.fullName}
            </span>

            <Link href="/hotels" className={styles.navLink}>
              Hotels
            </Link>

            {/* ✅ ADDED FLIGHTS */}
            <Link href="/flights" className={styles.navLink}>
              Flights
            </Link>

            <Link href="/my-bookings" className={styles.navLink}>
              My Bookings
            </Link>

            <button className={styles.logout} onClick={logout}>
              Logout
            </button>
          </>
        )}

        {/* ================= ADMIN ================= */}
        {user?.role === 'ADMIN' && (
          <>
            <span className={styles.welcome}>
              Hi, {user.fullName}
            </span>

            <Link href="/admin/hotels" className={styles.adminLink}>
              Hotels
            </Link>

            <Link href="/admin/flights" className={styles.adminLink}>
              Flights
            </Link>

            <Link href="/admin/bookings" className={styles.adminLink}>
              Bookings
            </Link>

            <Link href="/admin/reviews" className={styles.adminLink}>
              Reviews
            </Link>

            <button className={styles.logout} onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

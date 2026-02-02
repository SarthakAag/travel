import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.container}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>✈️ Travel Booking App</h1>
        <p className={styles.subtitle}>
          Book flights and hotels easily, anytime, anywhere.
        </p>
      </div>
    </main>
  );
}

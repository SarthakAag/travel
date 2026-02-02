'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Flight = {
  id: string;
  flightNumber: string;
  source: string;
  destination: string;
  price: number;
  averageRating: number;
  reviewCount: number;
};

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const loadFlights = async () => {
    const res = await fetch('http://localhost:8080/api/flights');
    setFlights(await res.json());
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const bookFlight = async (flight: Flight) => {
    if (!user) {
      alert('Please login to book a flight');
      return;
    }

    await fetch('http://localhost:8080/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        flightId: flight.id,
        amountPaid: flight.price,
      }),
    });

    alert('Flight booked successfully!');
  };

  return (
    <div style={page}>
      <h1 style={title}>Available Flights</h1>

      {flights.length === 0 && (
        <p style={muted}>No flights available</p>
      )}

      <div style={grid}>
        {flights.map(f => (
          <div
            key={f.id}
            style={card}
            onMouseEnter={e => {
              if (window.innerWidth > 768) {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 28px rgba(0,0,0,0.08)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(0,0,0,0.05)';
            }}
          >
            <div>
              <h3 style={{ marginBottom: 6 }}>
                {f.flightNumber}
              </h3>

              <p style={muted}>
                {f.source} → {f.destination}
              </p>

              <p style={{ fontWeight: 600, marginTop: 6 }}>
                ₹{f.price}
              </p>

              {/* ⭐ RATING */}
              <p style={{ marginTop: 6 }}>
                ⭐ {f.averageRating?.toFixed(1) || '0.0'}{' '}
                <span style={muted}>
                  ({f.reviewCount || 0} reviews)
                </span>
              </p>
            </div>

            {/* ACTIONS */}
            <div style={actions}>
              <button
                style={primaryBtn}
                onClick={() => bookFlight(f)}
              >
                Book Flight
              </button>

              <button
                style={secondaryBtn}
                onClick={() =>
                  router.push(`/flights/${f.id}`)
                }
              >
                View Reviews
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page: React.CSSProperties = {
  paddingTop: 96,
  paddingLeft: 16,
  paddingRight: 16,
  paddingBottom: 24,
  background: '#f5f6fa',
  minHeight: '100vh',
};

const title: React.CSSProperties = {
  marginBottom: 24,
  fontSize: 'clamp(22px, 3vw, 30px)',
};

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 20,
  maxWidth: 1000,
};

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 20,
  border: '1px solid #e5e7eb',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const actions: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  marginTop: 14,
  flexWrap: 'wrap',
};

const primaryBtn: React.CSSProperties = {
  flex: 1,
  padding: '10px 14px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 600,
};

const secondaryBtn: React.CSSProperties = {
  flex: 1,
  padding: '10px 14px',
  background: '#eef2ff',
  color: '#1e40af',
  border: '1px solid #c7d2fe',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 500,
};

const muted: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 14,
};

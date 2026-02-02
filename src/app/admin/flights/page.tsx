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

export default function AdminFlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [form, setForm] = useState({
    flightNumber: '',
    source: '',
    destination: '',
    price: '',
  });

  const router = useRouter();

  // ================= LOAD FLIGHTS =================
  const loadFlights = async () => {
    const res = await fetch('http://localhost:8080/api/admin/flights');
    setFlights(await res.json());
  };

  useEffect(() => {
    loadFlights();
  }, []);

  // ================= ADD FLIGHT =================
  const addFlight = async () => {
    await fetch('http://localhost:8080/api/admin/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
      }),
    });

    setForm({
      flightNumber: '',
      source: '',
      destination: '',
      price: '',
    });

    loadFlights();
  };

  // ================= DELETE FLIGHT =================
  const deleteFlight = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flight?')) return;

    await fetch(`http://localhost:8080/api/admin/flights/${id}`, {
      method: 'DELETE',
    });

    loadFlights();
  };

  // ================= UI =================
  return (
    <div style={page}>
      <h1 style={title}>Admin – Manage Flights</h1>

      {/* ===== ADD FLIGHT ===== */}
      <div style={card}>
        <h3 style={{ marginBottom: 14 }}>Add New Flight</h3>

        <input
          style={input}
          placeholder="Flight Number"
          value={form.flightNumber}
          onChange={e =>
            setForm({ ...form, flightNumber: e.target.value })
          }
        />

        <input
          style={input}
          placeholder="From"
          value={form.source}
          onChange={e =>
            setForm({ ...form, source: e.target.value })
          }
        />

        <input
          style={input}
          placeholder="To"
          value={form.destination}
          onChange={e =>
            setForm({ ...form, destination: e.target.value })
          }
        />

        <input
          style={input}
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <button style={primaryBtn} onClick={addFlight}>
          Add Flight
        </button>
      </div>

      {/* ===== FLIGHTS LIST ===== */}
      <h3 style={{ marginBottom: 14 }}>Existing Flights</h3>

      {flights.length === 0 && (
        <p style={muted}>No flights added yet</p>
      )}

      <div style={grid}>
        {flights.map(f => (
          <div key={f.id} style={flightCard}>
            <h4>{f.flightNumber}</h4>

            <p style={muted}>
              {f.source} → {f.destination}
            </p>

            <p style={{ fontWeight: 600 }}>₹{f.price}</p>

            <p style={{ marginTop: 6 }}>
              ⭐ {f.averageRating?.toFixed(1) || '0.0'}{' '}
              <span style={muted}>
                ({f.reviewCount || 0} reviews)
              </span>
            </p>

            {/* ===== ACTION BUTTONS ===== */}
            <div style={btnGroup}>
              <button
                style={secondaryBtn}
                onClick={() =>
                  router.push(`/admin/flights/${f.id}/reviews`)
                }
              >
                View Reviews
              </button>

              <button
                style={dangerBtn}
                onClick={() => deleteFlight(f.id)}
              >
                Delete
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
  paddingBottom: 16,
  background: '#f5f6fa',
  minHeight: '100vh',
};

const title: React.CSSProperties = {
  marginBottom: 24,
  fontSize: 'clamp(22px, 3vw, 28px)',
};

const card: React.CSSProperties = {
  background: '#fff',
  padding: 20,
  borderRadius: 16,
  maxWidth: 520,
  width: '100%',
  marginBottom: 36,
  boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
};

const input: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  marginBottom: 12,
  borderRadius: 10,
  border: '1px solid #d1d5db',
  fontSize: 15,
};

const primaryBtn: React.CSSProperties = {
  marginTop: 10,
  padding: '12px 18px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 600,
  width: '100%',
};

const secondaryBtn: React.CSSProperties = {
  flex: 1,
  padding: '10px 16px',
  background: '#eef2ff',
  color: '#1e40af',
  border: '1px solid #c7d2fe',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 500,
};

const dangerBtn: React.CSSProperties = {
  flex: 1,
  padding: '10px 16px',
  background: '#fee2e2',
  color: '#991b1b',
  border: '1px solid #fecaca',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 600,
};

const btnGroup: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  marginTop: 12,
};

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 20,
};

const flightCard: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 18,
  border: '1px solid #e5e7eb',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
};

const muted: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 14,
};

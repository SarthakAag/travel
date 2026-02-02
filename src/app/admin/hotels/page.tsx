'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Hotel = {
  id: string;
  name: string;
  city: string;
  address: string;
  pricePerNight: number;
  description: string;
  imageUrl: string;
};

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [form, setForm] = useState({
    name: '',
    city: '',
    address: '',
    pricePerNight: '',
    description: '',
    imageUrl: '',
  });

  const loadHotels = async () => {
    const res = await fetch('http://localhost:8080/api/admin/hotels');
    setHotels(await res.json());
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const addHotel = async () => {
    await fetch('http://localhost:8080/api/admin/hotels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        pricePerNight: Number(form.pricePerNight),
      }),
    });

    setForm({
      name: '',
      city: '',
      address: '',
      pricePerNight: '',
      description: '',
      imageUrl: '',
    });

    loadHotels();
  };

  const deleteHotel = async (id: string) => {
    await fetch(`http://localhost:8080/api/admin/hotels/${id}`, {
      method: 'DELETE',
    });
    loadHotels();
  };

  return (
    <div
      style={{
        padding: 24,
        paddingTop: 96, // ✅ navbar offset
        background: '#f5f6fa',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ marginBottom: 24 }}>Admin – Hotels</h1>

      {/* ===== ADD HOTEL FORM ===== */}
      <div
        style={{
          background: '#fff',
          padding: 24,
          borderRadius: 14,
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          maxWidth: 640,
          marginBottom: 40,
        }}
      >
        <h3 style={{ marginBottom: 16 }}>Add New Hotel</h3>

        <div style={{ display: 'grid', gap: 12 }}>
          <input
            style={inputStyle}
            placeholder="Hotel Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            style={inputStyle}
            placeholder="City"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
          />

          <input
            style={inputStyle}
            placeholder="Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />

          <input
            style={inputStyle}
            type="number"
            placeholder="Price per night"
            value={form.pricePerNight}
            onChange={e =>
              setForm({ ...form, pricePerNight: e.target.value })
            }
          />

          <textarea
            style={{ ...inputStyle, height: 90 }}
            placeholder="Description"
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            style={inputStyle}
            placeholder="Image URL (public link)"
            value={form.imageUrl}
            onChange={e =>
              setForm({ ...form, imageUrl: e.target.value })
            }
          />

          <button
            onClick={addHotel}
            style={primaryButton}
          >
            ➕ Add Hotel
          </button>
        </div>
      </div>

      {/* ===== HOTEL LIST ===== */}
      <h3 style={{ marginBottom: 16 }}>Existing Hotels</h3>

      {hotels.length === 0 && <p>No hotels added yet</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}
      >
        {hotels.map(h => (
          <div
            key={h.id}
            style={{
              background: '#fff',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s ease',
            }}
          >
            <Link
              href={`/admin/hotels/${h.id}/reviews`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ cursor: 'pointer' }}>
                {h.imageUrl && (
                  <img
                    src={h.imageUrl}
                    alt={h.name}
                    style={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                    }}
                  />
                )}

                <div style={{ padding: 16 }}>
                  <h4>{h.name}</h4>
                  <p style={{ color: '#6b7280' }}>{h.city}</p>

                  <p style={{ fontWeight: 600, marginTop: 6 }}>
                    ₹{h.pricePerNight} / night
                  </p>

                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: 10,
                      color: '#2563eb',
                      fontWeight: 500,
                    }}
                  >
                    View Reviews →
                  </span>
                </div>
              </div>
            </Link>

            <div style={{ padding: 16, paddingTop: 0 }}>
              <button
                style={dangerButton}
                onClick={() => deleteHotel(h.id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #d1d5db',
  fontSize: 14,
};

const primaryButton: React.CSSProperties = {
  marginTop: 8,
  padding: '12px 16px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  fontWeight: 600,
  cursor: 'pointer',
};

const dangerButton: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
};

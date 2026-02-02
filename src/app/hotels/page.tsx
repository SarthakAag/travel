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
  averageRating: number;
  reviewCount: number;
};

/* ⭐ STAR RENDER */
function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <span style={{ color: '#f59e0b' }}>
      {'★'.repeat(full)}
      {half && '☆'}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/hotels')
      .then(res => res.json())
      .then(setHotels);
  }, []);

  return (
    <div style={page}>
      <h1 style={title}>Explore Hotels</h1>

      {hotels.length === 0 && (
        <p style={muted}>No hotels found</p>
      )}

      <div style={grid}>
        {hotels.map(h => (
          <Link
            key={h.id}
            href={`/hotels/${h.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={card}
              onMouseEnter={e => {
                if (window.innerWidth > 768) {
                  e.currentTarget.style.transform =
                    'translateY(-6px)';
                  e.currentTarget.style.boxShadow =
                    '0 18px 40px rgba(0,0,0,0.12)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform =
                  'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(0,0,0,0.08)';
              }}
            >
              {/* IMAGE */}
              {h.imageUrl && (
                <div style={imageWrap}>
                  <img
                    src={h.imageUrl}
                    alt={h.name}
                    style={image}
                  />
                  <div style={gradient} />
                </div>
              )}

              <div style={content}>
                <h3 style={name}>{h.name}</h3>

                {/* ⭐ RATING */}
                <div style={ratingRow}>
                  <StarRating rating={h.averageRating || 0} />
                  <span style={ratingValue}>
                    {(h.averageRating || 0).toFixed(1)}
                  </span>
                  <span style={reviewCount}>
                    ({h.reviewCount || 0})
                  </span>
                </div>

                <p style={city}>{h.city}</p>

                <p style={price}>
                  ₹{h.pricePerNight}
                  <span style={perNight}> / night</span>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page: React.CSSProperties = {
  paddingTop: 96, // navbar safe
  paddingLeft: 16,
  paddingRight: 16,
  paddingBottom: 32,
  background: '#f5f6fa',
  minHeight: '100vh',
};

const title: React.CSSProperties = {
  marginBottom: 28,
  fontSize: 'clamp(24px, 3vw, 32px)',
};

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 24,
};

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 18,
  overflow: 'hidden',
  transition: 'all 0.25s ease',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
};

const imageWrap: React.CSSProperties = {
  position: 'relative',
  height: 200,
  overflow: 'hidden',
};

const image: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const gradient: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(to top, rgba(0,0,0,0.35), transparent)',
};

const content: React.CSSProperties = {
  padding: 16,
};

const name: React.CSSProperties = {
  marginBottom: 6,
  fontSize: 18,
};

const ratingRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const ratingValue: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 14,
};

const reviewCount: React.CSSProperties = {
  fontSize: 13,
  color: '#6b7280',
};

const city: React.CSSProperties = {
  marginTop: 6,
  color: '#6b7280',
  fontSize: 14,
};

const price: React.CSSProperties = {
  marginTop: 10,
  fontWeight: 700,
  fontSize: 18,
};

const perNight: React.CSSProperties = {
  fontWeight: 400,
  fontSize: 14,
  color: '#6b7280',
};

const muted: React.CSSProperties = {
  color: '#6b7280',
};

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Reviews from '@/components/Reviews';

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

export default function HotelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8080/api/hotels/${id}`)
      .then(res => res.json())
      .then(setHotel);
  }, [id]);

  if (!hotel) {
    return (
      <div style={loadingWrap}>
        <p>Loading hotel details...</p>
      </div>
    );
  }

  return (
    <div style={page}>
      {/* ================= HERO IMAGE ================= */}
      {hotel.imageUrl && (
        <div style={heroWrap}>
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            style={heroImage}
          />
          <div style={heroOverlay} />
        </div>
      )}

      {/* ================= HOTEL CARD ================= */}
      <div style={card}>
        <h1 style={title}>{hotel.name}</h1>

        <p style={city}>{hotel.city}</p>

        {/* ⭐ RATING */}
        <div style={ratingRow}>
          <span style={star}>⭐</span>
          <strong>
            {hotel.averageRating?.toFixed(1) || '0.0'}
          </strong>
          <span style={muted}>
            ({hotel.reviewCount || 0} reviews)
          </span>
        </div>

        <div style={infoGrid}>
          <div>
            <span style={label}>Price</span>
            <p style={price}>
              ₹{hotel.pricePerNight}
              <span style={perNight}> / night</span>
            </p>
          </div>

          <div>
            <span style={label}>Address</span>
            <p>{hotel.address}</p>
          </div>
        </div>

        <p style={description}>{hotel.description}</p>
      </div>

      {/* ================= REVIEWS ================= */}
      <div style={reviewsWrap}>
        <Reviews targetId={hotel.id} targetType="HOTEL" />
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page: React.CSSProperties = {
  paddingTop: 96, // navbar safe
  paddingBottom: 40,
  background: '#f5f6fa',
  minHeight: '100vh',
};

const loadingWrap: React.CSSProperties = {
  paddingTop: 120,
  textAlign: 'center',
};

const heroWrap: React.CSSProperties = {
  position: 'relative',
  height: 'clamp(240px, 45vw, 420px)', // bigger on desktop
  maxHeight: 420,
  overflow: 'hidden',
};



const heroImage: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
};

const heroOverlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.6))',
};

const card: React.CSSProperties = {
  background: '#fff',
  maxWidth: 900,
  margin: '-80px auto 0',
  padding: 24,
  borderRadius: 20,
  border: '1px solid #e5e7eb',
  boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
};

const title: React.CSSProperties = {
  fontSize: 'clamp(24px, 3vw, 32px)',
  marginBottom: 4,
};

const city: React.CSSProperties = {
  color: '#6b7280',
  marginBottom: 12,
};

const ratingRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginBottom: 16,
};

const star: React.CSSProperties = {
  color: '#f59e0b',
};

const infoGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 20,
  marginBottom: 16,
};

const label: React.CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

const price: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
};

const perNight: React.CSSProperties = {
  fontSize: 14,
  color: '#6b7280',
  fontWeight: 400,
};

const description: React.CSSProperties = {
  marginTop: 10,
  lineHeight: 1.6,
};

const reviewsWrap: React.CSSProperties = {
  maxWidth: 900,
  margin: '36px auto 0',
  paddingLeft: 16,
  paddingRight: 16,
};

const muted: React.CSSProperties = {
  color: '#6b7280',
};

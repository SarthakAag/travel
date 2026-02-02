'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Reviews from '@/components/Reviews';

type Flight = {
  id: string;
  flightNumber: string;
  source: string;
  destination: string;
  date: string;
  price: number;
  averageRating: number;
  reviewCount: number;
};

export default function FlightDetailsPage() {
  const { flightId } = useParams<{ flightId: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);

  useEffect(() => {
    if (!flightId) return;

    fetch(`http://localhost:8080/api/flights/${flightId}`)
      .then(res => res.json())
      .then(setFlight);
  }, [flightId]);

  if (!flight) {
    return (
      <div style={loadingWrap}>
        <div style={loaderCard}>✈️ Loading flight details...</div>
      </div>
    );
  }

  return (
    <div style={page}>
      {/* ================= HERO FLIGHT CARD ================= */}
      <div style={heroCard}>
        <div style={heroTop}>
          <h1 style={title}>{flight.flightNumber}</h1>

          <span style={ratingBadge}>
            ⭐ {flight.averageRating?.toFixed(1) || '0.0'} ·{' '}
            {flight.reviewCount || 0} reviews
          </span>
        </div>

        <p style={route}>
          {flight.source} <span style={arrow}>→</span> {flight.destination}
        </p>

        <div style={infoGrid}>
          <div style={infoBox}>
            <span style={label}>Date</span>
            <p style={value}>{flight.date}</p>
          </div>

          <div style={infoBox}>
            <span style={label}>Price</span>
            <p style={price}>₹{flight.price}</p>
          </div>

          <div style={infoBox}>
            <span style={label}>Comfort</span>
            <p style={value}>Economy</p>
          </div>
        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <div style={reviewsSection}>
        <Reviews targetId={flight.id} targetType="FLIGHT" />
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page: React.CSSProperties = {
  paddingTop: 96,
  paddingLeft: 16,
  paddingRight: 16,
  paddingBottom: 40,
  background:
    'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const loadingWrap: React.CSSProperties = {
  paddingTop: 120,
  display: 'flex',
  justifyContent: 'center',
};

const loaderCard: React.CSSProperties = {
  background: '#fff',
  padding: 20,
  borderRadius: 14,
  boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
  fontWeight: 600,
};

const heroCard: React.CSSProperties = {
  background: '#ffffff',
  width: '100%',
  maxWidth: 950,
  padding: 28,
  borderRadius: 24,
  border: '1px solid #e5e7eb',
  boxShadow: '0 16px 40px rgba(0,0,0,0.08)',
};

const heroTop: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 12,
};

const title: React.CSSProperties = {
  fontSize: 'clamp(26px, 3.2vw, 36px)',
  fontWeight: 800,
};

const ratingBadge: React.CSSProperties = {
  background: '#fef3c7',
  color: '#92400e',
  padding: '6px 12px',
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
};

const route: React.CSSProperties = {
  marginTop: 14,
  marginBottom: 26,
  fontSize: 18,
  fontWeight: 500,
  color: '#374151',
};

const arrow: React.CSSProperties = {
  margin: '0 8px',
  color: '#2563eb',
};

const infoGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 20,
};

const infoBox: React.CSSProperties = {
  background: '#f9fafb',
  padding: 16,
  borderRadius: 14,
  border: '1px solid #e5e7eb',
};

const label: React.CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: 0.6,
};

const value: React.CSSProperties = {
  marginTop: 4,
  fontSize: 16,
  fontWeight: 600,
};

const price: React.CSSProperties = {
  marginTop: 4,
  fontSize: 20,
  fontWeight: 800,
  color: '#16a34a',
};

const reviewsSection: React.CSSProperties = {
  width: '100%',
  maxWidth: 950,
  marginTop: 40,
};

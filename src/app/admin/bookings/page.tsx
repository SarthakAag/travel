'use client';

import { useEffect, useState } from 'react';

type Booking = {
  id: string;
  userId: string;
  amountPaid: number;
  cancelled: boolean;
  cancellationReason?: string;
  refundAmount: number;
  refundStatus: string;
};

export default function AdminBookingsPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);

  const loadAllBookings = async () => {
    const res = await fetch('http://localhost:8080/api/admin/bookings');
    setAllBookings(await res.json());
  };

  const loadCancelledBookings = async () => {
    const res = await fetch(
      'http://localhost:8080/api/admin/bookings/cancelled'
    );
    setCancelledBookings(await res.json());
  };

  useEffect(() => {
    loadAllBookings();
    loadCancelledBookings();
  }, []);

  const updateRefundStatus = async (
    bookingId: string,
    status: string
  ) => {
    await fetch(
      `http://localhost:8080/api/admin/bookings/${bookingId}/refund?status=${status}`,
      { method: 'POST' }
    );

    loadAllBookings();
    loadCancelledBookings();
  };

  return (
    <div style={page}>
      <h1 style={title}>Admin – Bookings Dashboard</h1>

      {/* ================= ALL BOOKINGS ================= */}
      <section style={section}>
        <h2 style={sectionTitle}>All Bookings</h2>

        {allBookings.length === 0 && (
          <p style={muted}>No bookings found</p>
        )}

        <div style={grid}>
          {allBookings.map(b => (
            <div key={b.id} style={card}>
              <p style={label}>Booking ID</p>
              <p>{b.id}</p>

              <p style={label}>User ID</p>
              <p>{b.userId}</p>

              <p style={label}>Amount Paid</p>
              <p style={{ fontWeight: 600 }}>₹{b.amountPaid}</p>

              <span
                style={{
                  ...statusBadge,
                  background: b.cancelled
                    ? '#fee2e2'
                    : '#dcfce7',
                  color: b.cancelled
                    ? '#991b1b'
                    : '#166534',
                }}
              >
                {b.cancelled ? 'Cancelled' : 'Active'}
              </span>

              {b.cancelled && (
                <p style={{ marginTop: 6 }}>
                  <strong>Refund:</strong> {b.refundStatus}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= CANCELLED & REFUNDS ================= */}
      <section style={section}>
        <h2 style={sectionTitle}>Refund Management</h2>

        {cancelledBookings.length === 0 && (
          <p style={muted}>No cancelled bookings 🎉</p>
        )}

        <div style={grid}>
          {cancelledBookings.map(b => (
            <div key={b.id} style={{ ...card, background: '#f9fafb' }}>
              <p style={label}>Booking ID</p>
              <p>{b.id}</p>

              <p style={label}>User ID</p>
              <p>{b.userId}</p>

              <p style={label}>Refund Amount</p>
              <p style={{ fontWeight: 600 }}>
                ₹{b.refundAmount}
              </p>

              <p style={label}>Reason</p>
              <p>{b.cancellationReason}</p>

              <p style={label}>Refund Status</p>

              <select
                value={b.refundStatus}
                onChange={e =>
                  updateRefundStatus(b.id, e.target.value)
                }
                style={select}
              >
                <option value="PENDING">Pending</option>
                <option value="PROCESSED">Processed</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ================= STYLES ================= */

const page: React.CSSProperties = {
  paddingTop: 96,
  paddingLeft: 20,
  paddingRight: 20,
  paddingBottom: 40,
  background: '#f5f6fa',
  minHeight: '100vh',
};

const title: React.CSSProperties = {
  marginBottom: 24,
};

const section: React.CSSProperties = {
  marginBottom: 40,
};

const sectionTitle: React.CSSProperties = {
  marginBottom: 16,
};

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: 20,
};

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 14,
  padding: 16,
  border: '1px solid #e5e7eb',
  boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
};

const label: React.CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  marginTop: 6,
};

const muted: React.CSSProperties = {
  color: '#6b7280',
};

const statusBadge: React.CSSProperties = {
  display: 'inline-block',
  marginTop: 10,
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
};

const select: React.CSSProperties = {
  marginTop: 6,
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  width: '100%',
};

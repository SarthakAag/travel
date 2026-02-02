'use client';

import { useEffect, useState } from 'react';

type Booking = {
  id: string;
  userId: string;
  amountPaid: number;
  bookingTime: string;
  cancelled: boolean;
  refundAmount: number;
  refundStatus: string;
  cancellationReason?: string;
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<any>(null);

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Load user's bookings
  const loadBookings = async () => {
    if (!user) return;

    const res = await fetch(
      `http://localhost:8080/api/bookings/user/${user.id}`
    );
    setBookings(await res.json());
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  // Cancel booking
  const cancelBooking = async (bookingId: string, reason: string) => {
    if (!reason || !user) return;

    await fetch(
      `http://localhost:8080/api/bookings/${bookingId}/cancel?userId=${user.id}&reason=${reason}`,
      { method: 'POST' }
    );

    alert('Booking cancelled. Refund initiated.');
    loadBookings();
  };

  // Refund message helper
  const getRefundMessage = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Refund initiated • Expected in 3–5 business days';
      case 'PROCESSED':
        return 'Refund processed • Bank confirmation pending';
      case 'COMPLETED':
        return 'Refund completed • Amount credited';
      default:
        return '';
    }
  };

  return (
    <div style={page}>
      <h1 style={title}>My Bookings</h1>

      {bookings.length === 0 && (
        <p style={muted}>No bookings found</p>
      )}

      <div style={grid}>
        {bookings.map(b => (
          <div key={b.id} style={card}>
            {/* ===== HEADER ===== */}
            <div style={header}>
              <span style={bookingId}>#{b.id}</span>
              <span
                style={{
                  ...statusBadge,
                  background: b.cancelled ? '#fee2e2' : '#dcfce7',
                  color: b.cancelled ? '#b91c1c' : '#166534',
                }}
              >
                {b.cancelled ? 'Cancelled' : 'Active'}
              </span>
            </div>

            {/* ===== DETAILS ===== */}
            <div style={details}>
              <div>
                <span style={label}>Amount Paid</span>
                <p style={price}>₹{b.amountPaid}</p>
              </div>

              <div>
                <span style={label}>Booking Time</span>
                <p>{new Date(b.bookingTime).toLocaleString()}</p>
              </div>
            </div>

            {/* ===== REFUND TRACKER ===== */}
            {b.cancelled && (
              <div style={refundBox}>
                <p>
                  <strong>Refund Amount:</strong> ₹{b.refundAmount}
                </p>

                <p>
                  <strong>Status:</strong>{' '}
                  <span style={refundStatus}>
                    {b.refundStatus}
                  </span>
                </p>

                <p style={refundMessage}>
                  {getRefundMessage(b.refundStatus)}
                </p>

                {/* Timeline */}
                <div style={timeline}>
                  <span style={step(true)}>● Initiated</span>
                  <span
                    style={step(
                      ['PROCESSED', 'COMPLETED'].includes(
                        b.refundStatus
                      )
                    )}
                  >
                    ● Processed
                  </span>
                  <span
                    style={step(b.refundStatus === 'COMPLETED')}
                  >
                    ● Completed
                  </span>
                </div>
              </div>
            )}

            {/* ===== CANCEL ===== */}
            {!b.cancelled && user?.id === b.userId && (
              <select
                style={select}
                onChange={e =>
                  cancelBooking(b.id, e.target.value)
                }
              >
                <option value="">Cancel booking</option>
                <option value="CHANGE_OF_PLANS">
                  Change of plans
                </option>
                <option value="FOUND_BETTER_PRICE">
                  Found better price
                </option>
                <option value="MEDICAL_EMERGENCY">
                  Medical emergency
                </option>
                <option value="FLIGHT_DELAY">
                  Flight delay
                </option>
                <option value="OTHER">Other</option>
              </select>
            )}
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
  paddingBottom: 32,
  background: '#f5f6fa',
  minHeight: '100vh',
};

const title: React.CSSProperties = {
  marginBottom: 24,
  fontSize: 'clamp(24px, 3vw, 32px)',
};

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 20,
};

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 20,
  border: '1px solid #e5e7eb',
  boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
};

const header: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
  flexWrap: 'wrap',
  gap: 8,
};

const bookingId: React.CSSProperties = {
  fontSize: 13,
  color: '#6b7280',
};

const statusBadge: React.CSSProperties = {
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
};

const details: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: 12,
  marginBottom: 12,
};

const label: React.CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  textTransform: 'uppercase',
};

const price: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 18,
};

const refundBox: React.CSSProperties = {
  marginTop: 12,
  padding: 14,
  background: '#f9fafb',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
};

const refundStatus: React.CSSProperties = {
  fontWeight: 600,
};

const refundMessage: React.CSSProperties = {
  fontSize: 14,
  color: '#555',
  marginTop: 4,
};

const timeline: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  marginTop: 10,
  flexWrap: 'wrap',
};

const step = (active: boolean): React.CSSProperties => ({
  color: active ? '#16a34a' : '#d1d5db',
  fontSize: 14,
  fontWeight: 500,
});

const select: React.CSSProperties = {
  marginTop: 14,
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #d1d5db',
  cursor: 'pointer',
};

const muted: React.CSSProperties = {
  color: '#6b7280',
};

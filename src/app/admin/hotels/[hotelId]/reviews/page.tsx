'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Reply = {
  userName: string;
  role: 'USER' | 'ADMIN';
  message: string;
};

type Review = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  flagged: boolean;
  replies: Reply[];
};

export default function AdminHotelReviews() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const admin =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null;

  // ================= LOAD REVIEWS =================
  const loadReviews = async () => {
    const res = await fetch(
      `http://localhost:8080/api/admin/hotels/${hotelId}/reviews`
    );
    setReviews(await res.json());
  };

  useEffect(() => {
    loadReviews();
  }, [hotelId]);

  // ================= ADMIN REPLY =================
  const reply = async (reviewId: string) => {
    if (!replyText[reviewId]) return;

    await fetch(
      `http://localhost:8080/api/reviews/${reviewId}/reply`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: admin?.fullName || 'Admin',
          role: 'ADMIN',
          message: replyText[reviewId],
        }),
      }
    );

    setReplyText(prev => ({ ...prev, [reviewId]: '' }));
    loadReviews();
  };

  // ================= REMOVE REVIEW =================
  const removeReview = async (reviewId: string) => {
    if (!confirm('Remove this review?')) return;

    await fetch(
      `http://localhost:8080/api/admin/reviews/${reviewId}/remove`,
      { method: 'POST' }
    );

    loadReviews();
  };

  // ================= UI =================
  return (
    <div style={page}>
      <h1 style={title}>Hotel Reviews (Admin)</h1>

      {reviews.length === 0 && (
        <p style={muted}>No reviews found</p>
      )}

      <div style={list}>
        {reviews.map(r => (
          <div key={r.id} style={reviewCard}>
            {/* ===== HEADER ===== */}
            <div style={header}>
              <div>
                <strong>{r.userName}</strong>
                <span style={rating}> • {r.rating} ⭐</span>
              </div>

              {r.flagged && (
                <span style={flag}>🚩 Flagged</span>
              )}
            </div>

            {/* ===== COMMENT ===== */}
            <p style={comment}>{r.comment}</p>

            {/* ===== REPLIES ===== */}
            {r.replies?.length > 0 && (
              <div style={replySection}>
                {r.replies.map((rep, i) => (
                  <div
                    key={i}
                    style={{
                      ...replyBubble,
                      background:
                        rep.role === 'ADMIN'
                          ? '#eef2ff'
                          : '#f9fafb',
                    }}
                  >
                    <strong>
                      {rep.userName}
                      {rep.role === 'ADMIN' && ' (Admin)'}
                    </strong>
                    <p>{rep.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ===== ADMIN ACTIONS ===== */}
            <textarea
              placeholder="Reply as admin..."
              value={replyText[r.id] || ''}
              onChange={e =>
                setReplyText(prev => ({
                  ...prev,
                  [r.id]: e.target.value,
                }))
              }
              style={textarea}
            />

            <div style={actions}>
              <button
                style={replyBtn}
                onClick={() => reply(r.id)}
              >
                💬 Reply
              </button>

              <button
                style={deleteBtn}
                onClick={() => removeReview(r.id)}
              >
                🗑 Remove
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
  fontSize: 'clamp(22px, 3vw, 28px)',
};

const list: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  maxWidth: 900,
};

const reviewCard: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 20,
  border: '1px solid #e5e7eb',
  boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
};

const header: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 6,
  marginBottom: 8,
};

const rating: React.CSSProperties = {
  color: '#f59e0b',
  fontWeight: 600,
};

const flag: React.CSSProperties = {
  color: '#dc2626',
  fontWeight: 600,
  fontSize: 14,
};

const comment: React.CSSProperties = {
  marginBottom: 10,
  lineHeight: 1.5,
};

const replySection: React.CSSProperties = {
  marginLeft: 12,
  marginTop: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const replyBubble: React.CSSProperties = {
  padding: 10,
  borderRadius: 10,
  fontSize: 14,
};

const textarea: React.CSSProperties = {
  width: '100%',
  marginTop: 12,
  padding: 10,
  borderRadius: 10,
  border: '1px solid #d1d5db',
  fontSize: 14,
};

const actions: React.CSSProperties = {
  marginTop: 12,
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
};

const replyBtn: React.CSSProperties = {
  padding: '10px 14px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 600,
  flex: 1,
};

const deleteBtn: React.CSSProperties = {
  padding: '10px 14px',
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 600,
  flex: 1,
};

const muted: React.CSSProperties = {
  color: '#6b7280',
};

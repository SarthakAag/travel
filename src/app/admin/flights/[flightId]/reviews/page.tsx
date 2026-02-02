'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
  photos: string[];
  flagged: boolean;
  replies: Reply[];
  createdAt: string;
};

export default function AdminFlightReviewsPage() {
  const { flightId } = useParams<{ flightId: string }>();
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // ================= AUTH GUARD =================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [router]);

  // ================= LOAD FLIGHT REVIEWS =================
  const loadReviews = async () => {
    setLoading(true);
    const res = await fetch(
      `http://localhost:8080/api/reviews?targetId=${flightId}&targetType=FLIGHT`
    );
    const data = await res.json();
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    if (flightId) loadReviews();
  }, [flightId]);

  // ================= ADMIN REPLY =================
  const reply = async (reviewId: string) => {
    const admin = JSON.parse(localStorage.getItem('user') || '{}');
    if (!replyText[reviewId]) return;

    await fetch(
      `http://localhost:8080/api/reviews/${reviewId}/reply`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: admin.fullName,
          role: 'ADMIN',
          message: replyText[reviewId],
        }),
      }
    );

    setReplyText(prev => ({ ...prev, [reviewId]: '' }));
    loadReviews();
  };

  // ================= REMOVE REVIEW =================
  const removeReview = async (id: string) => {
    if (!confirm('Remove this review?')) return;

    await fetch(
      `http://localhost:8080/api/admin/reviews/${id}/remove`,
      { method: 'POST' }
    );

    loadReviews();
  };

  // ================= UI =================
  return (
    <div style={page}>
      <h1 style={title}>Flight Reviews (Admin)</h1>

      {loading && <p style={muted}>Loading reviews...</p>}

      {!loading && reviews.length === 0 && (
        <p style={muted}>No reviews for this flight</p>
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

            {/* ===== PHOTOS ===== */}
            {r.photos?.length > 0 && (
              <div style={photoRow}>
                {r.photos.map((p, i) => (
                  <img
                    key={i}
                    src={p}
                    alt="review"
                    style={photo}
                  />
                ))}
              </div>
            )}

            {/* ===== REPLIES ===== */}
            {r.replies?.length > 0 && (
              <div style={replySection}>
                {r.replies.map((rep, idx) => (
                  <div
                    key={idx}
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
                Reply
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
  paddingTop: 96, // navbar space
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
  gap: 8,
  marginBottom: 6,
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
  marginTop: 6,
  marginBottom: 10,
  lineHeight: 1.5,
};

const photoRow: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  marginTop: 8,
};

const photo: React.CSSProperties = {
  width: 90,
  height: 90,
  objectFit: 'cover',
  borderRadius: 10,
};

const replySection: React.CSSProperties = {
  marginTop: 12,
  marginLeft: 12,
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
  marginTop: 14,
  padding: 12,
  borderRadius: 12,
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
  padding: '10px 16px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 600,
  flex: 1,
};

const deleteBtn: React.CSSProperties = {
  padding: '10px 16px',
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

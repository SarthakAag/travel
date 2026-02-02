'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Reply = {
  userName: string;
  role: 'USER' | 'ADMIN';
  message: string;
};

type Review = {
  id: string;
  userName: string;
  targetId: string;
  targetType: 'HOTEL' | 'FLIGHT';
  rating: number;
  comment: string;
  photos: string[];
  replies: Reply[];
  helpfulCount: number;
  flagged: boolean;
  createdAt: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // ================= AUTH GUARD =================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [router]);

  // ================= LOAD FLAGGED REVIEWS =================
  const loadFlaggedReviews = async () => {
    setLoading(true);
    const res = await fetch(
      'http://localhost:8080/api/admin/reviews/flagged'
    );
    setReviews(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    loadFlaggedReviews();
  }, []);

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
    loadFlaggedReviews();
  };

  // ================= REMOVE REVIEW =================
  const removeReview = async (id: string) => {
    if (!confirm('Remove this review permanently?')) return;

    await fetch(
      `http://localhost:8080/api/admin/reviews/${id}/remove`,
      { method: 'POST' }
    );

    loadFlaggedReviews();
  };

  // ================= UI =================
  return (
    <div style={page}>
      <h1 style={title}>🚨 Flagged Reviews Moderation</h1>

      {loading && <p style={muted}>Loading reviews…</p>}

      {!loading && reviews.length === 0 && (
        <p style={muted}>No flagged reviews 🎉</p>
      )}

      <div style={grid}>
        {reviews.map(r => (
          <div key={r.id} style={card}>
            {/* HEADER */}
            <div style={header}>
              <div>
                <strong>{r.userName}</strong>
                <p style={mutedSmall}>
                  {r.targetType} • {r.rating} ⭐
                </p>
              </div>

              <span style={flagBadge}>🚩 Flagged</span>
            </div>

            {/* COMMENT */}
            <p style={{ marginTop: 8 }}>{r.comment}</p>

            {/* PHOTOS */}
            {r.photos?.length > 0 && (
              <div style={photos}>
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

            {/* REPLIES */}
            {r.replies?.map((rep, idx) => (
              <div
                key={idx}
                style={{
                  ...replyBox,
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

            {/* ADMIN REPLY */}
            <textarea
              placeholder="Reply as admin…"
              value={replyText[r.id] || ''}
              onChange={e =>
                setReplyText(prev => ({
                  ...prev,
                  [r.id]: e.target.value,
                }))
              }
              style={textarea}
            />

            {/* ACTIONS */}
            <div style={actions}>
              <button
                style={primaryBtn}
                onClick={() => reply(r.id)}
              >
                💬 Reply
              </button>

              <button
                style={dangerBtn}
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
  paddingLeft: 20,
  paddingRight: 20,
  paddingBottom: 40,
  background: '#f5f6fa',
  minHeight: '100vh',
};

const title: React.CSSProperties = {
  marginBottom: 24,
};

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: 20,
};

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 14,
  padding: 18,
  border: '1px solid #e5e7eb',
  boxShadow: '0 8px 22px rgba(0,0,0,0.06)',
};

const header: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const flagBadge: React.CSSProperties = {
  background: '#fee2e2',
  color: '#991b1b',
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
};

const muted: React.CSSProperties = {
  color: '#6b7280',
};

const mutedSmall: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 12,
};

const photos: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  marginTop: 10,
  flexWrap: 'wrap',
};

const photo: React.CSSProperties = {
  width: 90,
  height: 90,
  objectFit: 'cover',
  borderRadius: 10,
};

const replyBox: React.CSSProperties = {
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
  border: '1px solid #e5e7eb',
};

const textarea: React.CSSProperties = {
  width: '100%',
  marginTop: 12,
  padding: 10,
  borderRadius: 10,
  border: '1px solid #d1d5db',
};

const actions: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  marginTop: 12,
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

const dangerBtn: React.CSSProperties = {
  flex: 1,
  padding: '10px 14px',
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  fontWeight: 600,
};

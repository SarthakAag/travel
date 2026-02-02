'use client';

import { useEffect, useState } from 'react';

type Reply = {
  userId: string;
  userName: string;
  role: 'USER' | 'ADMIN';
  message: string;
  createdAt?: string;
};

type Review = {
  id: string;
  userId: string;
  userName: string;
  targetId: string;
  targetType: 'HOTEL' | 'FLIGHT';
  rating: number;
  comment: string;
  photos: string[];
  replies: Reply[];
  helpfulCount: number;
  flagged: boolean;
  removed: boolean;
  createdAt: string;
};

type ReviewsProps = {
  targetId: string;
  targetType: 'HOTEL' | 'FLIGHT';
};

export default function Reviews({ targetId, targetType }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sort, setSort] =
    useState<'newest' | 'helpful' | 'rating'>('newest');

  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || 'null')
      : null;

  // ================= LOAD REVIEWS =================
  const loadReviews = async () => {
    const res = await fetch(
      `http://localhost:8080/api/reviews?targetId=${targetId}&targetType=${targetType}&sort=${sort}`
    );
    setReviews(await res.json());
  };

  useEffect(() => {
    loadReviews();
  }, [targetId, targetType, sort]);

  // ================= IMAGE UPLOAD =================
  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];

    for (const file of images) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'review_photos');

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dw5qjalpw/image/upload',
        { method: 'POST', body: formData }
      );

      const data = await res.json();
      urls.push(data.secure_url);
    }
    return urls;
  };

  // ================= SUBMIT REVIEW =================
  const submitReview = async () => {
    if (!user) return alert('Please login to review');

    const photoUrls = await uploadImages();

    await fetch('http://localhost:8080/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        userName: user.fullName,
        targetId,
        targetType,
        rating,
        comment,
        photos: photoUrls,
      }),
    });

    setComment('');
    setImages([]);
    setRating(5);
    loadReviews();
  };

  // ================= ADD REPLY =================
  const submitReply = async (reviewId: string) => {
    if (!user || !replyText[reviewId]) return;

    await fetch(`http://localhost:8080/api/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        userName: user.fullName,
        role: user.role,
        message: replyText[reviewId],
      }),
    });

    setReplyText(prev => ({ ...prev, [reviewId]: '' }));
    loadReviews();
  };

  // ================= UI =================
  return (
    <div style={container}>
      <h2 style={heading}>Reviews</h2>

      {/* SORT */}
      <div style={sortRow}>
        <label>Sort:</label>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as any)}
        >
          <option value="newest">Newest</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* ADD REVIEW */}
      <div style={addCard}>
        <textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={textarea}
        />

        <div style={row}>
          <select
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>
                {n} ⭐
              </option>
            ))}
          </select>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e =>
              setImages(Array.from(e.target.files || []))
            }
          />
        </div>

        <button style={primaryBtn} onClick={submitReview}>
          Submit Review
        </button>
      </div>

      {/* REVIEW LIST */}
      {reviews.length === 0 && (
        <p style={muted}>No reviews yet</p>
      )}

      {reviews.map(r => (
        <div key={r.id} style={reviewCard}>
          <div style={reviewHeader}>
            <strong>{r.userName}</strong>
            <span>⭐ {r.rating}</span>
          </div>

          <p>{r.comment}</p>

          {r.photos?.length > 0 && (
            <div style={photoGrid}>
              {r.photos.map((p, i) => (
                <img key={i} src={p} style={photo} />
              ))}
            </div>
          )}

          <div style={actions}>
            <button
              onClick={() =>
                fetch(
                  `http://localhost:8080/api/reviews/${r.id}/helpful`,
                  { method: 'POST' }
                ).then(loadReviews)
              }
            >
              👍 Helpful ({r.helpfulCount})
            </button>

            {!r.flagged && (
              <button
                onClick={() =>
                  fetch(
                    `http://localhost:8080/api/reviews/${r.id}/flag`,
                    { method: 'POST' }
                  )
                }
              >
                🚩 Flag
              </button>
            )}
          </div>

          {/* REPLIES */}
          {r.replies?.map((rep, idx) => (
            <div key={idx} style={replyBubble}>
              <strong>
                {rep.userName}
                {rep.role === 'ADMIN' && ' (Admin)'}
              </strong>
              <p>{rep.message}</p>
            </div>
          ))}

          {user && (
            <>
              <textarea
                placeholder="Write a reply..."
                value={replyText[r.id] || ''}
                onChange={e =>
                  setReplyText(prev => ({
                    ...prev,
                    [r.id]: e.target.value,
                  }))
                }
                style={textarea}
              />
              <button
                style={secondaryBtn}
                onClick={() => submitReply(r.id)}
              >
                Reply
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* ================= STYLES ================= */

const container: React.CSSProperties = {
  marginTop: 30,
  maxWidth: 900,
};

const heading: React.CSSProperties = {
  marginBottom: 16,
};

const sortRow: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  alignItems: 'center',
  marginBottom: 16,
  flexWrap: 'wrap',
};

const addCard: React.CSSProperties = {
  background: '#fff',
  padding: 16,
  borderRadius: 12,
  marginBottom: 24,
  border: '1px solid #e5e7eb',
};

const row: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
  marginTop: 10,
};

const textarea: React.CSSProperties = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  border: '1px solid #d1d5db',
};

const primaryBtn: React.CSSProperties = {
  marginTop: 12,
  padding: '10px 14px',
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};

const secondaryBtn: React.CSSProperties = {
  marginTop: 8,
  padding: '8px 12px',
};

const reviewCard: React.CSSProperties = {
  background: '#fff',
  padding: 16,
  borderRadius: 14,
  marginBottom: 16,
  border: '1px solid #e5e7eb',
};

const reviewHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
};

const photoGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
  gap: 8,
  marginTop: 8,
};

const photo: React.CSSProperties = {
  width: '100%',
  height: 80,
  objectFit: 'cover',
  borderRadius: 6,
};

const actions: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  marginTop: 10,
  flexWrap: 'wrap',
};

const replyBubble: React.CSSProperties = {
  marginLeft: 16,
  marginTop: 8,
  padding: 10,
  background: '#f9fafb',
  borderRadius: 8,
};

const muted: React.CSSProperties = {
  color: '#6b7280',
};

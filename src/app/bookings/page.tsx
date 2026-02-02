'use client';

import { useEffect, useState } from 'react';

type Booking = {
  id: string;
  userId: string;
  flightId: string;
  amountPaid: number;
  bookingTime: string;
  cancelled: boolean;
  refundAmount: number;
  refundStatus: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // TEMP user (later from login)
  const userId = 'user123';

  const createBooking = async () => {
    await fetch('http://localhost:8080/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        flightId: 'flight456',
        amountPaid: 5000,
      }),
    });

    loadBookings();
  };

  const loadBookings = async () => {
    const res = await fetch(
      `http://localhost:8080/api/bookings/user/${userId}`
    );
    setBookings(await res.json());
  };

  const cancelBooking = async (bookingId: string, reason: string) => {
    if (!reason) return;

    await fetch(
      `http://localhost:8080/api/bookings/${bookingId}/cancel?reason=${reason}`,
      { method: 'POST' }
    );

    alert('Booking cancelled. Refund initiated.');
    loadBookings();
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>My Bookings</h1>

      <button onClick={createBooking}>Book Flight</button>

      <hr />

      {bookings.length === 0 && <p>No bookings yet</p>}

      {bookings.map(b => (
        <div
          key={b.id}
          style={{
            border: '1px solid #ccc',
            padding: 12,
            marginBottom: 10,
          }}
        >
          <p><strong>Booking ID:</strong> {b.id}</p>
          <p><strong>Amount:</strong> ₹{b.amountPaid}</p>
          <p><strong>Booked At:</strong> {b.bookingTime}</p>
          <p><strong>Status:</strong> {b.cancelled ? 'Cancelled' : 'Active'}</p>
          <p><strong>Refund:</strong> ₹{b.refundAmount}</p>
          <p><strong>Refund Status:</strong> {b.refundStatus}</p>

          {!b.cancelled && (
            <select
              onChange={(e) =>
                cancelBooking(b.id, e.target.value)
              }
            >
              <option value="">Cancel booking</option>
              <option value="CHANGE_OF_PLANS">Change of plans</option>
              <option value="FOUND_BETTER_PRICE">Found better price</option>
              <option value="MEDICAL_EMERGENCY">Medical emergency</option>
              <option value="FLIGHT_DELAY">Flight delay</option>
              <option value="OTHER">Other</option>
            </select>
          )}
        </div>
      ))}
    </div>
  );
}

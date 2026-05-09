# SneakerDrop Frontend (React UI)

This is the React 18, Vite, and TailwindCSS frontend for the SneakerDrop platform. It features real-time UI updates powered by Socket.io and high-performance global state management using Zustand.

## 1. How to run the app

1. **Install Dependencies:**
   Make sure you are in the `frontend` directory.
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   Ensure the backend is already running (usually on port 3001).
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## 2. Architecture Choice: How did you handle the 60-second expiration logic?

The expiration logic is primarily handled by the **Backend Database Cron Job** (using `SELECT FOR UPDATE SKIP LOCKED`), ensuring it is reliable even if the user closes their browser.

However, the Frontend still plays a crucial role:
* **The Countdown Timer:** The frontend calculates a local countdown based on the `expiresAt` timestamp returned by the backend. It uses `setInterval` to update the visual UI timer every second.
* **State Sync:** If the 60 seconds expire locally, the UI automatically transitions the reservation status to `EXPIRED`. Simultaneously, the backend cron job officially expires it in the database and broadcasts a Socket.io `inventory:update` event, ensuring all *other* users instantly see the stock become available again.

---

## 3. Concurrency: How did you prevent multiple users from claiming the same last item?

The Frontend is designed to fail gracefully when concurrency limits are hit. 

* **The Problem:** 100 users click the "Reserve" button simultaneously.
* **The Backend Solution:** The backend uses PostgreSQL pessimistic locking (`SELECT FOR UPDATE NOWAIT`) to immediately fail 99 of those requests and grant the lock to 1 user.
* **The Frontend Handling:** 
  1. The user's React application clicks "Reserve", instantly entering a `loading` state to prevent double-clicks.
  2. If the backend returns a `409 Conflict` (Out of Stock) or `503 Service Unavailable` (Lock Unavailable due to `NOWAIT`), the frontend catches the error.
  3. The `useDropStore` (Zustand) intercepts the error and displays an immediate, non-blocking toast notification ("Lock Unavailable - Try Again" or "Sold Out") to the user.
  4. The UI seamlessly unlocks the button if the user wants to try again, without requiring a page refresh.

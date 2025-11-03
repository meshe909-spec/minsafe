# MiniSafe - AI-Powered Child Safety & Anti-Loss App

This monorepo contains:
- `backend` (Node.js + Express + Firebase Admin + Socket.io)
- `web` (React + Tailwind + Firebase client)
- `mobile` (Flutter + Firebase SDK)

See each package README for setup. Start with copying `.env.example` files and filling credentials.

Quick start:
- Backend: `cd backend && npm install && npm run dev`
- Web: `cd web && npm install && npm run dev`
- Mobile: `cd mobile && flutter create . && flutter pub get && flutter run`

Firestore collections used:
- `children` (child profile + parent info)
- `childFaceEmbeddings` (face vector per childId)
- `tracks` (childId, zoneId, timestamp)
- `alerts` (childId, zoneId, reason, status)


# MiniSafe Backend (Node.js + Express)

Setup:
1) Create `.env` with:
```
PORT=8080
CLIENT_ORIGIN=http://localhost:5173
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=
AI_PROVIDER=gemini
GEMINI_API_KEY=
AI_SIMULATION=true
```

Install and run:
```
npm install
npm run dev
```

Folder structure:
```
backend/
  src/
    server.js                # Express app, Socket.io, routes
    services/
      firebase.js            # Firebase Admin init
      aiClient.js            # Gemini/Vertex AI adapter (simulation by default)
  package.json
  .env.example
```

Endpoints:
- POST `/registerChild`
  - Body (JSON or multipart): `childName`, `parentName`, `contact` (or `parentPhone`/`parentCnic`), `photoURL` (optional) or file `photo`
  - Creates `/children/{childId}` and optional `/childFaceEmbeddings/{childId}`
- POST `/trackChild`
  - Body: `frameBase64`, `zoneId`
  - Matches face, updates `/children/{childId}.lastSeen`, and may trigger alert on unauthorized zone
- POST `/exitVerification`
  - Body: `frameBase64`, `childId` (or `parentAuthId` placeholder)
  - Returns `{ ok: boolean }`
- POST `/alert`
  - Creates `/alerts` doc with `status: open` and broadcasts `alert`
- POST `/resolveAlert`
  - Sets `status: resolved` and broadcasts `alertResolved`

Firestore schema:
- `children`:
  - `childId`, `childName`, `parent: { name, contact? phone? cnic? }`, `photoUrl`, `status`, `createdAt`, `lastSeen`
- `childFaceEmbeddings`:
  - `embedding` (numeric vector)
- `tracks`:
  - `childId`, `zoneId`, `timestamp`
- `alerts`:
  - `childId`, `zoneId`, `reason`, `status` ('open'|'resolved'), `createdAt`, `resolvedAt?`

Gemini/Vertex AI usage (stub):
```
// Replace simulateVectorFromBuffer with real calls when GEMINI_API_KEY is set
// Example outline:
// const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/vision:analyze?key=${process.env.GEMINI_API_KEY}`, {
//   method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ... })
// });
// const json = await result.json();
// Convert json to an embedding/score for matching.
```


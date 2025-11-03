import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import multer from 'multer';
import { Server as SocketIOServer } from 'socket.io';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from './services/firebase.js';
import { getAIClient } from './services/aiClient.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || '*', methods: ['GET', 'POST'] }
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

// Initialize services
initializeFirebaseAdmin();
const db = getFirestore();
const ai = getAIClient();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Dashboard connected', socket.id);
  socket.on('disconnect', () => console.log('Dashboard disconnected', socket.id));
});

// Routes
app.get('/health', (_req, res) => res.json({ ok: true }));

// Register child
app.post('/registerChild', upload.single('photo'), async (req, res) => {
  try {
    // Accept both JSON body and multipart form-data
    const { childName, parentName, contact, parentPhone, parentCnic, photoURL } = req.body || {};
    const photoBuffer = req.file?.buffer; // multipart image
    if (!childName || !parentName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const childDoc = db.collection('children').doc();
    const childId = childDoc.id;
    const parent = contact ? { name: parentName, contact } : { name: parentName, phone: parentPhone, cnic: parentCnic };
    const photoUrl = photoURL || null;

    await childDoc.set({
      childId,
      childName,
      parent,
      photoUrl,
      createdAt: new Date().toISOString(),
      status: 'Safe',
      lastSeen: null
    });

    // Store a face embedding via AI (simulated) if an image is provided
    if (photoBuffer) {
      const embedding = await ai.createFaceEmbedding(photoBuffer);
      await db.collection('childFaceEmbeddings').doc(childId).set({ embedding });
    }
    return res.json({ ok: true, childId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Track child from camera frame
app.post('/trackChild', async (req, res) => {
  try {
    const { frameBase64, zoneId } = req.body || {};
    if (!frameBase64) return res.status(400).json({ error: 'Missing frameBase64' });
    const frameBuffer = Buffer.from(frameBase64, 'base64');
    const match = await ai.matchFace(frameBuffer, async (probeEmbedding) => {
      // naive scan over children to find best match
      const snapshot = await db.collection('childFaceEmbeddings').get();
      const candidates = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      let best = { id: null, score: Infinity };
      for (const c of candidates) {
        const score = ai.distance(probeEmbedding, c.embedding);
        if (score < best.score) best = { id: c.id, score };
      }
      return best;
    });

    if (match && match.id) {
      const nowIso = new Date().toISOString();
      await db.collection('tracks').add({
        childId: match.id,
        zoneId: zoneId || null,
        timestamp: nowIso
      });
      // update child's lastSeen
      await db.collection('children').doc(match.id).update({ lastSeen: nowIso });

      // naive unauthorized movement check: trigger alert on 'Exit' zone
      if (zoneId && String(zoneId).toLowerCase() === 'exit') {
        const alertDoc = await db.collection('alerts').add({
          childId: match.id,
          zoneId,
          reason: 'Unauthorized exit',
          status: 'open',
          createdAt: nowIso
        });
        const alertId = alertDoc.id;
        const summary = await ai.summarizeAlert({ childId: match.id, zoneId, reason: 'Unauthorized exit' });
        io.emit('alert', { alertId, childId: match.id, zoneId, reason: 'Unauthorized exit', summary });
      }
      return res.json({ ok: true, childId: match.id, score: match.score });
    }
    return res.json({ ok: false, reason: 'no_match' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Exit verification
app.post('/exitVerification', async (req, res) => {
  try {
    const { frameBase64, childId, parentAuthId } = req.body || {};
    if (!frameBase64 || (!childId && !parentAuthId)) return res.status(400).json({ error: 'Missing fields' });
    const frameBuffer = Buffer.from(frameBase64, 'base64');
    const targetChildId = childId || null; // placeholder: parentAuthId mapping not implemented
    if (!targetChildId) return res.status(400).json({ error: 'childId required in this demo' });
    const childEmbedDoc = await db.collection('childFaceEmbeddings').doc(targetChildId).get();
    if (!childEmbedDoc.exists) return res.status(404).json({ error: 'Unknown child' });
    const isMatch = await ai.verifyFace(frameBuffer, childEmbedDoc.data().embedding);
    return res.json({ ok: isMatch });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Trigger alert
app.post('/alert', async (req, res) => {
  try {
    const { childId, zoneId, reason } = req.body || {};
    if (!childId) return res.status(400).json({ error: 'Missing childId' });
    const alertDoc = await db.collection('alerts').add({
      childId,
      zoneId: zoneId || null,
      reason: reason || 'Anomaly',
      status: 'open',
      createdAt: new Date().toISOString()
    });
    const alertId = alertDoc.id;
    const summary = await ai.summarizeAlert({ childId, zoneId, reason });
    io.emit('alert', { alertId, childId, zoneId, reason, summary });
    return res.json({ ok: true, alertId, summary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Resolve alert
app.post('/resolveAlert', async (req, res) => {
  try {
    const { alertId } = req.body || {};
    if (!alertId) return res.status(400).json({ error: 'Missing alertId' });
    await db.collection('alerts').doc(alertId).update({ status: 'resolved', resolvedAt: new Date().toISOString() });
    io.emit('alertResolved', { alertId });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`MiniSafe backend listening on :${port}`));


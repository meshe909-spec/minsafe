// AI client with simulation mode and simple numeric vector embeddings
import crypto from 'crypto';

function simulateVectorFromBuffer(buffer, dims = 128) {
  const hash = crypto.createHash('sha256').update(buffer).digest();
  const vec = new Array(dims).fill(0).map((_, i) => hash[i % hash.length] / 255);
  return vec;
}

function l2Distance(a, b) {
  let s = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s);
}

export function getAIClient() {
  const simulation = String(process.env.AI_SIMULATION || 'true').toLowerCase() === 'true';
  if (simulation) {
    return {
      async createFaceEmbedding(buffer) {
        return simulateVectorFromBuffer(buffer);
      },
      async matchFace(buffer, candidateSelector) {
        const probe = simulateVectorFromBuffer(buffer);
        const best = await candidateSelector(probe);
        if (best && best.score < 2.5) return best; // arbitrary threshold
        return null;
      },
      async verifyFace(buffer, targetEmbedding) {
        const probe = simulateVectorFromBuffer(buffer);
        const score = l2Distance(probe, targetEmbedding);
        return score < 2.5;
      },
      async summarizeAlert(payload) {
        return `Alert: child ${payload.childId} anomaly detected in zone ${payload.zoneId || 'unknown'} (reason: ${payload.reason || 'N/A'}).`;
      },
      distance: l2Distance
    };
  }

  // Placeholder for real Gemini/Vertex integration; call your provider here
  return {
    async createFaceEmbedding(buffer) {
      // TODO: Replace with real AI embedding call
      return simulateVectorFromBuffer(buffer);
    },
    async matchFace(buffer, candidateSelector) {
      const probe = simulateVectorFromBuffer(buffer);
      const best = await candidateSelector(probe);
      return best;
    },
    async verifyFace(buffer, targetEmbedding) {
      const probe = simulateVectorFromBuffer(buffer);
      const score = l2Distance(probe, targetEmbedding);
      return score < 2.5;
    },
    async summarizeAlert(payload) {
      return `Alert: child ${payload.childId} anomaly detected in zone ${payload.zoneId || 'unknown'} (reason: ${payload.reason || 'N/A'}).`;
    },
    distance: l2Distance
  };
}





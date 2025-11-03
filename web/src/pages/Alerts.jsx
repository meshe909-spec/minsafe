import React, { useEffect, useState } from 'react';
import { resolveAlert } from '../services/api';
import { collection, onSnapshot, orderBy, query, where, getFirestore, doc, getDoc } from 'firebase/firestore';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, 'alerts'), where('status', '==', 'OPEN'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, async (snap) => {
      const rows = [];
      for (const d of snap.docs) {
        const data = d.data();
        let childPhoto = '';
        if (data.childId) {
          const childDoc = await getDoc(doc(db, 'children', data.childId));
          childPhoto = childDoc.exists() ? (childDoc.data().photoUrl || '') : '';
        }
        rows.push({ alertId: d.id, ...data, childPhoto });
      }
      setAlerts(rows);
    });
    return () => unsub();
  }, []);

  const onResolve = async (alertId) => {
    await resolveAlert(alertId);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Alerts</h1>
      <div className="grid gap-3">
        {alerts.map((a) => (
          <div key={a.alertId} className="bg-white shadow rounded p-4 flex items-center gap-4">
            {a.childPhoto ? (
              <img src={a.childPhoto} alt="child" className="h-16 w-16 object-cover rounded" />
            ) : (
              <div className="h-16 w-16 bg-gray-200 rounded grid place-items-center text-xs text-gray-500">No photo</div>
            )}
            <div className="flex-1">
              <div className="font-medium">Alert #{a.alertId}</div>
              <div className="text-sm text-gray-700">Location: {a.zoneId || 'Unknown'} | Status: {a.status}</div>
              <div className="text-xs text-gray-500">Time: {a.createdAt?.toDate ? a.createdAt.toDate().toISOString() : a.createdAt}</div>
            </div>
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => onResolve(a.alertId)}>Resolve</button>
          </div>
        ))}
        {!alerts.length && <div className="text-sm text-gray-500">No active alerts</div>}
      </div>
    </div>
  );
}


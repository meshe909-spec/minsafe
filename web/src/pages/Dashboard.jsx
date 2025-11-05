import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import CameraFeed from '../components/CameraFeed.jsx';
import { collection, getCountFromServer, orderBy, limit, query, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { triggerAlert } from '../services/api';

const demoFeeds = [
  { id: 'cam1', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', title: 'Entrance' },
  { id: 'cam2', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', title: 'Food Court' }
];

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ children: 0, activeAlerts: 0, lastAlertTime: '-' });
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080');
    socket.on('alert', (a) => setAlerts((prev) => [a, ...prev]));
    socket.on('alertResolved', ({ alertId }) => setAlerts((prev) => prev.filter((x) => x.alertId !== alertId)));
    return () => socket.close();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const childrenCount = await getCountFromServer(collection(db, 'children'));
        const alertsOpenQuery = collection(db, 'alerts');
        const activeCount = await getCountFromServer(alertsOpenQuery);
        const lastAlertQ = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'), limit(1));
        const lastSnap = await getDocs(lastAlertQ);
        const lastAlertTime = lastSnap.empty ? '-' : lastSnap.docs[0].data().createdAt;
        setStats({
          children: childrenCount.data().count,
          activeAlerts: activeCount.data().count,
          lastAlertTime
        });
      } catch (e) {
        // ignore for now
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4"><div className="text-sm text-gray-500">Total Children</div><div className="text-2xl font-bold">{stats.children}</div></div>
        <div className="bg-white shadow rounded p-4"><div className="text-sm text-gray-500">Active Alerts</div><div className="text-2xl font-bold">{stats.activeAlerts}</div></div>
        <div className="bg-white shadow rounded p-4"><div className="text-sm text-gray-500">Last Alert</div><div className="text-lg">{stats.lastAlertTime}</div></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">Camera Monitoring</div>
        <button
          onClick={async () => { await triggerAlert({ childId: 'demo-child', zoneId: 'Entrance', reason: 'Test alert' }); }}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >Trigger Test Alert</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {demoFeeds.map((f) => (
          <CameraFeed key={f.id} src={f.url} title={f.title} />
        ))}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Live Alerts</h2>
        <div className="grid gap-2">
          {alerts.map((a) => (
            <div key={a.alertId} className="bg-red-50 border border-red-200 p-3 rounded">
              <div className="font-medium">Alert #{a.alertId}</div>
              <div className="text-sm">{a.summary}</div>
            </div>
          ))}
          {!alerts.length && <div className="text-sm text-gray-500">No active alerts</div>}
        </div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';

export default function Settings() {
  const [zones, setZones] = useState(['Entrance', 'Food Court']);
  const [newZone, setNewZone] = useState('');
  const [apiKeys, setApiKeys] = useState({ geminiKey: '', firebaseApiKey: '' });

  const addZone = () => {
    if (!newZone.trim()) return;
    setZones((z) => [...z, newZone.trim()]);
    setNewZone('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-medium mb-2">Mall Zones</h2>
        <div className="flex gap-2 mb-3">
          <input className="border p-2 rounded flex-1" placeholder="Add zone" value={newZone} onChange={(e) => setNewZone(e.target.value)} />
          <button className="bg-blue-600 text-white px-3 rounded" onClick={addZone}>Add</button>
        </div>
        <ul className="list-disc ml-5">
          {zones.map((z, i) => <li key={i}>{z}</li>)}
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-medium mb-2">API Keys (Mock)</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Gemini/Vertex API Key</label>
            <input className="border p-2 rounded w-full" value={apiKeys.geminiKey} onChange={(e) => setApiKeys({ ...apiKeys, geminiKey: e.target.value })} placeholder="sk-..." />
          </div>
          <div>
            <label className="text-sm text-gray-600">Firebase API Key</label>
            <input className="border p-2 rounded w-full" value={apiKeys.firebaseApiKey} onChange={(e) => setApiKeys({ ...apiKeys, firebaseApiKey: e.target.value })} placeholder="AIza..." />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">These are not persisted in this demo. Use environment variables for production.</p>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { registerChild } from '../services/api';

export default function RegisterChild() {
  const [childName, setChildName] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentCnic, setParentCnic] = useState('');
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append('childName', childName);
      form.append('parentName', parentName);
      form.append('parentPhone', parentPhone);
      form.append('parentCnic', parentCnic);
      if (photo) form.append('photo', photo);
      const res = await registerChild(form);
      setResult(res);
      if (res?.ok) {
        setChildName(''); setParentName(''); setParentPhone(''); setParentCnic(''); setPhoto(null);
      }
    } catch (err) {
      setResult({ ok: false, error: err?.message || 'Failed to register' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Register Child</h1>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <input className="border p-2 rounded" placeholder="Child Name" value={childName} onChange={(e) => setChildName(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Parent Name" value={parentName} onChange={(e) => setParentName(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Parent Phone" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Parent CNIC" value={parentCnic} onChange={(e) => setParentCnic(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        <button disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60">{loading ? 'Saving...' : 'Save'}</button>
      </form>
      {result && <pre className="mt-4 bg-gray-100 p-3 rounded text-sm">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}


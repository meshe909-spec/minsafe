import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function Navbar() {
  const onLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };
  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-4">
      <div className="font-semibold text-blue-700">MiniSafe</div>
      <button onClick={onLogout} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Logout</button>
    </header>
  );
}





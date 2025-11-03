import React, { useRef, useEffect } from 'react';

export default function CameraFeed({ src, title }) {
  const videoRef = useRef(null);
  useEffect(() => {
    // For simulated CCTV, just use a video URL
  }, [src]);
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <div className="p-2 font-medium">{title}</div>
      <video ref={videoRef} src={src} controls autoPlay muted loop className="w-full" />
    </div>
  );
}





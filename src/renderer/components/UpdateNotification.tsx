// კოდერი — განახლების შეტყობინება
// აჩვენებს ბანერს როცა ახალი ვერსია ხელმისაწვდომია

import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckCircle } from 'lucide-react';

type UpdateState = 'idle' | 'available' | 'downloading' | 'downloaded';

const UpdateNotification: React.FC = () => {
  const [state, setState] = useState<UpdateState>('idle');
  const [version, setVersion] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const api = window.koderiAPI?.update;
    if (!api) return;

    api.onAvailable((v) => {
      setVersion(v);
      setState('available');
    });

    api.onProgress((percent) => {
      setState('downloading');
      setProgress(percent);
    });

    api.onDownloaded(() => {
      setState('downloaded');
    });
  }, []);

  if (state === 'idle') return null;

  return (
    <div className="update-banner">
      {state === 'available' && (
        <>
          <span>ახალი ვერსია ხელმისაწვდომია: <strong>{version}</strong></span>
          <button className="update-btn" onClick={() => window.koderiAPI.update.download()}>
            <Download size={14} /> ჩამოტვირთვა
          </button>
        </>
      )}
      {state === 'downloading' && (
        <>
          <RefreshCw size={14} className="update-spin" />
          <span>მიმდინარეობს ჩამოტვირთვა... {progress}%</span>
        </>
      )}
      {state === 'downloaded' && (
        <>
          <CheckCircle size={14} />
          <span>განახლება მზადაა!</span>
          <button className="update-btn" onClick={() => window.koderiAPI.update.install()}>
            გადატვირთვა
          </button>
        </>
      )}
    </div>
  );
};

export default UpdateNotification;

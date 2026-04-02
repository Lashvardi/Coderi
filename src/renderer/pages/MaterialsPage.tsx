// კოდერი — მასალების გვერდი
// სრული იმპლემენტაცია Phase 6-ში
// ამჟამად აჩვენებს placeholder-ს უკან დაბრუნების ღილაკით

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { APP_LABEL } from '../constants';

const MaterialsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-layout">
      {/* ზედა პანელი */}
      <div className="page-toolbar">
        <button className="toolbar-btn" onClick={() => navigate('/')} title="უკან">
          <ArrowLeft size={16} />
        </button>
        <BookOpen size={16} />
        <span className="toolbar-title">მასალები</span>
      </div>

      {/* კონტენტი — placeholder Phase 6-მდე */}
      <div className="page-body">
        <div className="editor-placeholder">
          <BookOpen size={48} strokeWidth={1.5} />
          <p className="placeholder-title">სასწავლო მასალები</p>
          <p className="placeholder-desc">გაკვეთილები დაემატება მომდევნო ფაზაში</p>
        </div>
      </div>

      <div className="home-footer">
        <span>{APP_LABEL}</span>
      </div>
    </div>
  );
};

export default MaterialsPage;

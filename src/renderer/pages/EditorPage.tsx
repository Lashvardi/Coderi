// კოდერი — რედაქტორის გვერდი (IDE)
// სრული Monaco Editor იმპლემენტაცია Phase 4-ში
// ამჟამად აჩვენებს რეჟიმს და უკან დაბრუნების ღილაკს

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Code2, Globe, Terminal } from 'lucide-react';

const EditorPage: React.FC = () => {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();

  const isFrontend = mode === 'frontend';
  const modeLabel = isFrontend ? 'ფრონტ-ენდი' : 'Python';
  const ModeIcon = isFrontend ? Globe : Terminal;

  return (
    <div className="editor-layout">
      {/* ზედა პანელი */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn" onClick={() => navigate('/')} title="მთავარ გვერდზე დაბრუნება">
            <ArrowLeft size={16} />
          </button>
          <div className="toolbar-divider" />
          <Code2 size={16} className="toolbar-logo" />
          <span className="toolbar-title">კოდერი</span>
        </div>
        <div className="toolbar-center">
          <div className="toolbar-mode">
            <ModeIcon size={14} />
            <span>{modeLabel}</span>
          </div>
        </div>
        <div className="toolbar-right">
          {/* პროფილის ღილაკი დაემატება Phase 3-ში */}
        </div>
      </div>

      {/* რედაქტორის არეა — placeholder Phase 4-მდე */}
      <div className="editor-body">
        <div className="editor-placeholder">
          <ModeIcon size={48} strokeWidth={1.5} />
          <p className="placeholder-title">{modeLabel} — რედაქტორი</p>
          <p className="placeholder-desc">Monaco Editor დაემატება მომდევნო ფაზაში</p>
        </div>
      </div>

      {/* სტატუს ბარი */}
      <div className="editor-statusbar">
        <span>{modeLabel}</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};

export default EditorPage;

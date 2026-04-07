// კოდერი — სათაურის ზოლი (ფანჯრის კონტროლი)
// macOS-ზე მხოლოდ drag არეა, Windows/Linux-ზე + minimize/maximize/close ღილაკები

import React from 'react';
import { Minus, Maximize2, X } from 'lucide-react';

const TitleBar: React.FC = () => {
  const isWindows = window.koderiAPI.platform !== 'darwin';

  return (
    <div className="titlebar">
      <div className="titlebar-drag" />
      {isWindows && (
        <div className="window-controls">
          <button className="window-ctrl-btn" onClick={() => window.koderiAPI.window.minimize()} title="შემცირება">
            <Minus size={14} />
          </button>
          <button className="window-ctrl-btn" onClick={() => window.koderiAPI.window.maximize()} title="გადიდება">
            <Maximize2 size={12} />
          </button>
          <button className="window-ctrl-btn window-ctrl-close" onClick={() => window.koderiAPI.window.close()} title="დახურვა">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TitleBar;

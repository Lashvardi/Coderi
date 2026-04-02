// კოდერი — Monaco Editor-ის კომპონენტი
// სრული იმპლემენტაცია Phase 4-ში

import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoWrapperProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
}

const MonacoWrapper: React.FC<MonacoWrapperProps> = ({ language, value, onChange }) => {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-light"
      options={{
        fontSize: 16,
        minimap: { enabled: false },
        automaticLayout: true,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        padding: { top: 12 },
      }}
    />
  );
};

export default MonacoWrapper;

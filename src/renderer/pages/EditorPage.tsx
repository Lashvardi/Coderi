// კოდერი — რედაქტორის გვერდი (IDE)
// VS Code სტილის რედაქტორი: საიდბარი, ფაილ ტაბები, Monaco Editor
// ახალი ფაილის შექმნა მოდალით — ტიპის არჩევა + სახელის პრომპტი

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Globe, Terminal, FileCode2, FileText,
  FileType, Save, Plus, Trash2, X, Play, Square,
  Minus, Maximize2,
} from 'lucide-react';
import logoSvg from '../assets/logo.svg';
import UserBadge from '../components/UserBadge';
import MonacoWrapper from '../components/MonacoWrapper';
import { useAuth } from '../context/AuthContext';
import { APP_LABEL } from '../constants';

interface EditorFile {
  name: string;
  content: string;
  language: string;
  saved: boolean;
}

// ფაილის ტიპები მოდალისთვის
interface FileTemplate {
  ext: string;
  label: string;
  icon: React.ReactNode;
  defaultBase: string;
}

const FRONTEND_TEMPLATES: FileTemplate[] = [
  { ext: 'html', label: 'HTML', icon: <FileCode2 size={22} className="file-icon-html" />, defaultBase: 'index' },
  { ext: 'css', label: 'CSS', icon: <FileType size={22} className="file-icon-css" />, defaultBase: 'style' },
  { ext: 'js', label: 'JavaScript', icon: <FileCode2 size={22} className="file-icon-js" />, defaultBase: 'script' },
];

const PYTHON_TEMPLATES: FileTemplate[] = [
  { ext: 'py', label: 'Python', icon: <Terminal size={22} className="file-icon-py" />, defaultBase: 'main' },
];

const MAX_FILENAME = 20;

function getLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    html: 'html', htm: 'html', css: 'css',
    js: 'javascript', jsx: 'javascript',
    ts: 'typescript', tsx: 'typescript',
    py: 'python', json: 'json', md: 'markdown',
  };
  return map[ext] || 'plaintext';
}

function FileIcon({ name, size = 14 }: { name: string; size?: number }) {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (ext === 'html' || ext === 'htm') return <FileCode2 size={size} className="file-icon-html" />;
  if (ext === 'css') return <FileType size={size} className="file-icon-css" />;
  if (ext === 'js' || ext === 'jsx') return <FileCode2 size={size} className="file-icon-js" />;
  if (ext === 'py') return <Terminal size={size} className="file-icon-py" />;
  return <FileText size={size} className="file-icon-default" />;
}

// ავტომატური სახელის გენერაცია — index.html, index1.html, index2.html...
function autoName(base: string, ext: string, existing: string[]): string {
  const first = `${base}.${ext}`;
  if (!existing.includes(first)) return first;
  for (let i = 1; i < 100; i++) {
    const name = `${base}${i}.${ext}`;
    if (!existing.includes(name)) return name;
  }
  return `${base}${Date.now()}.${ext}`;
}

const EditorPage: React.FC = () => {
  const { mode, project } = useParams<{ mode: string; project: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isFrontend = mode === 'frontend';
  const modeLabel = isFrontend ? 'ფრონტ-ენდი' : 'Python';
  const ModeIcon = isFrontend ? Globe : Terminal;
  const projectName = decodeURIComponent(project || '');
  const username = user?.username;
  const templates = isFrontend ? FRONTEND_TEMPLATES : PYTHON_TEMPLATES;

  const [files, setFiles] = useState<EditorFile[]>([]);
  const [activeFile, setActiveFile] = useState<string>('');
  const [loaded, setLoaded] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // მოდალის სტეიტი
  const [showNewFile, setShowNewFile] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FileTemplate | null>(null);
  const [customName, setCustomName] = useState('');
  const [fileError, setFileError] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  // წაშლის დადასტურების მოდალი
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Run panel სტეიტი
  const [running, setRunning] = useState(false);
  const [pythonOutput, setPythonOutput] = useState<string[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // ფაილების ჩატვირთვა
  useEffect(() => {
    async function load() {
      if (!projectName) return;
      const api = window.koderiAPI.fs;
      const listResult = await api.list(mode!, projectName, username);
      if (listResult.success && listResult.files) {
        const fileEntries: EditorFile[] = [];
        for (const f of listResult.files) {
          if (f.isDir) continue;
          const readResult = await api.read(mode!, projectName, f.name, username);
          fileEntries.push({
            name: f.name,
            content: readResult.success ? readResult.content || '' : '',
            language: getLanguage(f.name),
            saved: true,
          });
        }
        setFiles(fileEntries);
        if (fileEntries.length > 0) setActiveFile(fileEntries[0].name);
      }
      setLoaded(true);
    }
    load();
  }, [mode, projectName, username]);

  const currentFile = files.find(f => f.name === activeFile);
  const existingNames = files.map(f => f.name);

  // კონტენტის ცვლილება + auto-save
  const handleContentChange = useCallback((value: string | undefined) => {
    if (value === undefined) return;
    setFiles(prev => prev.map(f =>
      f.name === activeFile ? { ...f, content: value, saved: false } : f
    ));
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveFile(activeFile, value);
    }, 1500);
  }, [activeFile, username, mode, projectName]);

  const saveFile = useCallback(async (fileName: string, content: string) => {
    await window.koderiAPI.fs.write(mode!, projectName, fileName, content, username);
    setFiles(prev => prev.map(f =>
      f.name === fileName ? { ...f, saved: true } : f
    ));
  }, [username, mode, projectName]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (currentFile) saveFile(currentFile.name, currentFile.content);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentFile, saveFile]);

  const saveAll = useCallback(async () => {
    for (const f of files) {
      if (!f.saved) await saveFile(f.name, f.content);
    }
  }, [files, saveFile]);

  // ===== კოდის გაშვება =====

  const handleRun = useCallback(async () => {
    // ჯერ ყველა ფაილის შენახვა
    await saveAll();

    if (isFrontend) {
      setRunning(true);
      await window.koderiAPI.run.frontend(projectName, username);
      setRunning(false);
    } else {
      // Python
      if (!currentFile) return;
      setPythonOutput([]);
      setShowTerminal(true);
      setRunning(true);

      window.koderiAPI.run.removeAllListeners();
      window.koderiAPI.run.onStdout((data) => {
        setPythonOutput(prev => [...prev, data]);
      });
      window.koderiAPI.run.onStderr((data) => {
        setPythonOutput(prev => [...prev, `\x1b[31m${data}\x1b[0m`]);
      });
      window.koderiAPI.run.onExit((code) => {
        setPythonOutput(prev => [...prev, `\n--- პროგრამა დასრულდა (კოდი: ${code}) ---\n`]);
        setRunning(false);
      });

      await window.koderiAPI.run.python(projectName, currentFile.name, username);
    }
  }, [saveAll, isFrontend, projectName, username, currentFile]);

  const handleStop = useCallback(async () => {
    if (isFrontend) {
      await window.koderiAPI.run.stop();
    } else {
      await window.koderiAPI.run.pythonStop();
    }
    setRunning(false);
  }, [isFrontend]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.koderiAPI.run.stop();
      window.koderiAPI.run.pythonStop();
      window.koderiAPI.run.removeAllListeners();
    };
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [pythonOutput]);

  // მოდალის გახსნა/დახურვა
  const openNewFileModal = () => {
    setShowNewFile(true);
    setSelectedTemplate(null);
    setCustomName('');
    setFileError('');
  };

  const closeNewFileModal = () => {
    setShowNewFile(false);
    setSelectedTemplate(null);
    setCustomName('');
    setFileError('');
  };

  // ტემპლეიტის არჩევა
  const selectTemplate = (t: FileTemplate) => {
    setSelectedTemplate(t);
    setCustomName('');
    setFileError('');
    setTimeout(() => nameInputRef.current?.focus(), 50);
  };

  // ფაილის შექმნა
  const createFile = useCallback(async () => {
    if (!selectedTemplate) return;

    const raw = customName.trim();
    let fileName: string;

    if (raw) {
      // ვალიდაცია
      if (raw.length > MAX_FILENAME) {
        setFileError(`მაქსიმუმ ${MAX_FILENAME} სიმბოლო`);
        return;
      }
      if (!/^[a-zA-Z0-9\u10D0-\u10FF_-]+$/.test(raw)) {
        setFileError('მხოლოდ ასოები, რიცხვები, - და _');
        return;
      }
      fileName = `${raw}.${selectedTemplate.ext}`;
      if (existingNames.includes(fileName)) {
        setFileError('ეს ფაილი უკვე არსებობს');
        return;
      }
    } else {
      // ავტომატური სახელი
      fileName = autoName(selectedTemplate.defaultBase, selectedTemplate.ext, existingNames);
    }

    const newFile: EditorFile = { name: fileName, content: '', language: getLanguage(fileName), saved: true };
    await window.koderiAPI.fs.write(mode!, projectName, fileName, '', username);
    setFiles(prev => [...prev, newFile]);
    setActiveFile(fileName);
    closeNewFileModal();
  }, [selectedTemplate, customName, existingNames, mode, projectName, username]);

  // ფაილის წაშლა
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await window.koderiAPI.fs.delete(mode!, projectName, deleteTarget, username);
    setFiles(prev => prev.filter(f => f.name !== deleteTarget));
    if (activeFile === deleteTarget) {
      const remaining = files.filter(f => f.name !== deleteTarget);
      setActiveFile(remaining[0]?.name || '');
    }
    setDeleteTarget(null);
  }, [deleteTarget, files, activeFile, username, mode, projectName]);

  if (!loaded) {
    return (
      <div className="editor-layout">
        <div className="editor-toolbar">
          <div className="toolbar-left">
            <button className="toolbar-btn" onClick={() => navigate(`/projects/${mode}`)} title="უკან">
              <ArrowLeft size={16} />
            </button>
          </div>
        </div>
        <div className="editor-body">
          <div className="editor-placeholder">
            <ModeIcon size={48} strokeWidth={1.5} />
            <p className="placeholder-title">იტვირთება...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-layout">
      {/* ტულბარი */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn" onClick={() => navigate(`/projects/${mode}`)} title="პროექტებზე დაბრუნება">
            <ArrowLeft size={16} />
          </button>
          <div className="toolbar-divider" />
          <img src={logoSvg} alt="კოდერი" className="toolbar-logo-img" />
          <span className="toolbar-title">{projectName}</span>
        </div>
        <div className="toolbar-center" />
        <div className="toolbar-right">
          <button className="toolbar-btn-text" onClick={saveAll} title="ყველას შენახვა (Ctrl+S)">
            <Save size={14} /> შენახვა
          </button>
          <div className="toolbar-divider" />
          {running ? (
            <button className="toolbar-btn-text run-btn-stop" onClick={handleStop} title="გაჩერება">
              <Square size={14} /> გაჩერება
            </button>
          ) : (
            <button className="toolbar-btn-text run-btn-play" onClick={handleRun} title="გაშვება" disabled={files.length === 0}>
              <Play size={14} /> გაშვება
            </button>
          )}
          <div className="toolbar-divider" />
          <UserBadge />
          {window.koderiAPI.platform !== 'darwin' && (
            <>
              <div className="toolbar-divider" />
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
            </>
          )}
        </div>
      </div>

      {/* მთავარი არეა */}
      <div className="editor-main">
        {/* საიდბარი */}
        <div className="editor-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-title">{projectName}</span>
            <button className="sidebar-action" onClick={openNewFileModal} title="ახალი ფაილი">
              <Plus size={14} />
            </button>
          </div>
          <div className="sidebar-files">
            {files.map(file => (
              <div
                key={file.name}
                className={`sidebar-file ${file.name === activeFile ? 'sidebar-file-active' : ''}`}
                onClick={() => setActiveFile(file.name)}
              >
                <FileIcon name={file.name} />
                <span className="sidebar-file-name">{file.name}</span>
                {!file.saved && <span className="sidebar-file-dot" />}
                <button
                  className="sidebar-file-delete"
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(file.name); }}
                  title="წაშლა"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {files.length === 0 && (
              <div className="sidebar-empty">
                <p>ფაილები ცარიელია</p>
                <button className="sidebar-empty-btn" onClick={openNewFileModal}>
                  <Plus size={12} />
                  <span>დაამატე ფაილი</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* რედაქტორის პანელი */}
        <div className="editor-panel">
          {files.length > 0 && (
            <div className="editor-tabs">
              {files.map(file => (
                <div
                  key={file.name}
                  className={`editor-tab ${file.name === activeFile ? 'editor-tab-active' : ''}`}
                  onClick={() => setActiveFile(file.name)}
                >
                  <FileIcon name={file.name} size={13} />
                  <span className="tab-name">{file.name}</span>
                  {!file.saved && <span className="tab-dot" />}
                </div>
              ))}
            </div>
          )}
          <div className={`editor-monaco ${showTerminal ? 'editor-monaco-with-terminal' : ''}`}>
            {currentFile ? (
              <MonacoWrapper
                language={currentFile.language}
                value={currentFile.content}
                onChange={handleContentChange}
              />
            ) : (
              <div className="editor-empty-state">
                <FileText size={48} strokeWidth={1.2} />
                <p>შექმენი ფაილი დასაწყებად</p>
              </div>
            )}
          </div>

          {/* Python ტერმინალი — ქვედა პანელი */}
          {showTerminal && (
            <div className="terminal-panel">
              <div className="terminal-header">
                <span className="terminal-title">
                  <Terminal size={13} />
                  <span>ტერმინალი</span>
                </span>
                <button className="terminal-close" onClick={() => { setShowTerminal(false); handleStop(); }}>
                  <X size={14} />
                </button>
              </div>
              <div className="terminal-output" ref={terminalRef}>
                {pythonOutput.map((line, i) => (
                  <pre key={i} className={line.includes('\x1b[31m') ? 'terminal-error' : ''}>{
                    line.replace(/\x1b\[\d+m/g, '')
                  }</pre>
                ))}
                {running && <span className="terminal-cursor">_</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* სტატუს ბარი */}
      <div className="editor-statusbar">
        <div className="statusbar-left">
          <span>{modeLabel}</span>
          {currentFile && (
            <>
              <span className="statusbar-sep">|</span>
              <span>{currentFile.language}</span>
              <span className="statusbar-sep">|</span>
              <span>{currentFile.saved ? 'შენახულია' : 'შეუნახავი'}</span>
            </>
          )}
        </div>
        <span>{APP_LABEL}</span>
      </div>

      {/* ახალი ფაილის მოდალი */}
      {showNewFile && (
        <div className="modal-overlay" onClick={closeNewFileModal}>
          <div className="modal-card newfile-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>ახალი ფაილი</h3>
              <button className="modal-close" onClick={closeNewFileModal}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              {/* ტიპის არჩევა */}
              <label className="form-label">აირჩიე ფაილის ტიპი</label>
              <div className="newfile-types">
                {templates.map(t => (
                  <button
                    key={t.ext}
                    className={`newfile-type-btn ${selectedTemplate?.ext === t.ext ? 'newfile-type-active' : ''}`}
                    onClick={() => selectTemplate(t)}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                    <span className="newfile-type-ext">.{t.ext}</span>
                  </button>
                ))}
              </div>

              {/* სახელის ინპუტი — ჩნდება ტიპის არჩევის შემდეგ */}
              {selectedTemplate && (
                <>
                  <label className="form-label">
                    ფაილის სახელი <span className="form-label-hint">(არასავალდებულო)</span>
                  </label>
                  <div className="input-with-counter">
                    <div className="newfile-name-input">
                      <input
                        ref={nameInputRef}
                        className="form-input input-counter-field"
                        value={customName}
                        maxLength={MAX_FILENAME}
                        onChange={e => { setCustomName(e.target.value); setFileError(''); }}
                        onKeyDown={e => { if (e.key === 'Enter') createFile(); }}
                        placeholder={selectedTemplate.defaultBase}
                      />
                      <span className="newfile-ext-badge">.{selectedTemplate.ext}</span>
                    </div>
                    <span className={`input-counter ${customName.length >= MAX_FILENAME ? 'input-counter-limit' : ''}`}>
                      {customName.length}/{MAX_FILENAME}
                    </span>
                  </div>
                  <p className="newfile-hint">
                    ცარიელად დატოვე და ავტომატურად დაერქმევა: <strong>{autoName(selectedTemplate.defaultBase, selectedTemplate.ext, existingNames)}</strong>
                  </p>
                </>
              )}

              {fileError && <div className="form-error">{fileError}</div>}
            </div>
            <div className="modal-footer">
              <button className="modal-btn-cancel" onClick={closeNewFileModal}>გაუქმება</button>
              <button
                className="modal-btn-create"
                onClick={createFile}
                disabled={!selectedTemplate}
              >
                <Plus size={14} />
                <span>შექმნა</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ფაილის წაშლის დადასტურების მოდალი */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-card delete-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>ფაილის წაშლა</h3>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-modal-content">
                <Trash2 size={20} className="delete-modal-icon" />
                <p>ნამდვილად გსურს <strong>{deleteTarget}</strong> ფაილის წაშლა?</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn-cancel" onClick={() => setDeleteTarget(null)}>გაუქმება</button>
              <button className="modal-btn-delete" onClick={confirmDelete}>
                <Trash2 size={14} />
                <span>წაშლა</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;

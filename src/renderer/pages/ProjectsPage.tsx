// კოდერი — პროექტების არჩევის გვერდი
// აჩვენებს არსებული პროექტების სიას + ახალი პროექტის შექმნის მოდალი
// სტუმარი ხედავს გლობალურ პროექტებს, ავტორიზებული — მხოლოდ თავისას

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Globe, Terminal, FolderOpen, Plus,
  Trash2, ChevronRight, X, FolderPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_LABEL } from '../constants';

interface ProjectEntry {
  name: string;
  createdAt: number;
}

const ProjectsPage: React.FC = () => {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isFrontend = mode === 'frontend';
  const modeLabel = isFrontend ? 'ფრონტ-ენდი' : 'Python';
  const ModeIcon = isFrontend ? Globe : Terminal;

  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const username = user?.username;

  // პროექტების ჩატვირთვა
  const loadProjects = async () => {
    const result = await window.koderiAPI.project.list(mode!, username);
    if (result.success && result.projects) {
      setProjects(result.projects);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, [mode, username]);

  // მოდალის ფოკუსი
  useEffect(() => {
    if (showModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showModal]);

  // ახალი პროექტის შექმნა
  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) {
      setError('შეიყვანე პროექტის სახელი');
      return;
    }
    if (!/^[a-zA-Z0-9\u10D0-\u10FF _-]+$/.test(name)) {
      setError('სახელი შეიძლება შეიცავდეს ასოებს, რიცხვებს, - და _');
      return;
    }
    const result = await window.koderiAPI.project.create(mode!, name, username);
    if (!result.success) {
      setError(result.error || 'შეცდომა');
      return;
    }
    setShowModal(false);
    setNewName('');
    setError('');
    navigate(`/editor/${mode}/${encodeURIComponent(name)}`);
  };

  // პროექტის წაშლა
  const handleDelete = async (projectName: string) => {
    await window.koderiAPI.project.delete(mode!, projectName, username);
    loadProjects();
  };

  // პროექტის გახსნა
  const handleOpen = (projectName: string) => {
    navigate(`/editor/${mode}/${encodeURIComponent(projectName)}`);
  };

  // თარიღის ფორმატი
  const formatDate = (ms: number) => {
    const d = new Date(ms);
    return d.toLocaleDateString('ka-GE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="page-layout">
      {/* ტულბარი */}
      <div className="page-toolbar">
        <button className="toolbar-btn" onClick={() => navigate('/')} title="უკან">
          <ArrowLeft size={16} />
        </button>
        <ModeIcon size={16} />
        <span className="toolbar-title">{modeLabel} — პროექტები</span>
      </div>

      {/* კონტენტი */}
      <div className="projects-body">
        <div className="projects-container">
          {/* სათაური */}
          <div className="projects-hero">
            <div className={`projects-hero-icon ${isFrontend ? 'projects-icon-frontend' : 'projects-icon-python'}`}>
              <ModeIcon size={28} />
            </div>
            <div>
              <h2 className="projects-hero-title">{modeLabel} პროექტები</h2>
              <p className="projects-hero-desc">
                {user
                  ? `${user.name}, აირჩიე არსებული პროექტი ან შექმენი ახალი.`
                  : 'აირჩიე არსებული პროექტი ან შექმენი ახალი.'}
              </p>
            </div>
          </div>

          {/* ახალი პროექტის ღილაკი */}
          <button className="projects-new-btn" onClick={() => setShowModal(true)}>
            <FolderPlus size={18} />
            <span>ახალი პროექტი</span>
          </button>

          {/* პროექტების სია */}
          {loading ? (
            <p className="projects-empty">იტვირთება...</p>
          ) : projects.length === 0 ? (
            <div className="projects-empty-state">
              <FolderOpen size={40} strokeWidth={1.2} />
              <p>პროექტები ჯერ არ გაქვს.</p>
              <p className="projects-empty-hint">დააჭირე "ახალი პროექტი" დასაწყებად.</p>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map(p => (
                <div key={p.name} className="project-row" onClick={() => handleOpen(p.name)}>
                  <div className={`project-row-icon ${isFrontend ? 'project-icon-frontend' : 'project-icon-python'}`}>
                    <FolderOpen size={18} />
                  </div>
                  <div className="project-row-info">
                    <span className="project-row-name">{p.name}</span>
                    <span className="project-row-date">{formatDate(p.createdAt)}</span>
                  </div>
                  <button
                    className="project-row-delete"
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.name); }}
                    title="წაშლა"
                  >
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={16} className="project-row-arrow" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="home-footer"><span>{APP_LABEL}</span></div>

      {/* ახალი პროექტის მოდალი */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setError(''); setNewName(''); }}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>ახალი პროექტი</h3>
              <button className="modal-close" onClick={() => { setShowModal(false); setError(''); setNewName(''); }}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <label className="form-label">პროექტის სახელი</label>
              <div className="input-with-counter">
                <input
                  ref={inputRef}
                  className="form-input input-counter-field"
                  value={newName}
                  maxLength={25}
                  onChange={e => { setNewName(e.target.value); setError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
                  placeholder="მაგ: ჩემი-პირველი-საიტი"
                />
                <span className={`input-counter ${newName.length >= 25 ? 'input-counter-limit' : ''}`}>
                  {newName.length}/25
                </span>
              </div>
              {error && <div className="form-error">{error}</div>}
            </div>
            <div className="modal-footer">
              <button className="modal-btn-cancel" onClick={() => { setShowModal(false); setError(''); setNewName(''); }}>
                გაუქმება
              </button>
              <button className="modal-btn-create" onClick={handleCreate}>
                <Plus size={14} />
                <span>შექმნა</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

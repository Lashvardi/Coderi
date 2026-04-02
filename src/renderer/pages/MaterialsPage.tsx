// კოდერი — მასალების გვერდი
// AWS-ის სტილის ნავიგაცია: საქაღალდეებში შესვლა + breadcrumbs
// კურსი → ლექცია → მასალა

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  ArrowLeft, BookOpen, Folder, FileText, ChevronRight,
  Globe, Terminal, ExternalLink, Home,
} from 'lucide-react';
import { APP_LABEL } from '../constants';
import { mockCourses } from '../data/mockMaterials';
import { Course, Lecture, Material } from '../../shared/types';

// ნავიგაციის მდგომარეობა
type View =
  | { level: 'root' }
  | { level: 'course'; course: Course }
  | { level: 'lecture'; course: Course; lecture: Lecture }
  | { level: 'material'; course: Course; lecture: Lecture; material: Material };

const MaterialsPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>({ level: 'root' });

  // Breadcrumbs კომპონენტი
  const Breadcrumbs = () => {
    const crumbs: { label: string; onClick: () => void }[] = [
      { label: 'მასალები', onClick: () => setView({ level: 'root' }) },
    ];

    if (view.level === 'course' || view.level === 'lecture' || view.level === 'material') {
      crumbs.push({
        label: view.course.title,
        onClick: () => setView({ level: 'course', course: view.course }),
      });
    }
    if (view.level === 'lecture' || view.level === 'material') {
      crumbs.push({
        label: view.lecture.title,
        onClick: () => setView({ level: 'lecture', course: view.course, lecture: view.lecture }),
      });
    }
    if (view.level === 'material') {
      crumbs.push({
        label: view.material.title,
        onClick: () => {},
      });
    }

    return (
      <div className="breadcrumbs">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight size={12} className="breadcrumb-sep" />}
            {i < crumbs.length - 1 ? (
              <button className="breadcrumb-link" onClick={crumb.onClick}>
                {crumb.label}
              </button>
            ) : (
              <span className="breadcrumb-current">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // უკან ღილაკის ლოგიკა
  const handleBack = () => {
    if (view.level === 'material') {
      setView({ level: 'lecture', course: view.course, lecture: view.lecture });
    } else if (view.level === 'lecture') {
      setView({ level: 'course', course: view.course });
    } else if (view.level === 'course') {
      setView({ level: 'root' });
    } else {
      navigate('/');
    }
  };

  // ===== მასალის კონტენტი (Markdown) =====
  if (view.level === 'material') {
    const mat = view.material;
    return (
      <div className="page-layout">
        <div className="page-toolbar">
          <button className="toolbar-btn" onClick={handleBack} title="უკან">
            <ArrowLeft size={16} />
          </button>
          <FileText size={16} />
          <span className="toolbar-title">{mat.title}</span>
        </div>

        <Breadcrumbs />

        <div className="lesson-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              iframe: ({ node, ...props }) => (
                <div className="lesson-video">
                  <iframe {...props} />
                </div>
              ),
              pre: ({ children }) => (
                <div className="lesson-code-block">
                  <pre>{children}</pre>
                </div>
              ),
              code: ({ className, children, ...props }) => {
                const isBlock = className?.startsWith('language-');
                if (isBlock) {
                  const lang = className?.replace('language-', '') || '';
                  return (
                    <>
                      <div className="code-lang">{lang}</div>
                      <code className={className} {...props}>{children}</code>
                    </>
                  );
                }
                return <code className="lesson-inline-code" {...props}>{children}</code>;
              },
              a: ({ children, href, ...props }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="lesson-link" {...props}>
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="lesson-table-wrap">
                  <table className="lesson-table">{children}</table>
                </div>
              ),
              blockquote: ({ children }) => (
                <blockquote className="lesson-blockquote">{children}</blockquote>
              ),
              hr: () => <hr className="lesson-hr" />,
            }}
          >
            {mat.content}
          </ReactMarkdown>

          {mat.links && mat.links.length > 0 && (
            <div className="lesson-links-section">
              <h3 className="lesson-links-title">
                <ExternalLink size={16} />
                <span>სასარგებლო ბმულები</span>
              </h3>
              <div className="lesson-links-list">
                {mat.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lesson-link-card"
                  >
                    <ExternalLink size={14} />
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="home-footer">
          <span>{APP_LABEL}</span>
        </div>
      </div>
    );
  }

  // ===== საქაღალდეების ხედი (root / course / lecture) =====
  let items: { id: string; label: string; desc?: string; icon: React.ReactNode; onClick: () => void }[] = [];

  if (view.level === 'root') {
    items = mockCourses.map(course => ({
      id: course.id,
      label: course.title,
      desc: `${course.lectures.length} ლექცია`,
      icon: course.icon === 'frontend'
        ? <Globe size={18} className="folder-item-icon-frontend" />
        : <Terminal size={18} className="folder-item-icon-python" />,
      onClick: () => setView({ level: 'course', course }),
    }));
  } else if (view.level === 'course') {
    items = view.course.lectures.map(lecture => ({
      id: lecture.id,
      label: lecture.title,
      desc: `${lecture.materials.length} მასალა`,
      icon: <Folder size={18} className="folder-item-icon-lecture" />,
      onClick: () => setView({ level: 'lecture', course: view.course, lecture }),
    }));
  } else if (view.level === 'lecture') {
    items = view.lecture.materials.map(material => ({
      id: material.id,
      label: material.title,
      icon: <FileText size={18} className="folder-item-icon-file" />,
      onClick: () => setView({ level: 'material', course: view.course, lecture: view.lecture, material }),
    }));
  }

  return (
    <div className="page-layout">
      <div className="page-toolbar">
        <button className="toolbar-btn" onClick={handleBack} title="უკან">
          <ArrowLeft size={16} />
        </button>
        <BookOpen size={16} />
        <span className="toolbar-title">მასალები</span>
      </div>

      <Breadcrumbs />

      <div className="materials-body">
        <div className="folder-grid">
          {items.map(item => (
            <button key={item.id} className="folder-item" onClick={item.onClick}>
              <div className="folder-item-icon">
                {item.icon}
              </div>
              <div className="folder-item-text">
                <span className="folder-item-label">{item.label}</span>
                {item.desc && <span className="folder-item-desc">{item.desc}</span>}
              </div>
              <ChevronRight size={16} className="folder-item-arrow" />
            </button>
          ))}
        </div>
      </div>

      <div className="home-footer">
        <span>{APP_LABEL}</span>
      </div>
    </div>
  );
};

export default MaterialsPage;

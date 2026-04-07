// კოდერი — მასალების გვერდი
// AWS-ის სტილის ნავიგაცია breadcrumbs-ით
// ყოველი დონე ვიზუალურად განსხვავებული: root, course, lecture, material

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  ArrowLeft, BookOpen, FileText, ChevronRight,
  Globe, Terminal, ExternalLink, Layers, Hash,
} from 'lucide-react';
import { APP_LABEL } from '../constants';
import TitleBar from '../components/TitleBar';
import { mockCourses } from '../data/mockMaterials';
import { Course, Lecture, Material } from '../../shared/types';

type View =
  | { level: 'root' }
  | { level: 'course'; course: Course }
  | { level: 'lecture'; course: Course; lecture: Lecture }
  | { level: 'material'; course: Course; lecture: Lecture; material: Material };

const MaterialsPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<View>({ level: 'root' });

  const Breadcrumbs = () => {
    const crumbs: { label: string; onClick: () => void }[] = [
      { label: 'მასალები', onClick: () => setView({ level: 'root' }) },
    ];
    if (view.level !== 'root') {
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
      crumbs.push({ label: view.material.title, onClick: () => {} });
    }

    return (
      <div className="breadcrumbs">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight size={12} className="breadcrumb-sep" />}
            {i < crumbs.length - 1 ? (
              <button className="breadcrumb-link" onClick={crumb.onClick}>{crumb.label}</button>
            ) : (
              <span className="breadcrumb-current">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

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

  // ===== მასალის Markdown ხედი =====
  if (view.level === 'material') {
    const mat = view.material;
    return (
      <div className="page-layout">
        <TitleBar />
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
                <div className="lesson-video"><iframe {...props} /></div>
              ),
              pre: ({ children }) => (
                <div className="lesson-code-block"><pre>{children}</pre></div>
              ),
              code: ({ className, children, ...props }) => {
                const isBlock = className?.startsWith('language-');
                if (isBlock) {
                  const lang = className?.replace('language-', '') || '';
                  return (<><div className="code-lang">{lang}</div><code className={className} {...props}>{children}</code></>);
                }
                return <code className="lesson-inline-code" {...props}>{children}</code>;
              },
              a: ({ children, href, ...props }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="lesson-link" {...props}>{children}</a>
              ),
              table: ({ children }) => (
                <div className="lesson-table-wrap"><table className="lesson-table">{children}</table></div>
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
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="lesson-link-card">
                    <ExternalLink size={14} />
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="home-footer"><span>{APP_LABEL}</span></div>
      </div>
    );
  }

  // ===== Root — კურსების არჩევა =====
  if (view.level === 'root') {
    const totalLectures = mockCourses.reduce((sum, c) => sum + c.lectures.length, 0);
    const totalMaterials = mockCourses.reduce(
      (sum, c) => sum + c.lectures.reduce((s, l) => s + l.materials.length, 0), 0
    );

    return (
      <div className="page-layout">
        <TitleBar />
        <div className="page-toolbar">
          <button className="toolbar-btn" onClick={() => navigate('/')} title="უკან">
            <ArrowLeft size={16} />
          </button>
          <BookOpen size={16} />
          <span className="toolbar-title">მასალები</span>
        </div>
        <Breadcrumbs />

        <div className="materials-body">
          <div className="mat-container">
            {/* სათაური */}
            <div className="mat-hero">
              <BookOpen size={32} className="mat-hero-icon" />
              <div>
                <h2 className="mat-hero-title">სასწავლო მასალები</h2>
                <p className="mat-hero-desc">
                  აირჩიე კურსი და დაიწყე სწავლა. ყოველი კურსი შეიცავს ლექციებს,
                  ხოლო ლექციები — ცალკეულ თემებს კოდის მაგალითებით.
                </p>
              </div>
            </div>

            {/* სტატისტიკა */}
            <div className="mat-stats">
              <div className="mat-stat">
                <span className="mat-stat-num">{mockCourses.length}</span>
                <span className="mat-stat-label">კურსი</span>
              </div>
              <div className="mat-stat-divider" />
              <div className="mat-stat">
                <span className="mat-stat-num">{totalLectures}</span>
                <span className="mat-stat-label">ლექცია</span>
              </div>
              <div className="mat-stat-divider" />
              <div className="mat-stat">
                <span className="mat-stat-num">{totalMaterials}</span>
                <span className="mat-stat-label">მასალა</span>
              </div>
            </div>

            {/* კურსის ბარათები */}
            <div className="mat-courses">
              {mockCourses.map(course => {
                const matCount = course.lectures.reduce((s, l) => s + l.materials.length, 0);
                const isFrontend = course.icon === 'frontend';
                return (
                  <button
                    key={course.id}
                    className={`mat-course-card ${isFrontend ? 'mat-course-frontend' : 'mat-course-python'}`}
                    onClick={() => setView({ level: 'course', course })}
                  >
                    <div className="mat-course-icon">
                      {isFrontend ? <Globe size={24} /> : <Terminal size={24} />}
                    </div>
                    <div className="mat-course-info">
                      <span className="mat-course-title">{course.title}</span>
                      <span className="mat-course-meta">
                        {course.lectures.length} ლექცია &middot; {matCount} თემა
                      </span>
                    </div>
                    <ChevronRight size={18} className="mat-course-arrow" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="home-footer"><span>{APP_LABEL}</span></div>
      </div>
    );
  }

  // ===== Course — ლექციების სია =====
  if (view.level === 'course') {
    const isFrontend = view.course.icon === 'frontend';
    const totalMat = view.course.lectures.reduce((s, l) => s + l.materials.length, 0);

    return (
      <div className="page-layout">
        <TitleBar />
        <div className="page-toolbar">
          <button className="toolbar-btn" onClick={handleBack} title="უკან">
            <ArrowLeft size={16} />
          </button>
          <BookOpen size={16} />
          <span className="toolbar-title">მასალები</span>
        </div>
        <Breadcrumbs />

        <div className="materials-body">
          <div className="mat-container">
            {/* კურსის header */}
            <div className={`mat-course-header ${isFrontend ? 'mat-header-frontend' : 'mat-header-python'}`}>
              <div className="mat-course-header-icon">
                {isFrontend ? <Globe size={22} /> : <Terminal size={22} />}
              </div>
              <div>
                <h2 className="mat-course-header-title">{view.course.title}</h2>
                <p className="mat-course-header-meta">
                  {view.course.lectures.length} ლექცია &middot; {totalMat} თემა
                </p>
              </div>
            </div>

            {/* ლექციების სია — დანომრილი */}
            <div className="mat-lectures">
              {view.course.lectures.map((lecture, idx) => (
                <button
                  key={lecture.id}
                  className="mat-lecture-row"
                  onClick={() => setView({ level: 'lecture', course: view.course, lecture })}
                >
                  <div className={`mat-lecture-num ${isFrontend ? 'mat-num-frontend' : 'mat-num-python'}`}>
                    {idx + 1}
                  </div>
                  <div className="mat-lecture-info">
                    <span className="mat-lecture-title">{lecture.title}</span>
                    <span className="mat-lecture-meta">{lecture.materials.length} თემა</span>
                  </div>
                  <ChevronRight size={16} className="mat-lecture-arrow" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="home-footer"><span>{APP_LABEL}</span></div>
      </div>
    );
  }

  // ===== Lecture — მასალების სია =====
  if (view.level === 'lecture') {
    return (
      <div className="page-layout">
        <TitleBar />
        <div className="page-toolbar">
          <button className="toolbar-btn" onClick={handleBack} title="უკან">
            <ArrowLeft size={16} />
          </button>
          <BookOpen size={16} />
          <span className="toolbar-title">მასალები</span>
        </div>
        <Breadcrumbs />

        <div className="materials-body">
          <div className="mat-container">
            {/* ლექციის header */}
            <div className="mat-lecture-header">
              <Layers size={20} className="mat-lecture-header-icon" />
              <div>
                <h2 className="mat-lecture-header-title">{view.lecture.title}</h2>
                <p className="mat-lecture-header-meta">
                  {view.lecture.materials.length} თემა &middot; აირჩიე რომელიმე თემა სასწავლებლად
                </p>
              </div>
            </div>

            {/* მასალების სია */}
            <div className="mat-materials">
              {view.lecture.materials.map((material, idx) => (
                <button
                  key={material.id}
                  className="mat-material-row"
                  onClick={() => setView({
                    level: 'material',
                    course: view.course,
                    lecture: view.lecture,
                    material,
                  })}
                >
                  <div className="mat-material-index">
                    <Hash size={12} />
                    <span>{idx + 1}</span>
                  </div>
                  <div className="mat-material-info">
                    <span className="mat-material-title">{material.title}</span>
                    {material.links && material.links.length > 0 && (
                      <span className="mat-material-has-links">
                        <ExternalLink size={11} />
                        {material.links.length} ბმული
                      </span>
                    )}
                  </div>
                  <FileText size={15} className="mat-material-icon" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="home-footer"><span>{APP_LABEL}</span></div>
      </div>
    );
  }

  return null;
};

export default MaterialsPage;

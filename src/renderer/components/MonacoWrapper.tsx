// კოდერი — Monaco Editor-ის კომპონენტი
// VS Code-ს სტილის კოდ რედაქტორი: auto-close tags, formatters, snippets

import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import type { editor as MonacoEditor, languages, Monaco } from 'monaco-editor';

interface MonacoWrapperProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
}

let snippetsRegistered = false;

// HTML სნიპეტების რეგისტრაცია
function registerHTMLSnippets(monaco: Monaco) {
  const snippets: Record<string, { prefix: string; body: string; description: string }> = {
    '!': {
      prefix: '!',
      body: '<!DOCTYPE html>\n<html lang="ka">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${1:Document}</title>\n</head>\n<body>\n  $0\n</body>\n</html>',
      description: 'HTML5 ბოილერფლეითი',
    },
    'div': { prefix: 'div', body: '<div${1: class="$2"}>$0</div>', description: 'div ელემენტი' },
    'p': { prefix: 'p', body: '<p>$0</p>', description: 'პარაგრაფი' },
    'a': { prefix: 'a', body: '<a href="$1">$0</a>', description: 'ბმული' },
    'img': { prefix: 'img', body: '<img src="$1" alt="$2" />', description: 'სურათი' },
    'ul>li': { prefix: 'ul>li', body: '<ul>\n  <li>$0</li>\n</ul>', description: 'სია' },
    'ol>li': { prefix: 'ol>li', body: '<ol>\n  <li>$0</li>\n</ol>', description: 'დანომრილი სია' },
    'btn': { prefix: 'btn', body: '<button${1: id="$2"}>$0</button>', description: 'ღილაკი' },
    'input': { prefix: 'input', body: '<input type="${1:text}" ${2:placeholder="$3"} />', description: 'ინპუტი' },
    'h1': { prefix: 'h1', body: '<h1>$0</h1>', description: 'სათაური h1' },
    'h2': { prefix: 'h2', body: '<h2>$0</h2>', description: 'სათაური h2' },
    'h3': { prefix: 'h3', body: '<h3>$0</h3>', description: 'სათაური h3' },
    'span': { prefix: 'span', body: '<span>$0</span>', description: 'span ელემენტი' },
    'form': { prefix: 'form', body: '<form action="$1" method="$2">\n  $0\n</form>', description: 'ფორმა' },
    'table': { prefix: 'table', body: '<table>\n  <thead>\n    <tr>\n      <th>$1</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>$0</td>\n    </tr>\n  </tbody>\n</table>', description: 'ცხრილი' },
    'link:css': { prefix: 'link:css', body: '<link rel="stylesheet" href="$1">', description: 'CSS ფაილის ჩართვა' },
    'script:src': { prefix: 'script:src', body: '<script src="$1"></script>', description: 'JS ფაილის ჩართვა' },
    'section': { prefix: 'section', body: '<section${1: class="$2"}>\n  $0\n</section>', description: 'სექცია' },
    'nav': { prefix: 'nav', body: '<nav>\n  $0\n</nav>', description: 'ნავიგაცია' },
    'header': { prefix: 'header', body: '<header>\n  $0\n</header>', description: 'ჰედერი' },
    'footer': { prefix: 'footer', body: '<footer>\n  $0\n</footer>', description: 'ფუტერი' },
  };

  monaco.languages.registerCompletionItemProvider('html', {
    triggerCharacters: ['!', '<'],
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: languages.CompletionItem[] = Object.values(snippets).map(s => ({
        label: s.prefix,
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: s.description,
        insertText: s.body,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      }));

      return { suggestions };
    },
  });
}

// CSS სნიპეტების რეგისტრაცია
function registerCSSSnippets(monaco: Monaco) {
  const snippets: Record<string, { prefix: string; body: string; description: string }> = {
    'df': { prefix: 'df', body: 'display: flex;', description: 'display: flex' },
    'dg': { prefix: 'dg', body: 'display: grid;', description: 'display: grid' },
    'db': { prefix: 'db', body: 'display: block;', description: 'display: block' },
    'dn': { prefix: 'dn', body: 'display: none;', description: 'display: none' },
    'jcc': { prefix: 'jcc', body: 'justify-content: center;', description: 'justify-content: center' },
    'aic': { prefix: 'aic', body: 'align-items: center;', description: 'align-items: center' },
    'fdc': { prefix: 'fdc', body: 'flex-direction: column;', description: 'flex-direction: column' },
    'p': { prefix: 'p', body: 'padding: ${1:0};', description: 'padding' },
    'm': { prefix: 'm', body: 'margin: ${1:0};', description: 'margin' },
    'w': { prefix: 'w', body: 'width: ${1:100%};', description: 'width' },
    'h': { prefix: 'h', body: 'height: ${1:100%};', description: 'height' },
    'bg': { prefix: 'bg', body: 'background: ${1:#fff};', description: 'background' },
    'c': { prefix: 'c', body: 'color: ${1:#000};', description: 'color' },
    'fs': { prefix: 'fs', body: 'font-size: ${1:16px};', description: 'font-size' },
    'fw': { prefix: 'fw', body: 'font-weight: ${1:bold};', description: 'font-weight' },
    'br': { prefix: 'br', body: 'border-radius: ${1:4px};', description: 'border-radius' },
    'bs': { prefix: 'bs', body: 'box-shadow: ${1:0 2px 4px rgba(0,0,0,0.1)};', description: 'box-shadow' },
    'tac': { prefix: 'tac', body: 'text-align: center;', description: 'text-align: center' },
    'pos': { prefix: 'pos', body: 'position: ${1:relative};', description: 'position' },
  };

  monaco.languages.registerCompletionItemProvider('css', {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: languages.CompletionItem[] = Object.values(snippets).map(s => ({
        label: s.prefix,
        kind: monaco.languages.CompletionItemKind.Snippet,
        documentation: s.description,
        insertText: s.body,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      }));

      return { suggestions };
    },
  });
}

const MonacoWrapper: React.FC<MonacoWrapperProps> = ({ language, value, onChange }) => {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // სნიპეტების რეგისტრაცია (ერთხელ)
    if (!snippetsRegistered) {
      registerHTMLSnippets(monaco);
      registerCSSSnippets(monaco);
      snippetsRegistered = true;
    }

    // HTML: auto-close tag — ">" აკრეფისას ავტომატურად იხურება ტეგი
    if (language === 'html') {
      editor.onDidType((text) => {
        if (text !== '>') return;
        const model = editor.getModel();
        const position = editor.getPosition();
        if (!model || !position) return;

        const lineContent = model.getLineContent(position.lineNumber);
        const beforeCursor = lineContent.substring(0, position.column - 1);

        if (beforeCursor.endsWith('/') || beforeCursor.endsWith('-->')) return;

        const match = beforeCursor.match(/<(\w[\w-]*)(?:\s[^>]*)?$/);
        if (!match) return;

        const tag = match[1].toLowerCase();
        const voidTags = new Set([
          'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
          'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
        ]);
        if (voidTags.has(tag)) return;

        const closeTag = `</${tag}>`;
        editor.executeEdits('auto-close-tag', [{
          range: new monaco.Range(
            position.lineNumber, position.column,
            position.lineNumber, position.column,
          ),
          text: closeTag,
        }]);
        editor.setPosition(position);
      });
    }

    editor.focus();
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      onMount={handleMount}
      options={{
        fontSize: 15,
        fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
        minimap: { enabled: false },
        automaticLayout: true,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        bracketPairColorization: { enabled: true },
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        tabSize: 2,

        // Auto-complete & suggestions
        suggest: {
          showKeywords: true,
          showSnippets: true,
          showClasses: true,
          showFunctions: true,
          showVariables: true,
          showColors: true,
          insertMode: 'replace',
          preview: true,
        },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
        acceptSuggestionOnCommitCharacter: true,
        suggestOnTriggerCharacters: true,
        parameterHints: { enabled: true },
        snippetSuggestions: 'top',

        // Auto-closing & formatting
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoSurround: 'languageDefined',
        autoIndent: 'advanced',
        formatOnPaste: true,
        formatOnType: true,
        linkedEditing: true,

        // Folding & guides
        folding: true,
        foldingStrategy: 'indentation',
        showFoldingControls: 'mouseover',
        guides: {
          bracketPairs: true,
          indentation: true,
        },

        // Color decorators
        colorDecorators: true,
        colorDecoratorsActivatedOn: 'clickAndHover',

        // Hover & info
        hover: { enabled: true, delay: 300 },

        // Selection & multi-cursor
        multiCursorModifier: 'alt',
        occurrencesHighlight: 'singleFile',
        selectionHighlight: true,

        // Find & replace
        find: {
          addExtraSpaceOnTop: false,
          autoFindInSelection: 'multiline',
          seedSearchStringFromSelection: 'selection',
        },

        // Drag & drop
        dragAndDrop: true,

        // Accessibility
        accessibilitySupport: 'off',
      }}
    />
  );
};

export default MonacoWrapper;

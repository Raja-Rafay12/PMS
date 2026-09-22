import React from 'react';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2 } from 'lucide-react';

export const RichTextToolbar = ({ textareaRef, value, onChange }) => {
  const insertFormatting = (prefix, suffix = '') => {
    if (!textareaRef || !textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = el.value.substring(start, end);
    const beforeText = el.value.substring(0, start);
    const afterText = el.value.substring(end);

    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;
    const newValue = `${beforeText}${replacement}${afterText}`;

    onChange(newValue);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 4)
      );
    }, 10);
  };

  return (
    <div className="modern-rich-toolbar">
      <div className="toolbar-btn-group">
        <button
          type="button"
          className="rich-tool-btn"
          title="Bold (Ctrl+B)"
          onClick={() => insertFormatting('**', '**')}
        >
          <Bold size={13} strokeWidth={2.5} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Bold</span>
        </button>

        <button
          type="button"
          className="rich-tool-btn"
          title="Italic (Ctrl+I)"
          onClick={() => insertFormatting('*', '*')}
        >
          <Italic size={13} strokeWidth={2.5} />
          <span style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>Italic</span>
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-btn-group">
        <button
          type="button"
          className="rich-tool-btn"
          title="Add Bullet Point"
          onClick={() => insertFormatting('- ', '\n')}
        >
          <List size={14} />
          <span style={{ fontSize: '0.75rem' }}>List</span>
        </button>

        <button
          type="button"
          className="rich-tool-btn"
          title="Add Numbered List"
          onClick={() => insertFormatting('1. ', '\n')}
        >
          <ListOrdered size={14} />
          <span style={{ fontSize: '0.75rem' }}>1, 2, 3</span>
        </button>
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-btn-group">
        <button
          type="button"
          className="rich-tool-btn"
          title="Add Heading"
          onClick={() => insertFormatting('### ', '\n')}
        >
          <Heading2 size={14} />
          <span style={{ fontSize: '0.75rem' }}>Heading</span>
        </button>
      </div>
    </div>
  );
};

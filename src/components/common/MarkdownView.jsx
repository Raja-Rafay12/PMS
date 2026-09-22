import React from 'react';

/**
 * Lightweight, safe parser for inline medical note formatting:
 * **bold**, *italic*, bullet lines, numbered lines, and line breaks.
 */
export const MarkdownView = ({ content, className = '' }) => {
  if (!content) return null;

  // Split lines
  const lines = content.split('\n');

  const formatInline = (text) => {
    // Replace **bold**
    const parts = [];
    let remaining = text;

    // Regex for **bold** and *italic*
    const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      if (match[2]) {
        // Bold
        parts.push(<strong key={match.index} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{match[2]}</strong>);
      } else if (match[3]) {
        // Italic
        parts.push(<em key={match.index} style={{ color: 'var(--text-secondary)' }}>{match[3]}</em>);
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`formatted-markdown-block ${className}`} style={{ lineHeight: 1.6 }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} style={{ height: 6 }} />;
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, margin: '2px 0 2px 8px' }}>
              <span style={{ color: 'var(--brand-cyan)', fontWeight: 800 }}>•</span>
              <span style={{ flex: 1 }}>{formatInline(trimmed.substring(2))}</span>
            </div>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
          const numberMatch = trimmed.match(/^(\d+)\.\s(.*)/);
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, margin: '2px 0 2px 8px' }}>
              <span style={{ fontWeight: 700, color: 'var(--brand-cyan)', minWidth: 18 }}>{numberMatch[1]}.</span>
              <span style={{ flex: 1 }}>{formatInline(numberMatch[2])}</span>
            </div>
          );
        }

        return (
          <p key={idx} style={{ margin: '3px 0' }}>
            {formatInline(line)}
          </p>
        );
      })}
    </div>
  );
};


import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
    return text
      // Bold text: **text** -> <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text: *text* -> <em>text</em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code: `code` -> <code>code</code>
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      // Line breaks
      .replace(/\n/g, '<br />');
  };

  return (
    <span 
      className="whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
};

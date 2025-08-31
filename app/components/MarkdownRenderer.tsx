"use client";

import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // Convert markdown to HTML
    const rawHtml = marked(content);
    
    // Sanitize HTML for security
    const clean = DOMPurify.sanitize(rawHtml as string, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'title', 'target', 'rel']
    });
    
    setSanitizedHtml(clean);
  }, [content]);

  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{
        // Custom styles for markdown elements
      }}
    />
  );
}

// Add CSS styles for markdown elements
export const markdownStyles = `
  .markdown-content p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  .markdown-content p:last-child {
    margin-bottom: 0;
  }
  
  .markdown-content strong, .markdown-content b {
    font-weight: 600;
    color: #374151;
  }
  
  .markdown-content em, .markdown-content i {
    font-style: italic;
  }
  
  .markdown-content ul, .markdown-content ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  
  .markdown-content ul {
    list-style-type: disc;
  }
  
  .markdown-content ol {
    list-style-type: decimal;
  }
  
  .markdown-content li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
  
  .markdown-content li:last-child {
    margin-bottom: 0;
  }
  
  .markdown-content a {
    color: #f97316;
    text-decoration: underline;
    transition: color 0.2s ease;
  }
  
  .markdown-content a:hover {
    color: #ea580c;
  }
  
  .markdown-content h1, .markdown-content h2, .markdown-content h3, 
  .markdown-content h4, .markdown-content h5, .markdown-content h6 {
    font-weight: 600;
    color: #111827;
    margin: 1rem 0 0.5rem 0;
  }
  
  .markdown-content h1 { font-size: 1.5rem; }
  .markdown-content h2 { font-size: 1.375rem; }
  .markdown-content h3 { font-size: 1.25rem; }
  .markdown-content h4 { font-size: 1.125rem; }
  .markdown-content h5 { font-size: 1rem; }
  .markdown-content h6 { font-size: 0.875rem; }
  
  .markdown-content blockquote {
    border-left: 4px solid #f97316;
    margin: 1rem 0;
    padding-left: 1rem;
    color: #6b7280;
    font-style: italic;
  }
  
  .markdown-content code {
    background-color: #f3f4f6;
    color: #ef4444;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
  }
  
  .markdown-content pre {
    background-color: #1f2937;
    color: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }
  
  .markdown-content pre code {
    background-color: transparent;
    color: inherit;
    padding: 0;
    border-radius: 0;
  }
`;
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

// Configure marked with syntax highlighting
marked.use(({
  gfm: true,
  breaks: true,
  // cast to any so TypeScript won't complain if types don't include highlight
  highlight: (code: string, lang?: string) => {
    const validLang = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language: validLang }).value;
  },
} as unknown) as any);


export const markdownToHtml = (markdown: string): string => {
  const rawHtml = marked.parse(markdown) as string;
  return DOMPurify.sanitize(rawHtml);
};

export const styleMarkdownElements = (container: HTMLElement) => {
  container.querySelectorAll('h1').forEach(el => {
    el.classList.add('text-3xl', 'font-bold', 'mb-4', 'mt-8');
  });
  container.querySelectorAll('h2').forEach(el => {
    el.classList.add('text-2xl', 'font-bold', 'mb-3', 'mt-6');
  });
  container.querySelectorAll('h3').forEach(el => {
    el.classList.add('text-xl', 'font-bold', 'mb-2', 'mt-5');
  });
  container.querySelectorAll('p').forEach(el => {
    el.classList.add('mb-4', 'leading-relaxed');
  });
  container.querySelectorAll('ul, ol').forEach(el => {
    el.classList.add('list-disc', 'pl-8', 'mb-4');
  });
  container.querySelectorAll('li').forEach(el => {
    el.classList.add('mb-2');
  });
  container.querySelectorAll('blockquote').forEach(el => {
    el.classList.add('border-l-4', 'border-blue-500', 'pl-4', 'py-2', 'my-4', 'text-gray-600');
  });
  container.querySelectorAll('a').forEach(el => {
    el.classList.add('text-blue-600', 'hover:underline');
  });
  container.querySelectorAll('pre').forEach(el => {
    el.classList.add('bg-gray-800', 'text-gray-100', 'p-4', 'rounded', 'overflow-x-auto', 'my-4');
  });
  container.querySelectorAll('code:not(pre code)').forEach(el => {
    el.classList.add('bg-gray-100', 'text-red-500', 'px-1', 'py-0.5', 'rounded', 'text-sm');
  });
  container.querySelectorAll('img').forEach(el => {
    el.classList.add('my-4', 'rounded-lg', 'shadow-md', 'mx-auto');
  });
};

import { getRelevantHtmlContent, trimHtmlBlockSyntax } from '~/lib/llm-utils';
import { describe, expect, it } from 'vitest';

describe('trimHtmlBlockSyntax', () => {
  const start = '```html';
  const end = '```';

  it('should return EmptyString when given EmptyString', () => {
    expect(trimHtmlBlockSyntax('')).toBe('');
  });

  it('should do nothing when given no code block', () => {
    const content = 'Short content';
    expect(trimHtmlBlockSyntax(content)).toBe(content);
  });

  it('should return EmtpyString when given an empty code block', () => {
    const content = `${start}${end}`;
    expect(trimHtmlBlockSyntax(content)).toBe('');
  });

  it('should return the inner block content when given a code block', () => {
    const innerContent = 'Short content';
    const content = `${start}${innerContent}${end}`;

    expect(trimHtmlBlockSyntax(content)).toBe(innerContent);
  });

  it('should ignore any content outside the code block', () => {
    const innerContent = 'Short content';
    const content = `
        Some content before the code block
        ${start}${innerContent}${end}
        Some content after the code block
      `;

    expect(trimHtmlBlockSyntax(content)).toBe(innerContent);
  });

  it('should return the first inner block content when given multiple', () => {
    const innerContent1 = 'Short content 1';
    const innerContent2 = 'Short content 2';
    const content = `
        Some content before the first code block
        ${start}${innerContent1}${end}
        Some content between the code blocks
        ${start}${innerContent2}${end}
        Some content after the second code block
      `;

    expect(trimHtmlBlockSyntax(content)).toBe(innerContent1);
  });
});

describe('getRelevantHtmlContent', () => {
  const start = '<html><body';
  const end = '</body></html>';

  it('should return EmptyString when given EmptyString', () => {
    expect(getRelevantHtmlContent('')).toBe('');
  });

  it('should do nothing when given no code block', () => {
    const content = 'Short content';
    expect(getRelevantHtmlContent(content)).toBe(content);
  });

  it('should return an empty `<div>` when given an empty <body>', () => {
    const content = '<html><body></body></html>';
    expect(getRelevantHtmlContent(content)).toBe('<div></div>');
  });

  it('should return the inner block content when given a code block', () => {
    const innerContent = 'Short content';
    const content = `${start}${innerContent}${end}`;

    expect(getRelevantHtmlContent(content)).toBe(`<div${innerContent}</div>`);
  });

  it('should return valid HTML when given valid HTML', () => {
    const content =
      '<html><head><title>Some title</title></head><body class="text-sky"><h1>Hello World!</h1></body></html>';
    const expectedResult = '<div class="text-sky"><h1>Hello World!</h1></div>';

    expect(getRelevantHtmlContent(content)).toBe(expectedResult);
  });
});

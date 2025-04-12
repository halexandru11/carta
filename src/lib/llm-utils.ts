/**
 * Extracts HTML code from the given `content`
 *
 * @param content the string containing a markdown code block of HTML
 * @return the first HTML code block if it exists, otherwise the given `content`
 */
export function trimHtmlBlockSyntax(content: string): string {
  const start = '```html';
  const end = '```';

  let response = content;
  const startIndex = response.indexOf(start);
  if (startIndex !== -1) {
    response = response.substring(startIndex + start.length);
  }
  const endIndex = response.indexOf(end);
  if (endIndex !== -1) {
    response = response.substring(0, endIndex);
  }

  return response;
}

/**
 * Extracts the <body> content from the given `htmlString` and puts it inside of a <div>
 * If a <body> is not found then the given `htmlString` is returned back
 *
 * @param htmlString some HTML code
 * @return the <body> content placed inside a <div> if it exists, otherwise the given `htmlString`
 *
 * @example
 * ```typescript
 * // Input
 * getRelevantHtmlContent('<html lang="en"><body class="text-sky"><h1>Hello World!</h1></body></html>'); 
 * // Output:
 * '<div class="text-sky"><h1>Hello World!</h1></div>'
 * ```
 */
export function getRelevantHtmlContent(htmlString: string): string {
  const start = '<body';
  const end = '</body>';

  let response = htmlString;
  const startIndex = response.indexOf(start);
  const endIndex = response.indexOf(end);
  if (startIndex !== -1 && endIndex !== -1) {
    response = response.substring(0, endIndex);
    response = response.substring(startIndex + start.length);
    response = `<div${response}</div>`;
  }

  return response;
}

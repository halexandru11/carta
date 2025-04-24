import { google } from '@ai-sdk/google';
import { getRelevantHtmlContent, trimHtmlBlockSyntax } from '~/lib/llm-utils';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  let { text } = await generateText({
    model: google('gemini-2.0-flash-exp'),
    system: `\n
        - you help users generate a HTML <div /> for contract documents
        - keep your responses limited to only the HTML <div /> content
        - your output will be checked against an HTML parser
        - DO NOT respond with text that is NOT HTML, because the parser won't be able to validate your output
      `,
    prompt,
  });

  // purify output
  text = trimHtmlBlockSyntax(text);
  text = getRelevantHtmlContent(text);

  return Response.json({ text });
}

// export async function POST() {
//   return Response.json({
//     text: `
// <table>
//   <thead>
//     <tr>
//       <th>Column 1</th>
//       <th>Column 2</th>
//       <th>Column 3</th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr>
//       <td>Data 1</td>
//       <td>Data 2</td>
//       <td>Data 3</td>
//     </tr>
//     <tr>
//       <td>Data 4</td>
//       <td>Data 5</td>
//       <td>Data 6</td>
//     </tr>
//     <tr>
//       <td>Data 7</td>
//       <td>Data 8</td>
//       <td>Data 9</td>
//     </tr>
//   </tbody>
// </table>
// `,
//   });
// }

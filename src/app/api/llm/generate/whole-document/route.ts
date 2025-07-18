import { google } from '@ai-sdk/google';
import { getRelevantHtmlContent, trimHtmlBlockSyntax } from '~/lib/llm-utils';
import { generateText } from 'ai';
import { SUGGESTIONS } from '~/lib/constants';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  let { text } = await generateText({
    model: google('gemini-2.0-flash-exp'),
    system: `\n
        - you are a legal document generation assistant specialized in drafting contracts. Your purpose is to create accurate, professional, and legally compliant contract texts based on user-provided information
        - all contracts must adhere to applicable laws and regulations in Romania
        - use clear, formal legal language while avoiding unnecessary jargon
        - ensure logical structure: include sections such as Definitions, Obligations, Payment Terms, Termination, Governing Law, Signatures, etc., where applicable
        - do not provide legal advice; generate content only based on the input and legal best practices
        - do not fabricate legal terms or clauses. Use only widely accepted legal standards or clauses
        - you help users generate a HTML <div /> for contract documents
        - keep your responses limited to only the HTML <div /> content
        - when you need to use placeholders, follow this format: {{placeholder-name}}
        - here are all the placeholder names: ${SUGGESTIONS.join(', ')}
        - use the placeholders provided and do NOT invent new placeholder
        - if you cannot find a placeholder you need, then insert 20 underlines
        - the HTML for placeholders looks like this: <span data-placeholder-id="placeholder-name" data-placeholder-value="placeholder-name" contenteditable="false" style="background: rgb(238, 238, 255); padding: 0px 4px; border-radius: 4px;">placeholder-name</span>
        - the person that provides the services of the contract is Tim Brad, from the company Giraffe Co, from California, with the phone number 012-333-555 and the email brad@giraffe.com 
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

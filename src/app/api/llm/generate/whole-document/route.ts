import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { text } = await generateText({
    model: google('gemini-2.0-flash-exp'),
    system: `\n
        - you help users generate HTML for contract documents
        - keep your responses limited to only the HTML content
        - your output will be checked against an HTML parser
        - DO NOT respond with text that is NOT HTML, because the parser won't be able to validate your output
      `,
    prompt,
  });

  return Response.json({ text });
}

// export async function POST() {
//   return Response.json({
//     text: `
// <table>
//   <thead>
//     <tr>
//       <th scope="col">Header 1</th>
//       <th scope="col">Header 2</th>
//       <th>Column 3</th>
//       <th>Column 4</th>
//       <th>Column 5</th>
//       <th>Column 6</th>
//       <th>Column 7</th>
//       <th>Column 8</th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr>
//       <td>Data 1</td>
//       <td>Data 2</td>
//       <td>Data 3</td>
//       <td>Data 4</td>
//       <td>Data 5</td>
//       <td>Data 6</td>
//       <td>Data 7</td>
//       <td>Data 8</td>
//     </tr>
//     <tr>
//       <td>Data 9</td>
//       <td>Data 10</td>
//       <td>Data 11</td>
//       <td>Data 12</td>
//       <td>Data 13</td>
//       <td>Data 14</td>
//       <td>Data 15</td>
//       <td>Data 16</td>
//     </tr>
//     <tr>
//       <td>Data 17</td>
//       <td>Data 18</td>
//       <td>Data 19</td>
//       <td>Data 20</td>
//       <td>Data 21</td>
//       <td>Data 22</td>
//       <td>Data 23</td>
//       <td>Data 24</td>
//     </tr>
//     <tr>
//       <td>Data 25</td>
//       <td>Data 26</td>
//       <td>Data 27</td>
//       <td>Data 28</td>
//       <td>Data 29</td>
//       <td>Data 30</td>
//       <td>Data 31</td>
//       <td>Data 32</td>
//     </tr>
//     <tr>
//       <td>Data 33</td>
//       <td>Data 34</td>
//       <td>Data 35</td>
//       <td>Data 36</td>
//       <td>Data 37</td>
//       <td>Data 38</td>
//       <td>Data 39</td>
//       <td>Data 40</td>
//     </tr>
//   </tbody>
// </table>
// `,
//   });
// }

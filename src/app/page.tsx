import { Editor } from '~/modules/lexical/editor';

export default function HomePage() {
  return (
    <main className='grid grid-cols-1 p-2'>
      <div className='mx-auto w-[700px]'>
        <Editor />
      </div>
    </main>
  );
}

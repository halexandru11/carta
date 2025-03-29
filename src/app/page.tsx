import { Editor } from '~/modules/lexical/editor';

export default function HomePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <div className='w-[700px]'>
        <Editor />
      </div>
    </main>
  );
}

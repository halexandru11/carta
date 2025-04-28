import { Editor } from '~/modules/lexical/editor';

export default function DocumentPage() {
  return (
    <div className='p-2'>
      <div className='mx-auto w-[700px]'>
        <Editor />
      </div>
    </div>
  );
}

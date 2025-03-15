import { Button } from '~/components/ui/button';

export default function HomePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <div className='mx-auto grid gap-1.5 grid-cols-6 place-items-center'>
        <Button variant='primary' size='xs'>Hey</Button>
        <Button variant='secondary' size='xs'>Hey</Button>
        <Button variant='destructive' size='xs'>Hey</Button>
        <Button variant='info' size='xs'>Hey</Button>
        <Button variant='success' size='xs'>Hey</Button>
        <Button variant='warning' size='xs'>Hey</Button>
        <Button variant='primary' size='sm'>Hey</Button>
        <Button variant='secondary' size='sm'>Hey</Button>
        <Button variant='destructive' size='sm'>Hey</Button>
        <Button variant='info' size='sm'>Hey</Button>
        <Button variant='success' size='sm'>Hey</Button>
        <Button variant='warning' size='sm'>Hey</Button>
        <Button variant='primary'>Hey</Button>
        <Button variant='secondary'>Hey</Button>
        <Button variant='destructive'>Hey</Button>
        <Button variant='info'>Hey</Button>
        <Button variant='success'>Hey</Button>
        <Button variant='warning'>Hey</Button>
        <Button variant='outline-primary'>Hey</Button>
        <Button variant='outline-secondary'>Hey</Button>
        <Button variant='outline-destructive'>Hey</Button>
        <Button variant='outline-info'>Hey</Button>
        <Button variant='outline-success'>Hey</Button>
        <Button variant='outline-warning'>Hey</Button>
        <Button variant='ghost-primary'>Hey</Button>
        <Button variant='ghost-secondary'>Hey</Button>
        <Button variant='ghost-destructive'>Hey</Button>
        <Button variant='ghost-info'>Hey</Button>
        <Button variant='ghost-success'>Hey</Button>
        <Button variant='ghost-warning'>Hey</Button>
        <Button variant='link-primary'>Hey</Button>
        <Button variant='link-secondary'>Hey</Button>
        <Button variant='link-destructive'>Hey</Button>
        <Button variant='link-info'>Hey</Button>
        <Button variant='link-success'>Hey</Button>
        <Button variant='link-warning'>Hey</Button>
      </div>
    </main>
  );
}

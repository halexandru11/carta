import 'server-only';

type PagesLayoutProps = {
  children?: React.ReactNode;
};

export default function PagesLayout(props: PagesLayoutProps) {
  return <div className='mx-auto max-w-7xl'>{props.children}</div>;
}

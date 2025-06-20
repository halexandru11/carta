import 'server-only';

import { AppSidebar } from '~/components/custom/app-sidebar';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';

type PagesLayoutProps = {
  children?: React.ReactNode;
};

export default function PagesLayout(props: PagesLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <div className='mx-auto max-w-7xl w-full'>{props.children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

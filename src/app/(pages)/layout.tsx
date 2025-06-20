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
        <div className='mx-auto w-full max-w-7xl p-2'>{props.children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

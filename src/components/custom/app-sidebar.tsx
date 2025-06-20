'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '~/../public/images/logo-64.png';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '~/components/ui/sidebar';
import { ArchiveRestoreIcon, FileTextIcon, MoonIcon, SunIcon, UsersIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

const links = [
  {
    url: '/documents',
    name: 'Documents',
    icon: FileTextIcon,
  },
  {
    url: '/templates',
    name: 'Templates',
    icon: ArchiveRestoreIcon,
  },
  {
    url: '/clients',
    name: 'Clients',
    icon: UsersIcon,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setTheme, theme } = useTheme();

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='flex flex-row items-center'>
        <Image src={Logo} width={44} height={44} alt='Logo Carta' />
        <span className='truncate text-left text-lg font-semibold leading-tight'>Carta</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton tooltip={item.name} asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Options</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip='Toggle Theme'
                  onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
                >
                  {theme === 'light' ? (
                    <SunIcon className='block rotate-0 transition-all dark:hidden dark:-rotate-90' />
                  ) : (
                    <MoonIcon className='hidden rotate-90 transition-all dark:block dark:rotate-0' />
                  )}
                  <span>Toggle Theme</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <SidebarTrigger />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

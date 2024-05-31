import { ReactElement } from 'react';

import { Icons } from '@rearden/ui/components/icons';

export const ID = ':id';

export enum PagePath {
  INDEX = '/',
  FEED = '/feed',
  PORTFOLIO = '/portfolio',
  CHAT = '/chat',
  CHAT_DETAILS = '/chat/:id',
  PROFILE = '/profile',
  SETTINGS = '/settings',
}

export interface Nav {
  href: PagePath;
  title: string;
  active: boolean;
  subLinks?: PagePath[];
  icon?: ReactElement;
}

export const headerLinks: Nav[] = [
  {
    title: 'chat',
    href: PagePath.INDEX,
    subLinks: [PagePath.CHAT],
    active: true,
  },
  {
    title: 'feed',
    href: PagePath.FEED,
    active: false,
  },
  {
    title: 'PORTFOLIO',
    href: PagePath.PORTFOLIO,
    active: true,
  },
];

export const sidebarLinks: Nav[] = [
  {
    title: 'feed',
    href: PagePath.FEED,
    active: false,
    icon: <Icons.feed />,
  },
  {
    title: 'portfolio',
    href: PagePath.PORTFOLIO,
    active: false,
    icon: <Icons.profile />,
  },
];

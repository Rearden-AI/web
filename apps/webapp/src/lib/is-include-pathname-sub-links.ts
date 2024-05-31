import { Nav } from './nav-routes';

export const isIncludePathnameSubLinks = (subLinks: Nav['subLinks'], pathname: string) => {
  if (!subLinks) return false;

  const arr: boolean[] = [];

  subLinks.forEach(i => {
    arr.push(pathname.includes(i));
  });

  return arr.includes(true);
};

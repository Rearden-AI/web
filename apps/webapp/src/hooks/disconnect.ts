import { useRouter } from 'next/navigation';
import { PagePath } from '../constants/nav-routes';

export const useDisconnect = () => {
  const router = useRouter();

  //TODO add disconnect
  return () => {
    // disconnect(wallet);
    localStorage.clear();
    router.push(PagePath.INDEX);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
};

import { HeaderActor } from '@/components/layout/header-actor';
import { HeaderLogo } from '@/components/layout/header-logo';
import { HeaderShell } from '@/components/layout/header-shell';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
  return (
    <>
      <HeaderShell slotLeft={<HeaderLogo />} slotRight={<HeaderActor />} />
      <Outlet />
    </>
  );
};

export default HomeLayout;

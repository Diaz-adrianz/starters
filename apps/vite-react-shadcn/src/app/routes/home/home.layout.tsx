import { HeaderUser } from '@/components/layout/header-user';
import { HeaderLogo } from '@/components/layout/header-logo';
import { HeaderShell } from '@/components/layout/header-shell';
import { Outlet } from 'react-router-dom';
import { HeaderNotifications } from '@/components/layout/header-notifications';

const HomeLayout = () => {
  return (
    <>
      <HeaderShell
        slotLeft={<HeaderLogo />}
        slotRight={
          <>
            <HeaderNotifications />
            <HeaderUser />
          </>
        }
      />
      <Outlet />
    </>
  );
};

export default HomeLayout;

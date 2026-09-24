import {
  Header,
  HeaderApps,
  HeaderLogo,
  HeaderNotifications,
  HeaderUser,
} from '@/components/shared/header';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
  return (
    <>
      <Header
        slotLeft={<HeaderLogo />}
        slotRight={
          <>
            <HeaderNotifications />
            <HeaderApps />
            <HeaderUser />
          </>
        }
      />
      <Outlet />
    </>
  );
};

export default HomeLayout;

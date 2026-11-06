import {
  Header,
  HeaderLogo,
  HeaderPortals,
  HeaderUser,
} from '@/components/shared/header';
import { HeaderNotifications } from '@/features/notification';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
  return (
    <>
      <Header
        slotLeft={<HeaderLogo />}
        slotRight={
          <>
            <HeaderNotifications />
            <HeaderPortals />
            <HeaderUser />
          </>
        }
      />
      <Outlet />
    </>
  );
};

export default HomeLayout;

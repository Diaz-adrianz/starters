import {
  Header,
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
            <HeaderUser />
          </>
        }
      />
      <Outlet />
    </>
  );
};

export default HomeLayout;

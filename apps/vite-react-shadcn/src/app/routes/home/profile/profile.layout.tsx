import { Outlet } from 'react-router-dom';

const ProfileLayout = () => {
  return (
    <div className="min-h-svh bg-muted">
      <Outlet />
    </div>
  );
};

export default ProfileLayout;

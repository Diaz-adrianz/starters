import { Logo } from '@/assets/images';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-svh gap-6 bg-muted p-6">
      <div className="m-auto flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md">
            <img src={Logo} />
          </div>
          Company Ipsum
        </a>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

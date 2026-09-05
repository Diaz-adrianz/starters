import { Logo } from '@/assets/images';
import { Link } from 'react-router-dom';

export const HeaderLogo = () => {
  return (
    <Link to={'/'} className="w-8">
      <img src={Logo} alt="" />
    </Link>
  );
};

import { RiApps2Fill, RiApps2Line } from '@remixicon/react';
import { Button } from '../../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '../../ui/popover';
import { useState } from 'react';
import authStore from '@/stores/auth.store';
import { LogoAdminApp } from '@/assets/images';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { useAbility } from '@/app/providers';
import { Link } from 'react-router-dom';

const Apps: {
  logo: string;
  name: string;
  to: string;
  ability?: { action: string; subject: string };
}[] = [
  {
    logo: LogoAdminApp,
    name: 'Admin',
    to: '/admin',
    ability: { action: 'visit', subject: 'admin-app' },
  },
];

export const HeaderApps = () => {
  const ability = useAbility();

  const authUser = authStore((s) => s.user),
    authStatus = authStore((s) => s.status);

  const [open, setOpen] = useState(false);

  if (authStatus === 'unauthenticated' || !authUser) return null;

  const apps = Apps.filter((app) =>
    app.ability ? ability.can(app.ability.action, app.ability.subject) : true
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size={'icon'}>
          {open ? <RiApps2Fill /> : <RiApps2Line />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-full max-w-sm min-w-72">
        <PopoverHeader>
          <PopoverTitle>Apps</PopoverTitle>
          <PopoverDescription>
            {!apps.length && 'No apps available'}
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid grid-cols-2">
          {apps.map((app) => (
            <Item className="flex-col" key={app.name} asChild>
              <Link to={app.to}>
                <ItemMedia variant={'image'}>
                  <img src={app.logo} alt="" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{app.name}</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

import { useEffect, useMemo, type ReactNode } from 'react';
import authStore from '@/stores/auth.store';
import { abilityStore } from '@/stores/ability.store';
import { useUserAccessList } from '@/features/access-control';
import { defineAbilityFor } from '@/lib/casl/ability.util';
import { AbilityProvider as CaslAbilityProvider } from '@casl/react';
import type { AbilityItem } from '@/lib/casl/ability.type';

function AbilityProvider({ children }: { children: ReactNode }) {
  const authStatus = authStore((s) => s.status);

  const abilities = abilityStore((s) => s.abilities),
    setAbilities = abilityStore((s) => s.setAbilities);

  const { refetch } = useUserAccessList({
    enabled: authStatus === 'authenticated',
  });

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      setAbilities([]);
      return;
    }
    if (authStatus !== 'authenticated') return;

    refetch().then(({ data }) => {
      if (!data) return;

      const items: AbilityItem[] = [];

      data.permissions.forEach((permission) => {
        const parts = permission.split(':');
        if (parts.length !== 3) return;
        const [module, resource, action] = parts;
        items.push({ action, subject: `${module}:${resource}` });
      });

      setAbilities(items);
    });
  }, [authStatus, refetch, setAbilities]);

  const ability = useMemo(() => defineAbilityFor(abilities), [abilities]);

  return <CaslAbilityProvider value={ability}>{children}</CaslAbilityProvider>;
}

export { AbilityProvider };

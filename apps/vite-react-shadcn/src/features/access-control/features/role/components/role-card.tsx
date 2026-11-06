import { Card, CardContent } from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';
import type { ComponentProps } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import type { Role } from '../types/role.type';

function RoleCard({
  className,
  role,
  ...props
}: Omit<ComponentProps<typeof Card>, 'role'> & {
  role: Pick<Role, 'name' | 'default' | 'enabled'>;
}) {
  return (
    <Card className={className} {...props}>
      <CardContent>
        <ItemGroup>
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Name</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>{role.name}</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Enabled</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>{role.enabled ? 'Yes' : 'No'}</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>App default</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>{role.default ? 'Yes' : 'No'}</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

function RoleCardSkeleton({
  className,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <Card className={className} {...props}>
      <CardContent>
        <ItemGroup>
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Name</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-5 w-24" />
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Enabled</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-5 w-16" />
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>App default</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-5 w-16" />
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

export { RoleCard, RoleCardSkeleton };

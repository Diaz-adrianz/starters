import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';
import { getInitials } from '@/utils/string';
import { RiEditLine } from '@remixicon/react';
import type { ComponentProps } from 'react';
import type { User } from '../types/user.type';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/date';

export const UserCard = ({
  className,
  user,
  ...props
}: ComponentProps<typeof Card> & {
  user: Pick<User, 'id' | 'avatar' | 'email' | 'username' | 'createdAt'>;
}) => {
  return (
    <Card className={className} {...props}>
      <CardContent>
        <div className="flex flex-col items-center gap-4 self-center pt-4 pb-8">
          <Avatar className="size-40">
            <AvatarImage src={user.avatar ?? ''} />
            <AvatarFallback className="text-5xl">
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          <Button variant={'outline'}>
            <RiEditLine /> Edit Photo
          </Button>
        </div>
        <ItemGroup>
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Username</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>{user.username}</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Email</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>{user.email}</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Joined at</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>
                {formatDate(user.createdAt, 'dd MMMM yyyy')}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  );
};

export const UserCardSkeleton = ({
  className,
  ...props
}: ComponentProps<typeof Card>) => {
  return (
    <Card className={className} {...props}>
      <CardContent>
        <div className="flex flex-col items-center gap-4 self-center pt-4 pb-8">
          <Skeleton className="size-40 rounded-full" />
          <Skeleton className="h-10 w-32" />
        </div>
        <ItemGroup>
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Username</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-6 w-16" />
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Email</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-6 w-24" />
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Joined at</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-6 w-24" />
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  );
};

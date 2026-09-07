import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
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
  user: Pick<
    User,
    'id' | 'avatar' | 'email' | 'username' | 'roles' | 'createdAt'
  >;
}) => {
  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:gap-8 lg:gap-12">
        <div className="flex flex-col items-center gap-4 self-center sm:mt-2 sm:self-start">
          <Avatar className="size-40">
            <AvatarImage src={user.avatar ?? ''} />
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <Button variant={'outline'}>
            <RiEditLine /> Edit Photo
          </Button>
        </div>
        <div className="flex grow flex-col">
          <Item>
            <ItemContent>
              <ItemTitle>Username</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>{user.username}</ItemDescription>
            </ItemContent>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Email</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>{user.email}</ItemDescription>
            </ItemContent>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Roles</ItemTitle>
            </ItemContent>
            <ItemContent className="max-w-60 flex-row flex-wrap justify-end">
              {user.roles?.map((r) => (
                <Badge key={r.id} variant={'secondary'}>
                  {r.role.name}
                </Badge>
              ))}
            </ItemContent>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Joined at</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>
                {formatDate(user.createdAt, 'dd MMMM yyyy')}
              </ItemDescription>
            </ItemContent>
          </Item>
        </div>
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
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:gap-8 lg:gap-12">
        <div className="flex flex-col items-center gap-4 self-center sm:mt-2 sm:self-start">
          <Skeleton className="size-40 rounded-full" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex grow flex-col">
          <Item>
            <ItemContent>
              <ItemTitle>Username</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-6 w-16" />
            </ItemContent>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Email</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-6 w-24" />
            </ItemContent>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Roles</ItemTitle>
            </ItemContent>
            <ItemContent className="max-w-60 flex-row flex-wrap justify-end">
              <Skeleton className="h-6 w-16" />
            </ItemContent>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Joined at</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-6 w-24" />
            </ItemContent>
          </Item>
        </div>
      </CardContent>
    </Card>
  );
};

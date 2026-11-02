import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import type { ComponentProps } from 'react';
import type { User } from '../types/user.type';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/date';
import { Badge } from '@/components/ui/badge';
import { UserStatusMap } from '../constants/user.constant';

type UserCardData = Pick<
  User,
  'id' | 'avatar' | 'email' | 'username' | 'status' | 'createdAt'
>;

type UserCardHideableData = (keyof Pick<UserCardData, 'status'>)[];

function UserCard({
  className,
  user,
  hides,
  ...props
}: ComponentProps<typeof Card> & {
  user: UserCardData;
  hides?: UserCardHideableData;
}) {
  return (
    <Card className={className} {...props}>
      <CardContent>
        <div className="flex flex-col items-center self-center pt-4 pb-8">
          <Avatar className="mb-4 size-32">
            <AvatarImage src={user.avatar ?? ''} />
            <AvatarFallback className="text-5xl">
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          <h1 className="typo-heading-md">{user.username}</h1>
          <p className="typo-body-md text-muted-foreground">{user.email}</p>
        </div>
        <ItemGroup>
          {!hides?.includes('status') && (
            <>
              <Item size={'xs'}>
                <ItemContent>
                  <ItemTitle>Status</ItemTitle>
                </ItemContent>
                <ItemContent>
                  <Badge
                    variant={UserStatusMap[user.status].meta?.badgeVariant}
                  >
                    {UserStatusMap[user.status].label}
                  </Badge>
                </ItemContent>
              </Item>
              <ItemSeparator className="m-0" />
            </>
          )}
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
}

function UserCardSkeleton({
  hides,
  className,
  ...props
}: ComponentProps<typeof Card> & {
  hides?: UserCardHideableData;
}) {
  return (
    <Card className={className} {...props}>
      <CardContent>
        <div className="flex flex-col items-center self-center pt-4 pb-8">
          <Skeleton className="mb-4 size-32 rounded-full" />
          <Skeleton className="mb-2 h-8 w-32" />
          <Skeleton className="h-6 w-52" />
        </div>
        <ItemGroup>
          {!hides?.includes('status') && (
            <>
              <Item size={'xs'}>
                <ItemContent>
                  <ItemTitle>Status</ItemTitle>
                </ItemContent>
                <ItemContent>
                  <Skeleton className="h-6 w-16" />
                </ItemContent>
              </Item>
              <ItemSeparator className="m-0" />
            </>
          )}
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
}

export { UserCard, UserCardSkeleton };

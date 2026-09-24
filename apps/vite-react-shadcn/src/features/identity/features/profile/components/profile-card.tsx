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
import type { Profile } from '../types/profile.type';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/date';

export const ProfileCard = ({
  className,
  profile,
  ...props
}: ComponentProps<typeof Card> & {
  profile: Pick<
    Profile,
    | 'firstName'
    | 'lastName'
    | 'phoneNumber'
    | 'dateOfBirth'
    | 'gender'
    | 'bio'
    | 'updatedAt'
  >;
}) => {
  return (
    <Card className={className} {...props}>
      <CardContent>
        <ItemGroup>
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>First name</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>{profile.firstName || '-'}</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Last name</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>{profile.lastName || '-'}</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Phone number</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>{profile.phoneNumber || '-'}</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Birth date</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>
                {formatDate(profile.dateOfBirth, 'dd MMM yyyy') || '-'}
              </ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Gender</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>{profile.gender || '-'}</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Bio</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>{profile.bio || '-'}</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Updated</ItemTitle>
            </ItemContent>
            <ItemContent>
              <ItemDescription>
                {formatDate(profile.updatedAt, 'dd MMM yyyy, HH:mm')}
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  );
};

export const ProfileCardSkeleton = ({
  className,
  ...props
}: ComponentProps<typeof Card>) => {
  return (
    <Card className={className} {...props}>
      <CardContent>
        <ItemGroup>
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>First name</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-5 w-24" />
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Last name</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-5 w-24" />
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Phone number</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-5 w-32" />
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Birth date</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-5 w-24" />
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Gender</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-5 w-16" />
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Bio</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="mb-1 h-5 w-40" />
              <Skeleton className="ms-auto h-5 w-32" />
            </ItemContent>
          </Item>
          <ItemSeparator className="m-0" />
          <Item size={'xs'}>
            <ItemContent>
              <ItemTitle>Updated</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Skeleton className="h-5 w-16" />
            </ItemContent>
          </Item>
        </ItemGroup>
      </CardContent>
    </Card>
  );
};

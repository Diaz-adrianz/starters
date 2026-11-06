import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Switch } from '@/components/ui/switch';
import { RiNotificationBadgeLine } from '@remixicon/react';
import type { ComponentProps } from 'react';
import { fcmStore } from '../stores/fcm.store';
import { cn } from 'cn';

function FcmEnablerSetting({
  size = 'xs',
  ...props
}: ComponentProps<typeof Item>) {
  const loading = fcmStore((s) => s.loading),
    enabled = fcmStore((s) => s.enabled),
    toggle = fcmStore((s) => s.toggle);

  const supported = typeof Notification !== 'undefined',
    permission = supported ? Notification.permission : 'unsupported',
    blocked = permission === 'denied';

  return (
    <Item size={size} {...props}>
      <ItemMedia variant="icon">
        <RiNotificationBadgeLine className="size-6" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Push</ItemTitle>
        <ItemDescription
          className={cn(
            'line-clamp-none',
            blocked || permission === 'unsupported' ? 'text-destructive' : ''
          )}
        >
          {blocked
            ? 'Blocked in your browser. Allow notifications for this site in your browser settings to turn this on.'
            : permission === 'unsupported'
              ? 'Not supported in this browser.'
              : 'Get notified in this browser, even when the tab is closed.'}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Switch
          disabled={loading || blocked || permission === 'unsupported'}
          checked={enabled}
          onCheckedChange={toggle}
        />
      </ItemActions>
    </Item>
  );
}

export { FcmEnablerSetting };

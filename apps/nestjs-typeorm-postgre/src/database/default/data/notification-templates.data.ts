import { Channel } from '../../../modules/notification/enums/channel.enum';

export const NotificationTemplatesData = [
  {
    key: 'greetings',
    channel: Channel.PUSH,
    title: 'Hello, {{name}}',
    body: 'Greetings! How are you today, {{name}}?',
    availableKeys: ['name'],
    sensitiveKeys: [],
  },
  {
    key: 'greetings',
    channel: Channel.IN_APP,
    title: 'Hello, {{name}}',
    body: 'Greetings! How are you today, {{name}}?',
    availableKeys: ['name'],
    sensitiveKeys: [],
  },
];

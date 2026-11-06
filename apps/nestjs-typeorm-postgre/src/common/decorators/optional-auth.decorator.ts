import { SetMetadata } from '@nestjs/common';

export const OPTIONAL_AUTH_KEY = 'OptionalAuth';
export const OptionalAuth = () => SetMetadata(OPTIONAL_AUTH_KEY, true);

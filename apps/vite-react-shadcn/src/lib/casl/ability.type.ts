import { type MongoAbility } from '@casl/ability';

export type Ability = MongoAbility<[string, string]>;

export type AbilityItem = { action: string; subject: string };

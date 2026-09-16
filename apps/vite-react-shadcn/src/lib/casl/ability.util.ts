import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import type { AbilityItem, Ability } from './ability.type';

export const defineAbilityFor = (items: AbilityItem[]): Ability => {
  const { can, build } = new AbilityBuilder<Ability>(createMongoAbility);

  items.forEach((item) => can(item.action, item.subject));

  return build();
};

import type { AbilityItem } from '@/lib/casl/ability.type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AbilityState = {
  abilities: AbilityItem[];
};

type AbilityAction = {
  setAbilities: (items: AbilityItem[]) => void;
};

export const abilityStore = create<AbilityState & AbilityAction>()(
  persist(
    (set) => ({
      abilities: [],
      setAbilities: (items) => set({ abilities: items }),
    }),
    { name: 'ability-storage' }
  )
);

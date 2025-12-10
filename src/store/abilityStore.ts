import { create } from 'zustand';
import { AppAbility, defineAbilityFor, Permission } from '@/lib/ability';
import { createMongoAbility } from '@casl/ability';

interface AbilityState {
  ability: AppAbility;
  permissions: Permission[];
  isLoaded: boolean;
  setPermissions: (permissions: Permission[]) => void;
  clearAbility: () => void;
}

export const useAbilityStore = create<AbilityState>((set) => ({
  ability: createMongoAbility([]),
  permissions: [],
  isLoaded: false,
  setPermissions: (permissions) =>
    set({
      permissions,
      ability: defineAbilityFor(permissions),
      isLoaded: true,
    }),
  clearAbility: () =>
    set({
      ability: createMongoAbility([]),
      permissions: [],
      isLoaded: false,
    }),
}));

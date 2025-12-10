import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = 
  | 'Medication'
  | 'Prescription'
  | 'Consumption'
  | 'Caregiver'
  | 'WatchOwnerInfo'
  | 'Notification'
  | 'Chat'
  | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export interface Permission {
  action: Actions;
  subject: Subjects;
}

export const defineAbilityFor = (permissions: Permission[]): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  
  permissions.forEach(permission => {
    can(permission.action, permission.subject);
  });

  return build();
};

// Default abilities for each role (mock - will be fetched from backend)
export const getRolePermissions = (role: string): Permission[] => {
  switch (role) {
    case 'doctor':
      return [
        { action: 'manage', subject: 'Medication' },
        { action: 'manage', subject: 'Prescription' },
        { action: 'read', subject: 'Consumption' },
        { action: 'manage', subject: 'Caregiver' },
        { action: 'read', subject: 'WatchOwnerInfo' },
        { action: 'read', subject: 'Notification' },
        { action: 'manage', subject: 'Chat' },
      ];
    case 'nurse':
      return [
        { action: 'read', subject: 'Medication' },
        { action: 'read', subject: 'Prescription' },
        { action: 'manage', subject: 'Consumption' },
        { action: 'read', subject: 'Caregiver' },
        { action: 'read', subject: 'WatchOwnerInfo' },
        { action: 'read', subject: 'Notification' },
        { action: 'manage', subject: 'Chat' },
      ];
    case 'family':
      return [
        { action: 'read', subject: 'Medication' },
        { action: 'read', subject: 'Prescription' },
        { action: 'manage', subject: 'Consumption' },
        { action: 'read', subject: 'Caregiver' },
        { action: 'read', subject: 'WatchOwnerInfo' },
        { action: 'read', subject: 'Notification' },
        { action: 'manage', subject: 'Chat' },
      ];
    case 'elder':
      return [
        { action: 'read', subject: 'Medication' },
        { action: 'read', subject: 'Prescription' },
        { action: 'manage', subject: 'Consumption' },
        { action: 'manage', subject: 'Caregiver' },
        { action: 'manage', subject: 'WatchOwnerInfo' },
        { action: 'manage', subject: 'Notification' },
        { action: 'manage', subject: 'Chat' },
      ];
    default:
      return [];
  }
};

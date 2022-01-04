export interface Profile {
  firstName: string;
  middleName?: string | undefined;
  lastName: string;
  personalImage?: string | undefined;
}

export function getFullName(profile: Profile): string {
  if (profile.middleName === undefined) {
    return `${profile.firstName} ${profile.lastName}`;
  }
  return `${profile.firstName} ${profile.middleName} ${profile.lastName}`;
}

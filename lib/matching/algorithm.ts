import type { Profile } from '@/types/profile'

export function calculateCompatibility(profileA: Profile, profileB: Profile) {
    const sharedSkills = profileA.skills.filter((skills) => 
      profileB.skills.includes(skills)
    );
    return sharedSkills.length / profileA.skills.length;
  }
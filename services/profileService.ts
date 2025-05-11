/* eslint-disable @typescript-eslint/no-unused-vars */

import { toast } from 'sonner';

export interface ProfileData {
  name: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  timezone: string;
  githubUsername: string;
  skills: string[];
  availability: string;
}

const STORAGE_KEY = 'buddyfi_user_profile';

export const saveUserProfile = (profile: ProfileData, walletAddress?: string): boolean => {
  try {
    // In a production app, you'd save this to a database linked to the wallet address
    // For now, we'll use localStorage as a demo
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    console.log('Profile saved successfully:', profile);
    return true;
  } catch (error) {
    console.error('Failed to save profile:', error);
    toast.error('Failed to save profile');
    return false;
  }
};

export const loadUserProfile = (): ProfileData | null => {
  try {
    const profileData = localStorage.getItem(STORAGE_KEY);
    if (profileData) {
      return JSON.parse(profileData);
    }
    return null;
  } catch (error) {
    console.error('Failed to load profile:', error);
    toast.error('Failed to load profile data');
    return null;
  }
};

// Default profile for new users
export const getDefaultProfile = (): ProfileData => ({
  name: 'New User',
  bio: 'Web3 enthusiast looking for hackathon teammates!',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  timezone: getLocalTimezone(),
  githubUsername: '',
  skills: ['Web3', 'Blockchain'],
  availability: 'Weekends'
});

// Helper to get local timezone
function getLocalTimezone(): string {
  try {
    const timeFormat = new Intl.DateTimeFormat().resolvedOptions();
    return `UTC${new Date().getTimezoneOffset() < 0 ? '+' : '-'}${Math.abs(new Date().getTimezoneOffset() / 60)} (${timeFormat.timeZone})`;
  } catch {
    return 'UTC+0';
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ProfileForm.tsx
'use client';

import { useState } from 'react';

interface ProfileFormProps {
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

interface ProfileFormData {
  name: string;
  bio: string;
  skills: string;
  avatar: string;
  social: {
    twitter: string;
    github: string;
    linkedin: string;
  };
}

export default function ProfileForm({ onSubmit, isSubmitting = false }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bio: '',
    skills: '',
    avatar: '',
    social: {
      twitter: '',
      github: '',
      linkedin: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields (social links)
      const [parent, child] = name.split('.');
      
      if (parent === 'social') {
        setFormData(prev => ({
          ...prev,
          social: {
            ...prev.social,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process skills into an array
    const processedData = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
    };
    
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium mb-1">
          Skills (comma separated)
        </label>
        <input
          type="text"
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="nextjs, solana, react, typescript"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="avatar" className="block text-sm font-medium mb-1">
          Avatar URL (optional)
        </label>
        <input
          type="url"
          id="avatar"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium">Social Links (optional)</h3>
        
        <div>
          <label htmlFor="twitter" className="block text-sm font-medium mb-1">
            Twitter/X
          </label>
          <input
            type="text"
            id="twitter"
            name="social.twitter"
            value={formData.social.twitter}
            onChange={handleChange}
            placeholder="Enter your twitter/X username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="github" className="block text-sm font-medium mb-1">
            GitHub
          </label>
          <input
            type="text"
            id="github"
            name="social.github"
            value={formData.social.github}
            onChange={handleChange}
            placeholder="Enter your github username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
      >
        {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
      </button>
    </form>
  );
}
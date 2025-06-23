/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ProfileForm.tsx
'use client';

import { useState } from 'react';
import { Github, Twitter, User, Link as LinkIcon } from 'lucide-react';

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
      github: ''
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
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Information */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] space-y-6">
          <h2 className="text-xl font-semibold text-indigo-400 flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1.5">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm resize-none"
                placeholder="Tell us about yourself..."
                required
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-1.5">
                Skills
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="nextjs, solana, react, typescript"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Separate skills with commas</p>
            </div>
          </div>
        </div>

        {/* Right Column - Social Links & Profile Picture */}
        <div className="space-y-6">
          {/* Social Links Section */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] space-y-6">
            <h2 className="text-xl font-semibold text-indigo-400 flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Social Links
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="github" className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </label>
                <input
                  type="text"
                  id="github"
                  name="social.github"
                  value={formData.social.github}
                  onChange={handleChange}
                  placeholder="Enter your GitHub username"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm"
                />
              </div>
              
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter/X
                </label>
                <input
                  type="text"
                  id="twitter"
                  name="social.twitter"
                  value={formData.social.twitter}
                  onChange={handleChange}
                  placeholder="Enter your Twitter/X username"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] space-y-4">
            <h2 className="text-xl font-semibold text-indigo-400 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Picture
            </h2>
            
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-300 mb-1.5">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/your-avatar.jpg"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent text-white placeholder-gray-500 backdrop-blur-sm"
              />
              <p className="mt-1 text-xs text-gray-500">Leave empty to use a default avatar</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white py-2.5 px-6 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base backdrop-blur-sm border border-white/10 shadow-lg shadow-indigo-500/20"
        >
          {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
}
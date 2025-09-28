import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import Textarea from '../../../components/ui/textarea';
import { Edit, MapPin, Mail, Phone, Globe, Plus, X } from 'lucide-react';
import { Person, ProfileEdit } from '../../../assets/managers';

interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  location: string;
  description: string;
  logo: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface Profile {
  name: string;
  title: string;
  location: string;
  openForOpportunities: boolean;
  about: string;
  email: string;
  phone: string;
  languages: string;
}

const initialProfile: Profile = {
  name: 'Jake Gyll',
  title: 'Product Designer at Twitter',
  location: 'Manchester, UK',
  openForOpportunities: true,
  about:
    "I'm a product designer + filmmaker currently working remotely at Twitter from beautiful Manchester, United Kingdom. I'm passionate about designing digital products that have a positive impact on the world.\n\nFor 10 years, I've specialised in interface, experience & interaction design as well as working in user research and product strategy for product agencies, big tech companies & start-ups.",
  email: 'jakegyll@email.com',
  phone: '+44 1245 572 135',
  languages: 'English, French',
};

export default function ManagerProfile(): JSX.Element {
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [additionalDetailsDialogOpen, setAdditionalDetailsDialogOpen] = useState(false);
  const [socialLinksDialogOpen, setSocialLinksDialogOpen] = useState(false);

  const [editingExperience, setEditingExperience] = useState < Experience | null > (null);

  const [profile, setProfile] = useState < Profile > (initialProfile);

  const [experiences, setExperiences] = useState < Experience[] > ([
    {
      id: '1',
      role: 'Product Designer',
      company: 'Twitter',
      duration: 'Full-Time • Jun 2019 - Present (1y 1m)',
      location: 'Manchester, UK',
      description:
        'Created and executed social media plan for 10 brands utilizing multiple features and content types to increase brand outreach, engagement, and leads.',
      logo: '🐦',
    },
    {
      id: '2',
      role: 'Growth Marketing Designer',
      company: 'GoDaddy',
      duration: 'Full-Time • Jun 2011 - May 2019 (8y)',
      location: 'Manchester, UK',
      description: '',
      logo: '🌐',
    },
  ]);

  const [socialLinks, setSocialLinks] = useState < SocialLink[] > ([
    { platform: 'Instagram', url: 'instagram.com/jakegyll' },
    { platform: 'Twitter', url: 'twitter.com/jakegyll' },
    { platform: 'Website', url: 'www.jakegyll.com' },
  ]);

  const [tempProfile, setTempProfile] = useState < Profile > (profile);
  const [tempExperience, setTempExperience] = useState < Experience > ({
    id: '',
    role: '',
    company: '',
    duration: '',
    location: '',
    description: '',
    logo: '',
  });
  const [tempSocialLinks, setTempSocialLinks] = useState < SocialLink[] > ([]);

  const handleEditExperience = (experience: Experience) => {
    setTempExperience(experience);
    setEditingExperience(experience);
    setExperienceDialogOpen(true);
  };

  const handleSaveExperience = () => {
    if (editingExperience) {
      setExperiences((prev) =>
        prev.map((exp) => (exp.id === editingExperience.id ? tempExperience : exp))
      );
    }
    setExperienceDialogOpen(false);
    setEditingExperience(null);
  };

  const handleSaveProfile = () => {
    setProfile(tempProfile);
    setAboutDialogOpen(false);
  };

  const handleSaveAdditionalDetails = () => {
    setProfile(tempProfile);
    setAdditionalDetailsDialogOpen(false);
  };

  const handleSaveSocialLinks = () => {
    setSocialLinks(tempSocialLinks);
    setSocialLinksDialogOpen(false);
  };

  const openAboutDialog = () => {
    setTempProfile(profile);
    setAboutDialogOpen(true);
  };

  const openAdditionalDetailsDialog = () => {
    setTempProfile(profile);
    setAdditionalDetailsDialogOpen(true);
  };

  const openSocialLinksDialog = () => {
    setTempSocialLinks([...socialLinks]);
    setSocialLinksDialogOpen(true);
  };

  const addSocialLink = () => {
    setTempSocialLinks((prev) => [...prev, { platform: '', url: '' }]);
  };

  const removeSocialLink = (index: number) => {
    setTempSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    setTempSocialLinks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // shared action buttons classes used in About dialog; reuse for consistency
  const cancelButtonClass =
    'm-0 w-[164px] h-[50px] rounded-none text-[16px] font-semibold bg-[#fff]';
  const saveButtonClass =
    'm-0 w-[164px] h-[50px] rounded-none text-[16px] font-semibold bg-[#019ACB] hover:bg-blue-700';

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header Section */}
        <div className="bg-white p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              {/* plain img tag (no Next.js Image) */}
              <div className="relative">
                <img
                  src={Person}
                  alt="Jake Gyll"
                  className="w-[160px] h-[160px] rounded-full object-cover"
                />
                <img
                  src={ProfileEdit}
                  alt="Edit"
                  className="w-10 h-10 absolute bottom-2 right-2 bg-white border border-gray-200 rounded-full"
                />
              </div>
            </div>

            <div className="flex-1 items-center self-center">
              <h1 className="text-[24px] font-semibold text-gray-900">{profile.name}</h1>
              <p className="text-[18px] text-gray-600 mb-2">{profile.title}</p>
              <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                <MapPin className="w-[18px] h-[18px]" />
                <span className="text-[18px] text-[#595959]">{profile.location}</span>
              </div>
              {profile.openForOpportunities && (
                <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-[#56CDAD1A] text-[#56CDAD] text-[16px] text-center border border-green-200 w-[296px] h-[48px]">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  OPEN FOR OPPORTUNITIES
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Me Section */}
            <div className="bg-[#fafafa] border border-[rgba(20, 20, 20, 0.1)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-gray-900">About Me</h2>
                <button onClick={openAboutDialog} className="p-1 hover:bg-gray-100 rounded">
                  <img
                    src={ProfileEdit}
                    alt="Jake Gyll"
                    className="w-[30px] h-[30px] object-cover"
                  />
                </button>
              </div>
              <p className="text-[#141414CC] text-[16px] leading-relaxed whitespace-pre-line">
                {profile.about}
              </p>
            </div>

            {/* Experiences Section */}
            <div className="bg-[#fafafa] border border-[rgba(20, 20, 20, 0.1)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-gray-900">Experiences</h2>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <img
                      src={ProfileEdit}
                      alt="Jake Gyll"
                      className="w-[30px] h-[30px] object-cover"
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {experiences.map((experience) => (
                  <div key={experience.id} className="flex gap-4">
                    <div className="w-[80px] h-[80px] bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                      {experience.logo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-[18px] font-semibold text-gray-900">
                            {experience.role}
                          </h3>
                          <p className="text-[16px] text-[#141414]">
                            {experience.company} • {experience.duration}
                          </p>
                          <p className="text-[#8E8E93] text-[16px]">{experience.location}</p>
                        </div>
                        <button
                          onClick={() => handleEditExperience(experience)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <img
                            src={ProfileEdit}
                            alt="Jake Gyll"
                            className="w-[30px] h-[30px] object-cover"
                          />
                        </button>
                      </div>
                      {experience.description && (
                        <p className="text-[#141414CC] text-[16px] mt-2 leading-relaxed">
                          {experience.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Additional Details */}
            <div className="bg-[#fafafa] border border-[rgba(20, 20, 20, 0.1)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-gray-900">Additional Details</h2>
                <button
                  onClick={openAdditionalDetailsDialog}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <img
                    src={ProfileEdit}
                    alt="Jake Gyll"
                    className="w-[30px] h-[30px object-cover"
                  />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500 self-start mt-1" />
                  <div>
                    <p className="text-[16px] text-gray-500">Email</p>
                    <p className="text-[16px] text-[#141414]">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500 self-start mt-1" />
                  <div>
                    <p className="text-[16px] text-gray-500">Phone</p>
                    <p className="text-[16px] text-[#141414]">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-500 self-start mt-1" />
                  <div>
                    <p className="text-[16px] text-gray-500">Languages</p>
                    <p className="text-[16px] text-[#141414]">{profile.languages}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[#fafafa] border border-[rgba(20, 20, 20, 0.1)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-gray-900">Social Links</h2>
                <button onClick={openSocialLinksDialog} className="p-1 hover:bg-gray-100 rounded">
                  <img
                    src={ProfileEdit}
                    alt="Jake Gyll"
                    className="w-[30px] h-[30px object-cover"
                  />
                </button>
              </div>

              <div className="space-y-3">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 text-gray-500 self-start mt-1">
                      {link.platform === 'Instagram' && '📷'}
                      {link.platform === 'Twitter' && '🐦'}
                      {link.platform === 'Website' && '🌐'}
                    </div>
                    <div>
                      <p className="text-[16px] text-gray-500">{link.platform}</p>
                      <p className="text-[16px] text-[#0088FF] decoration-solid decoration-[#0088FF] underline underline-offset-2 cursor-pointer">
                        {link.url}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Dialog */}
      <Dialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="w-full h-full p-0 flex items-center justify-between ">
            <DialogTitle className="text-[20px]">About</DialogTitle>
            <button
              onClick={() => setAboutDialogOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>
          <div className="border-b border-gray-200 mb-5" />
          <div className="space-y-4">
            <Textarea
              value={tempProfile.about}
              onChange={(e) => setTempProfile({ ...tempProfile, about: e.target.value })}
              className="min-h-[300px] resize-none"
              placeholder="Tell us about yourself..."
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className={cancelButtonClass}
                onClick={() => setAboutDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className={saveButtonClass}>
                Save & Change
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Experience Dialog (now matches About dialog layout/styles) */}
      <Dialog open={experienceDialogOpen} onOpenChange={setExperienceDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="w-full h-full p-0 flex items-center justify-between ">
            <DialogTitle className="text-[20px]">Experience</DialogTitle>
            <button
              onClick={() => setExperienceDialogOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Role
              </Label>
              <Input
                id="role"
                value={tempExperience.role}
                onChange={(e) => setTempExperience({ ...tempExperience, role: e.target.value })}
                placeholder="Enter your role"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                Company
              </Label>
              <Input
                id="company"
                value={tempExperience.company}
                onChange={(e) => setTempExperience({ ...tempExperience, company: e.target.value })}
                placeholder="Enter company name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                Duration
              </Label>
              <Input
                id="duration"
                value={tempExperience.duration}
                onChange={(e) => setTempExperience({ ...tempExperience, duration: e.target.value })}
                placeholder="2 years"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location
              </Label>
              <Input
                id="location"
                value={tempExperience.location}
                onChange={(e) => setTempExperience({ ...tempExperience, location: e.target.value })}
                placeholder="Enter location"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                value={tempExperience.description}
                onChange={(e) =>
                  setTempExperience({ ...tempExperience, description: e.target.value })
                }
                placeholder="Enter description"
                className="mt-1 min-h-[80px] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className={cancelButtonClass}
                onClick={() => setExperienceDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveExperience} className={saveButtonClass}>
                Save & Change
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Additional Details Dialog (same styling) */}
      <Dialog open={additionalDetailsDialogOpen} onOpenChange={setAdditionalDetailsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="w-full h-full p-0 flex items-center justify-between ">
            <DialogTitle className="text-[20px]">Additional details</DialogTitle>
            <button
              onClick={() => setAdditionalDetailsDialogOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={tempProfile.email}
                onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone
              </Label>
              <Input
                id="phone"
                value={tempProfile.phone}
                onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                placeholder="Enter your phone"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                Language
              </Label>
              <Input
                id="language"
                value={tempProfile.languages}
                onChange={(e) => setTempProfile({ ...tempProfile, languages: e.target.value })}
                placeholder="Enter language"
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className={cancelButtonClass}
                onClick={() => setAdditionalDetailsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveAdditionalDetails} className={saveButtonClass}>
                Save & Change
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Social Links Dialog (same styling) */}
      <Dialog open={socialLinksDialogOpen} onOpenChange={setSocialLinksDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="w-full h-full p-0 flex items-center justify-between ">
            <DialogTitle className="text-[20px]">Social links</DialogTitle>
            <button
              onClick={() => setSocialLinksDialogOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {tempSocialLinks.map((link, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    {link.platform || `Link ${index + 1}`}
                  </Label>
                  {tempSocialLinks.length > 1 && (
                    <button
                      onClick={() => removeSocialLink(index)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                </div>
                <Input
                  value={link.platform}
                  onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                  placeholder="Platform name"
                  className="mb-2"
                />
                <Input
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  placeholder="Enter your website name"
                />
              </div>
            ))}

            <button
              onClick={addSocialLink}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add another link
            </button>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                className={cancelButtonClass}
                onClick={() => setSocialLinksDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveSocialLinks} className={saveButtonClass}>
                Save & Change
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import Textarea from "../../../components/ui/textarea";
import { Plus, X, Mail, Phone, Globe, Edit2, MapPin } from "lucide-react";
import { HeaderProfile, ManagerEditIcon, Person } from "../../../assets/managers";
import { useFetch } from "../../../api";
import { useGenericMutation } from "../../../api/useGenericMutation";
import toast from "react-hot-toast";
import { formatDate } from "../../../utils/formatDate.utils";

interface SocialLink {
  platform: string;
  url: string;
}

interface EducationEntry {
  degree: string;
  fieldOfStudy?: string;
  institution: string;
  startYear?: string;
  endYear?: string;
  grade?: string;
  description?: string;
  currentlyStudying?: boolean;
}

interface ExperienceEntry {
  title: string;
  company: string;
  location?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  description?: string;
  responsibilities?: string[];
  skills?: string[];
}

interface Profile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  age?: number;
  avgRating?: number;
  certifications?: string[];
  country?: string;
  education?: EducationEntry[];
  experiences?: ExperienceEntry[];
  experience?: string;
  interests?: string[];
  latestResume?: string;
  mobile?: string;
  preferredLanguage?: string;
  profileImage?: string;
  resumes?: { fileUrl: string; uploadedAt: string }[];
  reviews?: { rating: number; comment: string; serviceType: string }[];
  skills?: string[];
  socialLinks?: SocialLink[];
}

export default function ManagerProfile(): JSX.Element {
  // Fetch profile data
  const { data, isLoading, error, refetch } = useFetch(["profile"], "/profile", true, { requiresAuth: true });
  const { mutate: updateProfileMutation, isLoading: isUpdating } = useGenericMutation < Profile > ();

  // Main state
  const [profile, setProfile] = useState < Profile | null > (null);
  const [socialLinks, setSocialLinks] = useState < SocialLink[] > ([]);
  const [experiences, setExperiences] = useState < ExperienceEntry[] > ([]);

  // Dialog states
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [experiencesDialogOpen, setExperiencesDialogOpen] = useState(false);
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);
  const [additionalDetailsDialogOpen, setAdditionalDetailsDialogOpen] = useState(false);
  const [socialLinksDialogOpen, setSocialLinksDialogOpen] = useState(false);
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);

  // Temporary states for editing
  const [tempProfile, setTempProfile] = useState < Profile | null > (null);
  const [tempSocialLinks, setTempSocialLinks] = useState < SocialLink[] > ([]);
  const [tempEducation, setTempEducation] = useState < EducationEntry[] > ([]);
  const [tempSkills, setTempSkills] = useState < string[] > ([]);
  const [tempExperiences, setTempExperiences] = useState < ExperienceEntry[] > ([]);

  // Initialize data
  useEffect(() => {
    if (data) {
      const apiProfile = (data as any).data ? (data as any).data : (data as Profile);
      setProfile(apiProfile);
      setSocialLinks(apiProfile?.socialLinks || []);
      setExperiences(apiProfile?.experience || []);
    }
  }, [data]);

  // Experience handlers
  const addExperience = () => {
    setTempExperiences(prev => [...prev, {
      title: "",
      company: "",
      employmentType: "",
      startDate: "",
      endDate: "",
      duration: "",
      location: "",
      description: "",
      responsibilities: [],
      skills: []
    }]);
  };

  const removeExperience = (idx: number) => {
    setTempExperiences(prev => prev.filter((_, i) => i !== idx));
  };

  const updateExperienceField = (idx: number, field: keyof ExperienceEntry, value: any) => {
    setTempExperiences(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const updateExperienceListField = (idx: number, field: "responsibilities" | "skills", list: string[]) => {
    setTempExperiences(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: list };
      return copy;
    });
  };

  const handleSaveExperiences = async () => {
    const payload = { data: { experience: tempExperiences } };
    updateProfileMutation({
      endpoint: "/profile",
      data: payload,
      method: "PUT",
      requiresAuth: true,
      successMessage: "Experiences updated successfully!",
      errorMessage: "Failed to update experiences",
      invalidateKeys: ["profile"],
      onSuccessCallback: (resp?: any) => {
        setExperiencesDialogOpen(false);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating experiences");
      }
    });
  };

  // Education handlers
  const addEducation = () => {
    setTempEducation(prev => [...prev, {
      degree: "",
      fieldOfStudy: "",
      institution: "",
      startYear: "",
      endYear: "",
      grade: "",
      description: "",
      currentlyStudying: false
    }]);
  };

  const removeEducation = (idx: number) => {
    setTempEducation(prev => prev.filter((_, i) => i !== idx));
  };

  const updateEducationField = (idx: number, field: keyof EducationEntry, value: any) => {
    setTempEducation(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSaveEducation = async () => {
    const payload = { data: { education: tempEducation } };
    updateProfileMutation({
      endpoint: "/profile",
      data: payload,
      method: "PUT",
      requiresAuth: true,
      successMessage: "Education updated successfully!",
      errorMessage: "Failed to update education",
      invalidateKeys: ["profile"],
      onSuccessCallback: (resp?: any) => {
        setEducationDialogOpen(false);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating education");
      }
    });
  };

  // Social Links handlers
  const addSocialLink = () => {
    setTempSocialLinks(prev => [...prev, { platform: "", url: "" }]);
  };

  const removeSocialLink = (idx: number) => {
    setTempSocialLinks(prev => prev.filter((_, i) => i !== idx));
  };

  const updateSocialLink = (idx: number, field: "platform" | "url", value: string) => {
    setTempSocialLinks(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleSaveSocialLinks = async () => {
    const payload = { data: { socialLinks: tempSocialLinks } };
    updateProfileMutation({
      endpoint: "/profile",
      data: payload,
      method: "PUT",
      requiresAuth: true,
      successMessage: "Social links updated successfully!",
      errorMessage: "Failed to update social links",
      invalidateKeys: ["profile"],
      onSuccessCallback: (resp?: any) => {
        setSocialLinksDialogOpen(false);
        setSocialLinks(tempSocialLinks);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating social links");
      }
    });
  };

  // Skills handlers
  const addSkill = () => {
    setTempSkills(prev => [...prev, ""]);
  };

  const removeSkill = (idx: number) => {
    setTempSkills(prev => prev.filter((_, i) => i !== idx));
  };

  const updateSkill = (idx: number, value: string) => {
    setTempSkills(prev => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  const handleSaveSkills = async () => {
    const payload = { data: { skills: tempSkills } };
    updateProfileMutation({
      endpoint: "/profile",
      data: payload,
      method: "PUT",
      requiresAuth: true,
      successMessage: "Skills updated successfully!",
      errorMessage: "Failed to update skills",
      invalidateKeys: ["profile"],
      onSuccessCallback: (resp?: any) => {
        setSkillsDialogOpen(false);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating skills");
      }
    });
  };

  // Additional Details handlers
  const handleSaveAdditionalDetails = async () => {
    if (!tempProfile) return;
    const payload = {
      data: {
        mobile: tempProfile.mobile,
        preferredLanguage: tempProfile.preferredLanguage
      }
    };
    updateProfileMutation({
      endpoint: "/profile",
      data: payload,
      method: "PUT",
      requiresAuth: true,
      successMessage: "Additional details updated successfully!",
      errorMessage: "Failed to update additional details",
      invalidateKeys: ["profile"],
      onSuccessCallback: (resp?: any) => {
        setAdditionalDetailsDialogOpen(false);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating additional details");
      }
    });
  };

  // About handlers
  const handleSaveProfile = async () => {
    if (!tempProfile) return;
    const payload = {
      data: {
        experience: tempProfile.experience || "",
        about: tempProfile.about || ""
      }
    };
    updateProfileMutation({
      endpoint: "/profile",
      data: payload,
      method: "PUT",
      requiresAuth: true,
      successMessage: "Profile updated successfully!",
      errorMessage: "Failed to update profile",
      invalidateKeys: ["profile"],
      onSuccessCallback: (resp?: any) => {
        setAboutDialogOpen(false);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating profile");
      }
    });
  };

  // Edit Profile handlers
  const openEditProfile = () => {
    setTempProfile(profile);
    setTempSkills(profile?.skills ? [...profile.skills] : []);
    setEditProfileDialogOpen(true);
  };

  const handleSaveEditProfile = async () => {
    if (!tempProfile) return;
    const payload = {
      data: {
        profileImage: tempProfile.profileImage || "",
        country: tempProfile.country || "",
        skills: tempSkills
      }
    };
    updateProfileMutation({
      endpoint: "/profile",
      data: payload,
      method: "PUT",
      requiresAuth: true,
      successMessage: "Profile basic info updated!",
      errorMessage: "Failed to update profile basic info",
      invalidateKeys: ["profile"],
      onSuccessCallback: (resp?: any) => {
        setEditProfileDialogOpen(false);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating profile basic info");
      }
    });
  };

  // Style classes
  const cancelButtonClass = "m-0 w-[164px] h-[50px] -none text-[16px] font-semibold bg-[#fff] hover:bg-gray-50";
  const saveButtonClass = "m-0 w-[164px] h-[50px] -none text-[16px] font-semibold bg-[#019ACB] hover:bg-[#017a9e] text-white";

  // Loading and error states
  if (isLoading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading profile.</div>;
  if (!profile) return <div className="p-6">No profile data available.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white shadow-sm mb-6 xs:h-[400px]">
          <img src={HeaderProfile} className="w-full" />
          <div className="px-4 sm:px-6 lg:px-8 pb-6">
            <div className="flex flex-col md:flex-row gap-6 -mt-16 items-center md:items-start">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                  <img
                    src={profile.profileImage || Person}
                    alt={profile.userId?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 mt-4 md:mt-16 pt-0 md:pt-2 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-gray-900 leading-tight">
                      {profile.userId?.name || "No name provided"}
                    </h1>
                    <p className="text-lg sm:text-xl font-epilogue text-gray-600 mt-1 sm:mt-2 truncate max-w-xs md:max-w-full">
                      {experiences.length > 0
                        ? `${experiences[0].title} at ${experiences[0].company}`
                        : "Member"}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1 sm:mt-2 justify-center md:justify-start">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.country || "Unknown location"}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className={`${cancelButtonClass} text-primary w-full md:w-auto mt-4 md:mt-0`}
                    onClick={openEditProfile}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">About Me</h2>
                <button
                  onClick={() => {
                    setTempProfile(profile);
                    setAboutDialogOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 -full"
                >
                  <img src={ManagerEditIcon} />

                </button>
              </div>
              <p className="text-gray-700 text-[16px] font-inter leading-relaxed whitespace-pre-line">
                {profile.about || "No about/experience added yet. Click edit to add a short bio or experience summary."}
              </p>
            </div>

            {/* Experiences */}
            <div className="bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">Experiences</h2>
                <button
                  className="p-2 hover:bg-gray-100 -full"
                  onClick={() => {
                    setTempExperiences([...experiences]);
                    setExperiencesDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="space-y-4">
                {experiences.length > 0 ? (
                  experiences.map((xp, idx) => (
                    <div key={idx} className="pt-3 pb-4 border-b last:border-b-0">
                      <div className="flex gap-3">
                        <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center bg-gray-100 flex-shrink-0 overflow-hidden">
                          <div className="text-xs font-semibold text-gray-600">
                            {xp.company?.slice(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col items-start justify-between">
                            <div>
                              <h3 className="text-[18px] font-inter font-bold text-gray-900">{xp.title}</h3>
                              <div className="mt-0.5">
                                <span className="text-[16px] font-inter ">{xp.company}</span>
                                {xp.employmentType && <span className="mx-1">•</span>}
                                {xp.employmentType && <span>{xp.employmentType}</span>}
                                {(xp.employmentType || xp.startDate) && <span className="mx-1">•</span>}
                                {xp.startDate && <span>{formatDate(xp.startDate)} - {formatDate(xp.endDate) ?? ""}</span>}
                                {xp.duration && <span className="mx-1">•</span>}
                                {xp.duration && <span>{xp.duration}</span>}</div>
                            </div>
                            <div className="text-[16px] text-[#8E8E93] whitespace-nowrap hidden md:block">
                              {xp.location}
                            </div>
                          </div>
                          {xp.description && (
                            <p className="text-[16px] font-inter text-[rgba(20, 20, 20, 0.8)] mt-3 leading-relaxed">{xp.description}</p>
                          )}
                          {/* {xp.responsibilities && xp.responsibilities.length > 0 && (
                            <ul className="list-disc ml-4 text-[14px] text-gray-600 mt-2">
                              {xp.responsibilities.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          )} */}
                          {/* {xp.skills && xp.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {xp.skills.map((skill, i) => (
                                <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No experiences added yet.</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">Education</h2>
                <button
                  onClick={() => {
                    setTempEducation([...(profile.education || [])]);
                    setEducationDialogOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 -full"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="space-y-4">
                {profile.education && profile.education.length > 0 ? (
                  profile.education.map((edu, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-[80px] h-[80px] bg-gray-100 flex items-center justify-center flex-shrink-0 rounded">
                        <span className="text-xs font-semibold text-gray-600">EDU</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 xs:flex-col">
                          <div >
                            <h3 className="text-[18px] font-inter font-bold text-gray-900">{edu.institution}</h3>
                            <div className="text-[16px] text-[#595959] mt-0.5">
                              {edu.degree}
                              {edu.fieldOfStudy && ` (${edu.fieldOfStudy})`} | {edu.startYear ?? ""}
                              {edu.endYear && ` - ${edu.endYear}`}
                              {/* <div className="border-l pl-2 text-sm text-gray-500 whitespace-nowrap mt-4">
                                {edu.startYear ?? ""}
                                {edu.endYear && ` - ${edu.endYear}`}
                              </div> */}
                            </div>
                            <div className="text-xs text-gray-500">
                              {edu.grade && `Grade: ${edu.grade}`}
                            </div>
                          </div>
                        </div>
                        {edu.description && (
                          <p className="text-[16px] text-[rgba(20, 20, 20, 0.8)] mt-3 leading-relaxed">{edu.description}</p>
                        )}
                        {edu.currentlyStudying && (
                          <span className="text-xs text-green-600">Currently studying</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No education added yet.</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white p-6 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[20px] font-bold text-[#141414]">Skills</h2>
                <button
                  onClick={() => {
                    setTempSkills([...(profile.skills ?? [])]);
                    setSkillsDialogOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100"
                >
                  <img src={ManagerEditIcon} />
                </button>
              </div>
              {profile.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="font-medium text-[14px] bg-[#019ACB14] text-[#019ACB] px-3 py-2"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-gray-500 italic">No skills added yet.</p>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Additional details */}
            <div className="bg-white -lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">Additional Details</h2>
                <button
                  onClick={() => {
                    setTempProfile(profile);
                    setAdditionalDetailsDialogOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 -full"
                >
                  <img src={ManagerEditIcon} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-900 break-all">
                      {profile.userId?.email || "No email provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm text-gray-900">{profile.mobile || "No phone number provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Languages</p>
                    <p className="text-sm text-gray-900">{profile.preferredLanguage || "No language specified"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white -lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">Social Links</h2>
                <button
                  onClick={() => {
                    setTempSocialLinks([...socialLinks]);
                    setSocialLinksDialogOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 -full"
                >
                  <img src={ManagerEditIcon} />

                </button>
              </div>
              <div className="space-y-4">
                {socialLinks && socialLinks.length > 0 ? (
                  socialLinks.map((link, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0">
                        {link.platform === "Instagram" && "📷"}
                        {link.platform === "Twitter" && "🐦"}
                        {link.platform === "Website" && "🌐"}
                        {!["Instagram", "Twitter", "Website"].includes(link.platform) && "🔗"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">{link.platform}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline break-all"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No social links added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DIALOGS */}

        {/* About Dialog */}
        <Dialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">About</DialogTitle>
              <button
                onClick={() => setAboutDialogOpen(false)}
                className="p-1 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <div className="border-t my-4" />
            <div className="space-y-4">
              <Textarea
                value={tempProfile?.about || ""}
                onChange={e => setTempProfile(prev => prev ? { ...prev, about: e.target.value } : null)}
                className="min-h-[200px] resize-none"
                placeholder="Tell us about yourself..."
              />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className={cancelButtonClass}
                  onClick={() => setAboutDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  className={saveButtonClass}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save & Change"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Additional Details Dialog */}
        <Dialog open={additionalDetailsDialogOpen} onOpenChange={setAdditionalDetailsDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Additional details</DialogTitle>
              <button
                onClick={() => setAdditionalDetailsDialogOpen(false)}
                className="p-1 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <div className="border-t my-4" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={tempProfile?.userId?.email || ""}
                  onChange={e => setTempProfile(prev => prev ? {
                    ...prev,
                    userId: { ...prev.userId, email: e.target.value }
                  } : null)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                <Input
                  id="phone"
                  value={tempProfile?.mobile || ""}
                  onChange={e => setTempProfile(prev => prev ? { ...prev, mobile: e.target.value } : null)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium">Language</Label>
                <Input
                  id="language"
                  value={tempProfile?.preferredLanguage || ""}
                  onChange={e => setTempProfile(prev => prev ? { ...prev, preferredLanguage: e.target.value } : null)}
                  className="h-11"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  className={cancelButtonClass}
                  onClick={() => setAdditionalDetailsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveAdditionalDetails}
                  className={saveButtonClass}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save & Change"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Social Links Dialog */}
        <Dialog open={socialLinksDialogOpen} onOpenChange={setSocialLinksDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Social links</DialogTitle>
              <button
                onClick={() => setSocialLinksDialogOpen(false)}
                className="p-1 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <div className="border-t my-4" />
            <div className="space-y-4">
              {tempSocialLinks.length > 0 ? (
                tempSocialLinks.map((link, idx) => (
                  <div key={idx} className="space-y-3 p-4 border -lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">{link.platform || `Link ${idx + 1}`}</Label>
                      <button
                        onClick={() => removeSocialLink(idx)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <Input
                      value={link.platform}
                      onChange={e => updateSocialLink(idx, "platform", e.target.value)}
                      placeholder="Platform name (e.g., Instagram, Twitter)"
                      className="h-11"
                    />
                    <Input
                      value={link.url}
                      onChange={e => updateSocialLink(idx, "url", e.target.value)}
                      placeholder="Enter your link (https://...)"
                      className="h-11"
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No social links yet. Click below to add one.</p>
              )}
              <button
                onClick={addSocialLink}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add another link
              </button>
              <div className="flex justify-end gap-3 pt-2 border-t">
                <Button
                  variant="outline"
                  className={cancelButtonClass}
                  onClick={() => setSocialLinksDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSocialLinks}
                  className={saveButtonClass}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save & Change"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Skills Dialog */}
        <Dialog open={skillsDialogOpen} onOpenChange={setSkillsDialogOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Skills</DialogTitle>
              <button
                onClick={() => setSkillsDialogOpen(false)}
                className="p-1 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <div className="border-t my-4" />
            <div className="space-y-4">
              {tempSkills.length > 0 ? (
                tempSkills.map((skill, idx) => (
                  <div key={idx} className="space-y-3 p-4 border -lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Skill {idx + 1}</Label>
                      <button
                        onClick={() => removeSkill(idx)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <Input
                      value={skill}
                      onChange={e => updateSkill(idx, e.target.value)}
                      className="h-11"
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No skills added yet. Click below to add one.</p>
              )}
              <button
                onClick={addSkill}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add another skill
              </button>
              <div className="flex justify-end gap-3 pt-2 border-t">
                <Button
                  variant="outline"
                  className={cancelButtonClass}
                  onClick={() => setSkillsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSkills}
                  className={saveButtonClass}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save & Change"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Dialog */}
        <Dialog open={editProfileDialogOpen} onOpenChange={setEditProfileDialogOpen}>
          <DialogContent className="max-w-xl overflow-scroll">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
              <button
                onClick={() => setEditProfileDialogOpen(false)}
                className="p-1 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <div className="border-t my-4" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Profile image URL</Label>
                <Input
                  value={tempProfile?.profileImage || ""}
                  onChange={e => setTempProfile(prev => prev ? { ...prev, profileImage: e.target.value } : null)}
                  placeholder="https://..."
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Full name</Label>
                <Input
                  value={tempProfile?.userId?.name || ""}
                  onChange={e => setTempProfile(prev => prev ? {
                    ...prev,
                    userId: { ...prev.userId, name: e.target.value }
                  } : null)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Location (country)</Label>
                <Input
                  value={tempProfile?.country || ""}
                  onChange={e => setTempProfile(prev => prev ? { ...prev, country: e.target.value } : null)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Skills</Label>
                {tempSkills.length > 0 ? (
                  tempSkills.map((s, idx) => (
                    <div key={idx} className="flex gap-2 items-center mb-2">
                      <Input
                        value={s}
                        onChange={e => updateSkill(idx, e.target.value)}
                        className="h-11 flex-1"
                      />
                      <button
                        onClick={() => removeSkill(idx)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No skills yet.</p>
                )}
                <div>
                  <button
                    onClick={addSkill}
                    className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add skill
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t">
                <Button
                  variant="outline"
                  className={cancelButtonClass}
                  onClick={() => setEditProfileDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEditProfile}
                  className={saveButtonClass}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save & Change"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Experience Dialog */}
        <Dialog open={experiencesDialogOpen} onOpenChange={setExperiencesDialogOpen}>
          <DialogContent className="max-w-2xl h-[700px] overflow-scroll">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Experiences</DialogTitle>
              <button
                onClick={() => setExperiencesDialogOpen(false)}
                className="p-1 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <div className="border-t my-4" />
            <div className="space-y-4">
              {tempExperiences.length > 0 ? (
                tempExperiences.map((xp, idx) => (
                  <div key={idx} className="space-y-3 p-4 border -lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Experience {idx + 1}</Label>
                      <button
                        onClick={() => removeExperience(idx)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <Input
                      value={xp.title}
                      onChange={e => updateExperienceField(idx, "title", e.target.value)}
                      placeholder="Title"
                      className="h-11"
                    />
                    <Input
                      value={xp.company}
                      onChange={e => updateExperienceField(idx, "company", e.target.value)}
                      placeholder="Company"
                      className="h-11"
                    />
                    <Input
                      value={xp.location || ""}
                      onChange={e => updateExperienceField(idx, "location", e.target.value)}
                      placeholder="Location"
                      className="h-11"
                    />
                    <Input
                      value={xp.employmentType || ""}
                      onChange={e => updateExperienceField(idx, "employmentType", e.target.value)}
                      placeholder="Employment Type (e.g., Full-Time)"
                      className="h-11"
                    />
                    <Input
                      value={xp.startDate || ""}
                      onChange={e => updateExperienceField(idx, "startDate", e.target.value)}
                      placeholder="Start Date (e.g., Jun 2019)"
                      className="h-11"
                    />
                    <Input
                      value={xp.endDate || ""}
                      onChange={e => updateExperienceField(idx, "endDate", e.target.value)}
                      placeholder="End Date (e.g., Present)"
                      className="h-11"
                    />
                    <Input
                      value={xp.duration || ""}
                      onChange={e => updateExperienceField(idx, "duration", e.target.value)}
                      placeholder="Duration (e.g., 2y 3m)"
                      className="h-11"
                    />
                    <Textarea
                      value={xp.description || ""}
                      onChange={e => updateExperienceField(idx, "description", e.target.value)}
                      className="min-h-[60px]"
                      placeholder="Description/summary"
                    />

                    {/* Responsibilities */}
                    <Label className="text-sm font-medium">Responsibilities</Label>
                    {(xp.responsibilities ?? []).map((resp, rIdx) => (
                      <div key={rIdx} className="flex gap-2 mb-1">
                        <Input
                          value={resp}
                          onChange={e => {
                            const newList = [...(xp.responsibilities ?? [])];
                            newList[rIdx] = e.target.value;
                            updateExperienceListField(idx, "responsibilities", newList);
                          }}
                          className="h-11 flex-1"
                          placeholder={`Responsibility ${rIdx + 1}`}
                        />
                        <button
                          onClick={() => {
                            const newList = (xp.responsibilities ?? []).filter((_, i) => i !== rIdx);
                            updateExperienceListField(idx, "responsibilities", newList);
                          }}
                          className="p-2 hover:bg-gray-100"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => updateExperienceListField(idx, "responsibilities", [...(xp.responsibilities ?? []), ""])}
                      className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-2 my-1"
                    >
                      <Plus className="w-4 h-4" /> Add responsibility
                    </button>

                    {/* Skills */}
                    <Label className="text-sm font-medium">Skills Used</Label>
                    {(xp.skills ?? []).map((skill, sIdx) => (
                      <div key={sIdx} className="flex gap-2 mb-1">
                        <Input
                          value={skill}
                          onChange={e => {
                            const newList = [...(xp.skills ?? [])];
                            newList[sIdx] = e.target.value;
                            updateExperienceListField(idx, "skills", newList);
                          }}
                          className="h-11 flex-1"
                          placeholder={`Skill ${sIdx + 1}`}
                        />
                        <button
                          onClick={() => {
                            const newList = (xp.skills ?? []).filter((_, i) => i !== sIdx);
                            updateExperienceListField(idx, "skills", newList);
                          }}
                          className="p-2 hover:bg-gray-100"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => updateExperienceListField(idx, "skills", [...(xp.skills ?? []), ""])}
                      className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-2 my-1"
                    >
                      <Plus className="w-4 h-4" /> Add skill
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No experiences yet. Click below to add one.</p>
              )}
              <button
                onClick={addExperience}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add another experience
              </button>
              <div className="flex justify-end gap-3 pt-2 border-t">
                <Button
                  variant="outline"
                  className={cancelButtonClass}
                  onClick={() => setExperiencesDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveExperiences}
                  className={saveButtonClass}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save & Change"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Education Dialog */}
        <Dialog open={educationDialogOpen} onOpenChange={setEducationDialogOpen}>
          <DialogContent className="max-w-xl h-[700px] overflow-scroll">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Education</DialogTitle>
              <button
                onClick={() => setEducationDialogOpen(false)}
                className="p-1 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
            <div className="border-t my-4" />
            <div className="space-y-4">
              {tempEducation.length > 0 ? (
                tempEducation.map((edu, idx) => (
                  <div key={idx} className="space-y-3 p-4 border -lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Education {idx + 1}</Label>
                      <button
                        onClick={() => removeEducation(idx)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <Input
                      value={edu.degree}
                      onChange={e => updateEducationField(idx, "degree", e.target.value)}
                      placeholder="Degree"
                      className="h-11"
                    />
                    <Input
                      value={edu.fieldOfStudy || ""}
                      onChange={e => updateEducationField(idx, "fieldOfStudy", e.target.value)}
                      placeholder="Field of Study"
                      className="h-11"
                    />
                    <Input
                      value={edu.institution}
                      onChange={e => updateEducationField(idx, "institution", e.target.value)}
                      placeholder="Institution"
                      className="h-11"
                    />
                    <Input
                      value={edu.startYear || ""}
                      onChange={e => updateEducationField(idx, "startYear", e.target.value)}
                      placeholder="Start Year"
                      className="h-11"
                    />
                    <Input
                      value={edu.endYear || ""}
                      onChange={e => updateEducationField(idx, "endYear", e.target.value)}
                      placeholder="End Year"
                      className="h-11"
                    />
                    <Input
                      value={edu.grade || ""}
                      onChange={e => updateEducationField(idx, "grade", e.target.value)}
                      placeholder="Grade (GPA/Percentage)"
                      className="h-11"
                    />
                    <Textarea
                      value={edu.description || ""}
                      onChange={e => updateEducationField(idx, "description", e.target.value)}
                      className="min-h-[60px]"
                      placeholder="Description"
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={!!edu.currentlyStudying}
                        onChange={e => updateEducationField(idx, "currentlyStudying", e.target.checked)}
                        id={`currentlyStudying${idx}`}
                        className="h-5 w-5 border-gray-300"
                      />
                      <Label htmlFor={`currentlyStudying${idx}`} className="text-sm font-medium">
                        Currently Studying?
                      </Label>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">No education entries yet. Click below to add one.</p>
              )}
              <button
                onClick={addEducation}
                className="flex items-center gap-2 text-primary hover:text-blue-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add another education
              </button>
              <div className="flex justify-end gap-3 pt-2 border-t">
                <Button
                  variant="outline"
                  className={cancelButtonClass}
                  onClick={() => setEducationDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEducation}
                  className={saveButtonClass}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save & Change"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

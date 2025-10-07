import React, { useEffect, useState } from "react";
import { useFetch } from "../../../api";
import { useGenericMutation } from "../../../api/useGenericMutation";
import toast from "react-hot-toast";
import { ProfileHeader } from "./ProfileHeader";
import { ExperienceList } from "./ExperiencesList";
import { EducationList } from "./EducationList";
import { SocialLinksBlock } from "./SocialLinksBlock";
import { ProfileDialogs } from "./ProfileDialogs";
import { AboutSection } from "./AboutSection";
import { SkillsSection } from "./SkillsSection";
import { AdditionalDetailsSection } from "./AdditionalDetailsSection";

// Import your existing interfaces here...

export default function ManagerProfile(): JSX.Element {
  // Fetch profile data
  const { data, isLoading, error, refetch } = useFetch(["profile"], "/profile", true, { requiresAuth: true });
  const { mutate: updateProfileMutation, isLoading: isUpdating } = useGenericMutation();

  // Main state
  const [profile, setProfile] = useState < any > (null);
  const [socialLinks, setSocialLinks] = useState < any[] > ([]);
  const [experiences, setExperiences] = useState < any[] > ([]);

  // Dialog states (kept old ones for backwards compatibility where you used them)
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [experiencesDialogOpen, setExperiencesDialogOpen] = useState(false);
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);
  const [additionalDetailsDialogOpen, setAdditionalDetailsDialogOpen] = useState(false);
  const [socialLinksDialogOpen, setSocialLinksDialogOpen] = useState(false);
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);

  // New: per-item dialog states for Experience/Education
  const [experienceItemDialogOpen, setExperienceItemDialogOpen] = useState(false);
  const [experienceItemIndex, setExperienceItemIndex] = useState < number | null > (null);
  const [educationItemDialogOpen, setEducationItemDialogOpen] = useState(false);
  const [educationItemIndex, setEducationItemIndex] = useState < number | null > (null);

  // Temporary states for editing
  const [tempProfile, setTempProfile] = useState < any > (null);
  const [tempSocialLinks, setTempSocialLinks] = useState < any[] > ([]);
  const [tempEducation, setTempEducation] = useState < any[] > ([]);
  const [tempSkills, setTempSkills] = useState < string[] > ([]);
  const [tempExperiences, setTempExperiences] = useState < any[] > ([]);

  // Initialize data when API response arrives
  useEffect(() => {
    if (data) {
      const apiProfile = (data as any).data ? (data as any).data : (data as any);
      setProfile(apiProfile);
      setSocialLinks(apiProfile?.socialLinks || []);
      setExperiences(apiProfile?.experience || []);
      // initialize temporary states so dialogs open with data if user clicks edit
      setTempSkills(apiProfile?.skills ? [...apiProfile.skills] : []);
      setTempEducation(apiProfile?.education ? [...apiProfile.education] : []);
      setTempExperiences(apiProfile?.experience ? [...apiProfile.experience] : []);
      setTempProfile(apiProfile);
    }
  }, [data]);

  // Dialog handler (keeps previous behavior)
  const handleDialogChange = (dialog: string, open: boolean) => {
    switch (dialog) {
      case "about":
        setAboutDialogOpen(open);
        break;
      case "education":
        setEducationDialogOpen(open);
        break;
      case "experiences":
        setExperiencesDialogOpen(open);
        break;
      case "skills":
        setSkillsDialogOpen(open);
        break;
      case "additionalDetails":
        setAdditionalDetailsDialogOpen(open);
        break;
      case "socialLinks":
        setSocialLinksDialogOpen(open);
        break;
      case "editProfile":
        setEditProfileDialogOpen(open);
        break;
    }
  };

  // Update temp profile
  const handleUpdateTempProfile = (updates: any) => {
    setTempProfile(prev => prev ? { ...prev, ...updates } : { ...updates });
  };

  // -----------------------
  // EXPERIENCE handlers
  // -----------------------
  const addExperience = (openAfterAdd = false) => {
    const blank = {
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
    };
    // Use functional update to avoid stale state and set index correctly
    setTempExperiences(prev => {
      const newArr = [...prev, blank];
      if (openAfterAdd) {
        setExperienceItemIndex(newArr.length - 1);
        setExperienceItemDialogOpen(true);
      }
      return newArr;
    });
  };

  const removeExperience = (idx: number) => {
    setTempExperiences(prev => prev.filter((_, i) => i !== idx));
  };

  const updateExperienceField = (idx: number, field: string, value: any) => {
    setTempExperiences(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const updateExperienceListField = (idx: number, field: string, list: string[]) => {
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
      onSuccessCallback: () => {
        // Close both the general experiences dialog and item dialog if opened
        setExperiencesDialogOpen(false);
        setExperienceItemDialogOpen(false);
        setExperienceItemIndex(null);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating experiences");
      }
    });
  };

  // per-item dialog open/save helpers for experiences
  const onOpenExperienceItem = (open: boolean, idx?: number | null) => {
    if (!open) {
      setExperienceItemDialogOpen(false);
      setExperienceItemIndex(null);
      return;
    }
    // open: either edit specific index or add new
    if (typeof idx === "number") {
      // prepare temp state from current experiences and open that index
      setTempExperiences(prev => (experiences && experiences.length ? [...experiences] : [...prev]));
      setExperienceItemIndex(idx);
      setExperienceItemDialogOpen(true);
    } else {
      // add a new blank and open it
      addExperience(true);
    }
  };

  const onSaveExperienceItem = (idx: number | null) => {
    // We persist whole experiences array (backend expects full array)
    // Use the same save handler
    handleSaveExperiences();
  };

  // -----------------------
  // EDUCATION handlers
  // -----------------------
  const addEducation = (openAfterAdd = false) => {
    const blank = {
      degree: "",
      fieldOfStudy: "",
      institution: "",
      startYear: "",
      endYear: "",
      grade: "",
      description: "",
      currentlyStudying: false
    };
    setTempEducation(prev => {
      const newArr = [...prev, blank];
      if (openAfterAdd) {
        setEducationItemIndex(newArr.length - 1);
        setEducationItemDialogOpen(true);
      }
      return newArr;
    });
  };

  const removeEducation = (idx: number) => {
    setTempEducation(prev => prev.filter((_, i) => i !== idx));
  };

  const updateEducationField = (idx: number, field: string, value: any) => {
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
      onSuccessCallback: () => {
        // close both general education dialog and item dialog
        setEducationDialogOpen(false);
        setEducationItemDialogOpen(false);
        setEducationItemIndex(null);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating education");
      }
    });
  };

  // per-item dialog open/save helpers for education
  const onOpenEducationItem = (open: boolean, idx?: number | null) => {
    if (!open) {
      setEducationItemDialogOpen(false);
      setEducationItemIndex(null);
      return;
    }
    if (typeof idx === "number") {
      setTempEducation(prev => (profile?.education && profile.education.length ? [...profile.education] : [...prev]));
      setEducationItemIndex(idx);
      setEducationItemDialogOpen(true);
    } else {
      addEducation(true);
    }
  };

  const onSaveEducationItem = (idx: number | null) => {
    handleSaveEducation();
  };

  // -----------------------
  // SOCIAL LINKS handlers
  // -----------------------
  const addSocialLink = () => {
    setTempSocialLinks(prev => [...prev, { platform: "", url: "" }]);
  };

  const removeSocialLink = (idx: number) => {
    setTempSocialLinks(prev => prev.filter((_, i) => i !== idx));
  };

  const updateSocialLink = (idx: number, field: string, value: string) => {
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
      onSuccessCallback: () => {
        setSocialLinksDialogOpen(false);
        setSocialLinks(tempSocialLinks);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating social links");
      }
    });
  };

  // -----------------------
  // SKILLS handlers
  // -----------------------
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
      onSuccessCallback: () => {
        setSkillsDialogOpen(false);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating skills");
      }
    });
  };

  // -----------------------
  // ADDITIONAL DETAILS handlers
  // -----------------------
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
      onSuccessCallback: () => {
        setAdditionalDetailsDialogOpen(false);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating additional details");
      }
    });
  };

  // -----------------------
  // ABOUT handlers
  // -----------------------
  const handleSaveProfile = async () => {
    if (!tempProfile) return;
    const payload = {
      data: {
        experience: tempProfile.experience || tempExperiences || [],
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
      onSuccessCallback: () => {
        setAboutDialogOpen(false);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating profile");
      }
    });
  };

  // -----------------------
  // EDIT PROFILE handlers
  // -----------------------
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
      onSuccessCallback: () => {
        setEditProfileDialogOpen(false);
        refetch();
      },
      onErrorCallback: () => {
        toast.error("Error updating profile basic info");
      }
    });
  };

  // Loading and error states
  if (isLoading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading profile.</div>;
  if (!profile) return <div className="p-6">No profile data available.</div>;

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-6">
        <ProfileHeader
          profile={profile}
          experiences={experiences}
          onEditProfile={openEditProfile}
        />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <AboutSection
              profile={profile}
              onEdit={() => {
                setTempProfile(profile);
                setAboutDialogOpen(true);
              }}
            />

            <ExperienceList
              experiences={experiences}
              // old style: open the whole experiences dialog
              onEditAll={() => {
                setTempExperiences([...experiences]);
                setExperiencesDialogOpen(true);
              }}
              // new: add or edit single item (list component should call these when user clicks add/edit)
              onAddItem={() => {
                // this will add and open the new item
                addExperience(true);
              }}
              onEditItem={(idx: number) => {
                // ensure tempExperiences is current and open index
                setTempExperiences([...experiences]);
                onOpenExperienceItem(true, idx);
              }}
            />

            <EducationList
              education={profile.education || []}
              onEditAll={() => {
                setTempEducation([...(profile.education || [])]);
                setEducationDialogOpen(true);
              }}
              onAddItem={() => {
                addEducation(true);
              }}
              onEditItem={(idx: number) => {
                setTempEducation([...(profile.education || [])]);
                onOpenEducationItem(true, idx);
              }}
            />

            <SkillsSection
              skills={profile.skills || []}
              onEdit={() => {
                setTempSkills([...(profile.skills ?? [])]);
                setSkillsDialogOpen(true);
              }}
            />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <AdditionalDetailsSection
              profile={profile}
              onEdit={() => {
                setTempProfile(profile);
                setAdditionalDetailsDialogOpen(true);
              }}
            />

            <SocialLinksBlock
              socialLinks={socialLinks}
              onEdit={() => {
                setTempSocialLinks([...socialLinks]);
                setSocialLinksDialogOpen(true);
              }}
            />
          </div>
        </div>

        <ProfileDialogs
          // Dialog states (kept for compatibility)
          aboutDialogOpen={aboutDialogOpen}
          educationDialogOpen={educationDialogOpen}
          experiencesDialogOpen={experiencesDialogOpen}
          skillsDialogOpen={skillsDialogOpen}
          additionalDetailsDialogOpen={additionalDetailsDialogOpen}
          socialLinksDialogOpen={socialLinksDialogOpen}
          editProfileDialogOpen={editProfileDialogOpen}

          // NEW: per-item dialog states for ProfileDialogs
          experienceItemDialogOpen={experienceItemDialogOpen}
          experienceItemIndex={experienceItemIndex}
          educationItemDialogOpen={educationItemDialogOpen}
          educationItemIndex={educationItemIndex}

          // Temporary states
          tempProfile={tempProfile}
          tempSocialLinks={tempSocialLinks}
          tempEducation={tempEducation}
          tempSkills={tempSkills}
          tempExperiences={tempExperiences}

          // Handlers
          onDialogChange={handleDialogChange}
          onUpdateTempProfile={handleUpdateTempProfile}
          onAddSocialLink={addSocialLink}
          onRemoveSocialLink={removeSocialLink}
          onUpdateSocialLink={updateSocialLink}
          onSaveSocialLinks={handleSaveSocialLinks}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
          onUpdateSkill={updateSkill}
          onSaveSkills={handleSaveSkills}
          onSaveAdditionalDetails={handleSaveAdditionalDetails}
          onSaveProfile={handleSaveProfile}
          onSaveEditProfile={handleSaveEditProfile}
          onAddExperience={() => addExperience(false)} // exposed add without opening
          onRemoveExperience={removeExperience}
          onUpdateExperienceField={updateExperienceField}
          onUpdateExperienceListField={updateExperienceListField}
          onSaveExperiences={handleSaveExperiences}
          // NEW per-item experience handlers used by ProfileDialogs:
          onOpenExperienceItem={onOpenExperienceItem}
          onSaveExperienceItem={onSaveExperienceItem}

          onAddEducation={() => addEducation(false)}
          onRemoveEducation={removeEducation}
          onUpdateEducationField={updateEducationField}
          onSaveEducation={handleSaveEducation}
          // NEW per-item education handlers used by ProfileDialogs:
          onOpenEducationItem={onOpenEducationItem}
          onSaveEducationItem={onSaveEducationItem}

          onSaveEducation={handleSaveEducation}

          // Loading state
          isUpdating={isUpdating}
        />
      </div>
    </div>
  );
}

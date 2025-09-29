import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import Textarea from "../../../components/ui/textarea";
import { Plus, X, Mail, Phone, Globe, Edit2, MapPin } from "lucide-react";
import { FlagIcon, Person, ProfileEdit } from "../../../assets/managers";
import { useFetch } from "../../../api";
import { useGenericMutation } from "../../../api/useGenericMutation";
import toast from "react-hot-toast";

interface SocialLink {
  platform: string;
  url: string;
}

interface EducationEntry {
  degree: string;
  institution: string;
  year: string; // keep string for temp editing; convert to number before sending
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
  education?: { degree: string; institution: string; year: string }[];
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
  // fetch profile list/key (your useFetch from project)
  const { data, isLoading, error, refetch } = useFetch(["profile"], `/profile`, true, {
    requiresAuth: true,
  });

  // generic mutation (your project's hook) - matches usage in your ref
  const { mutate: updateProfileMutation, isLoading: isUpdating } =
    useGenericMutation < Profile > ();

  const [profile, setProfile] = useState < Profile | null > (null);
  const [socialLinks, setSocialLinks] = useState < SocialLink[] > ([]);

  // dialogs
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [additionalDetailsDialogOpen, setAdditionalDetailsDialogOpen] = useState(false);
  const [socialLinksDialogOpen, setSocialLinksDialogOpen] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);

  // temp states for editing
  const [tempProfile, setTempProfile] = useState < Profile | null > (null);
  const [tempSocialLinks, setTempSocialLinks] = useState < SocialLink[] > ([]);
  const [tempEducation, setTempEducation] = useState < EducationEntry[] > ([]);
  const [tempSkills, setTempSkills] = useState < string[] > ([]);

  useEffect(() => {
    if (data) {
      // your API returns top-level object in data — adapt if needed
      const apiProfile = (data as any).data ? (data as any).data : (data as Profile);
      setProfile(apiProfile);
      setSocialLinks(apiProfile?.socialLinks || []);
    }
  }, [data]);

  /* ---------- Handlers: update API using your useGenericMutation pattern ---------- */

  const handleSaveProfile = async () => {
    if (!tempProfile || !profile) return;

    const payload = {
      data: {
        experience: tempProfile.experience || "",
        socialLinks: socialLinks,
      },
    };

    updateProfileMutation({
      endpoint: `/profile/${profile._id}`,
      data: payload,
      method: "PUT",
      requiresAuth: true,
      successMessage: "Profile updated successfully!",
      errorMessage: "Failed to update profile",
      invalidateKeys: ["profile"],
      onSuccessCallback: (resp?: any) => {
        // resp may contain updated object — defensively update local state
        if (resp && resp.data) {
          setProfile(resp.data);
        } else {
          setProfile(tempProfile);
        }
        toast.success("About/Experience updated!");
        setAboutDialogOpen(false);
        refetch();
      },
      onErrorCallback: (err) => {
        toast.error("Error updating profile");
        console.error("Error updating profile:", err);
      },
    });
  };

  const handleSaveAdditionalDetails = async () => {
    if (!tempProfile || !profile) return;

    const payload = {
      data: {
        mobile: tempProfile.mobile,
        preferredLanguage: tempProfile.preferredLanguage,
        userId: {
          email: tempProfile.userId?.email,
        },
      },
    };

    updateProfileMutation({
      endpoint: `/profile/${profile._id}`,
      data: payload,
      method: "PUT",
      requiresAuth: true,
      successMessage: "Additional details updated successfully!",
      errorMessage: "Failed to update additional details",
      invalidateKeys: ["profile"],
      onSuccessCallback: (resp?: any) => {
        if (resp && resp.data) setProfile(resp.data);
        else setProfile(tempProfile);
        toast.success("Additional details updated!");
        setAdditionalDetailsDialogOpen(false);
        refetch();
      },
      onErrorCallback: (err) => {
        toast.error("Error updating additional details");
        console.error("Error updating additional details:", err);
      },
    });
  };

  const handleSaveSocialLinks = async () => {
    if (!profile) return;

    const payload = {
      data: {
        socialLinks: tempSocialLinks,
      },
    };

    updateProfileMutation({
      endpoint: `/profile/${profile._id}`,
      data: payload,
      method: "PUT",
      requiresAuth: true,
      successMessage: "Social links updated successfully!",
      errorMessage: "Failed to update social links",
      invalidateKeys: ["profile"],
      onSuccessCallback: (resp?: any) => {
        const updated = resp?.data ?? { ...profile, socialLinks: tempSocialLinks };
        setSocialLinks(tempSocialLinks);
        setProfile(updated);
        toast.success("Social links updated!");
        setSocialLinksDialogOpen(false);
        refetch();
      },
      onErrorCallback: (err) => {
        toast.error("Error updating social links");
        console.error("Error updating social links:", err);
      },
    });
  };

  const handleSaveEducation = async () => {
    if (!profile) return;

    // convert year strings to numbers if possible, but API earlier expected strings too — adapt as needed
    const educationPayload = tempEducation.map((e) => ({
      degree: e.degree,
      institution: e.institution,
      year: e.year,
    }));

    const payload = { data: { education: educationPayload } };

    updateProfileMutation({
      endpoint: `/profile/${profile._id}`,
      data: payload,
      method: "PUT",
      requiresAuth: true,
      successMessage: "Education updated successfully!",
      errorMessage: "Failed to update education",
      invalidateKeys: ["profile"],
      onSuccessCallback: (resp?: any) => {
        const updated = resp?.data ?? { ...profile, education: educationPayload };
        setProfile(updated);
        toast.success("Education updated!");
        setEducationDialogOpen(false);
        refetch();
      },
      onErrorCallback: (err) => {
        toast.error("Error updating education");
        console.error("Error updating education:", err);
      },
    });
  };

  const handleSaveSkills = async () => {
    if (!profile) return;

    const payload = { data: { skills: tempSkills } };

    updateProfileMutation({
      endpoint: `/profile/${profile._id}`,
      data: payload,
      method: "PUT",
      requiresAuth: true,
      successMessage: "Skills updated successfully!",
      errorMessage: "Failed to update skills",
      invalidateKeys: ["profile"],
      onSuccessCallback: (resp?: any) => {
        const updated = resp?.data ?? { ...profile, skills: tempSkills };
        setProfile(updated);
        toast.success("Skills updated!");
        setSkillsDialogOpen(false);
        refetch();
      },
      onErrorCallback: (err) => {
        toast.error("Error updating skills");
        console.error("Error updating skills:", err);
      },
    });
  };

  /* ---------- helpers for local edit lists ---------- */

  // Social links
  const addSocialLink = () => setTempSocialLinks((p) => [...p, { platform: "", url: "" }]);
  const removeSocialLink = (i: number) =>
    setTempSocialLinks((p) => p.filter((_, idx) => idx !== i));
  const updateSocialLink = (i: number, field: "platform" | "url", value: string) =>
    setTempSocialLinks((p) => {
      const copy = [...p];
      copy[i] = { ...copy[i], [field]: value };
      return copy;
    });

  // Education
  const addEducation = () =>
    setTempEducation((p) => [...p, { degree: "", institution: "", year: "" }]);
  const removeEducation = (i: number) => setTempEducation((p) => p.filter((_, idx) => idx !== i));
  const updateEducation = (i: number, field: keyof EducationEntry, value: string) =>
    setTempEducation((p) => {
      const copy = [...p];
      copy[i] = { ...copy[i], [field]: value };
      return copy;
    });

  // Skills
  const addSkill = () => setTempSkills((p) => [...p, ""]);
  const removeSkill = (i: number) => setTempSkills((p) => p.filter((_, idx) => idx !== i));
  const updateSkill = (i: number, value: string) =>
    setTempSkills((p) => {
      const copy = [...p];
      copy[i] = value;
      return copy;
    });

  const cancelButtonClass =
    "m-0 w-[164px] h-[50px] rounded-none text-[16px] font-semibold bg-[#fff] hover:bg-gray-50";
  const saveButtonClass =
    "m-0 w-[164px] h-[50px] rounded-none text-[16px] font-semibold bg-[#019ACB] hover:bg-[#017a9e] text-white";

  /* ---------- Render guards ---------- */

  if (isLoading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading profile.</div>;
  if (!profile) return <div className="p-6">No profile data available.</div>;

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-600" />
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                  <img
                    src={profile.profileImage || Person}
                    alt={profile.userId?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 mt-16 pt-16 md:pt-2">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                  <div>
                    <h1 className="text-[24px] font-poppins font-bold text-gray-900 mb-1">
                      {profile.userId?.name || "No name provided"}
                    </h1>
                    <p className="text-[18px] font-epilogue text-gray-600 mb-2">
                      {profile.userId?.role || "Member"} {/* you can display company/role if available */}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.country || "Unknown location"}</span>
                    </div>
                  </div>
                  <Button variant="outline" className={`${cancelButtonClass} text-primary`} >Edit Profile</Button>
                </div>

                <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 text-sm font-medium rounded border border-green-200">
                  <img src={FlagIcon} alt="FlagIcon" />
                  OPEN FOR OPPORTUNITIES
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left col */}
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
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <p className="text-gray-700 text-[16px] font-inter leading-relaxed whitespace-pre-line">
                {profile.experience ||
                  "No about/experience added yet. Click edit to add a short bio or experience summary."}
              </p>
            </div>

            {/* Experiences - placeholder (keep as before, you can integrate experiences later) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">Experiences</h2>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">No experiences added yet.</p>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">Education</h2>
                <button
                  onClick={() => {
                    setTempEducation(
                      (profile.education || []).map((e) => ({
                        degree: e.degree,
                        institution: e.institution,
                        year: e.year,
                      }))
                    );
                    setEducationDialogOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {profile.education && profile.education.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-gray-600">EDU</span>
                      </div>
                      <div>
                        <h3 className="text-[18px] font-inter font-medium text-gray-900">{edu.institution}</h3>
                        <p className="text-[16px] font-inter text-gray-600">{edu.degree}</p>
                        <p className="text-[16px] font-inter text-gray-500">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No education added yet.</p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white p-6 mb-6 shadow-sm ">
              <h2 className="text-[20px] font-bold text-[#141414] mb-5">Skills</h2>

              {profile.skills.length > 0 ? (
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

          {/* right col */}
          <div className="space-y-6">
            {/* Additional details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">Additional Details</h2>
                <button
                  onClick={() => {
                    setTempProfile(profile);
                    setAdditionalDetailsDialogOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
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
                    <p className="text-sm text-gray-900">
                      {profile.mobile || "No phone number provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Languages</p>
                    <p className="text-sm text-gray-900">
                      {profile.preferredLanguage || "No language specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">Social Links</h2>
                <button
                  onClick={() => {
                    setTempSocialLinks([...socialLinks]);
                    setSocialLinksDialogOpen(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
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
      </div>

      {/* ---------------- Dialogs ---------------- */}

      {/* About Dialog */}
      <Dialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">About</DialogTitle>
            <button onClick={() => setAboutDialogOpen(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          <div className="border-t my-4" />
          <div className="space-y-4">
            <Textarea
              value={tempProfile?.experience || ""}
              onChange={(e) =>
                setTempProfile((prev) => (prev ? { ...prev, experience: e.target.value } : null))
              }
              className="min-h-[200px] resize-none"
              placeholder="Tell us about yourself..."
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" className={cancelButtonClass} onClick={() => setAboutDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className={saveButtonClass} disabled={isUpdating}>
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
            <button onClick={() => setAdditionalDetailsDialogOpen(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          <div className="border-t my-4" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={tempProfile?.userId?.email || ""}
                onChange={(e) =>
                  setTempProfile((prev) =>
                    prev ? { ...prev, userId: { ...prev.userId, email: e.target.value } } : null
                  )
                }
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                value={tempProfile?.mobile || ""}
                onChange={(e) => setTempProfile((prev) => (prev ? { ...prev, mobile: e.target.value } : null))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">
                Language
              </Label>
              <Input
                id="language"
                value={tempProfile?.preferredLanguage || ""}
                onChange={(e) =>
                  setTempProfile((prev) => (prev ? { ...prev, preferredLanguage: e.target.value } : null))
                }
                className="h-11"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className={cancelButtonClass} onClick={() => setAdditionalDetailsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAdditionalDetails} className={saveButtonClass} disabled={isUpdating}>
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
            <button onClick={() => setSocialLinksDialogOpen(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          <div className="border-t my-4" />
          <div className="space-y-4">
            {tempSocialLinks && tempSocialLinks.length > 0 ? (
              tempSocialLinks.map((link, idx) => (
                <div key={idx} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{link.platform || `Link ${idx + 1}`}</Label>
                    <button onClick={() => removeSocialLink(idx)} className="p-1 hover:bg-gray-100 rounded">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <Input
                    value={link.platform}
                    onChange={(e) => updateSocialLink(idx, "platform", e.target.value)}
                    placeholder="Platform name (e.g., Instagram, Twitter)"
                    className="h-11"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) => updateSocialLink(idx, "url", e.target.value)}
                    placeholder="Enter your link (https://...)"
                    className="h-11"
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No social links yet. Click below to add one.</p>
            )}

            <button onClick={addSocialLink} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add another link
            </button>

            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button variant="outline" className={cancelButtonClass} onClick={() => setSocialLinksDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSocialLinks} className={saveButtonClass} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save & Change"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Education Dialog */}
      <Dialog open={educationDialogOpen} onOpenChange={setEducationDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Education</DialogTitle>
            <button onClick={() => setEducationDialogOpen(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          <div className="border-t my-4" />
          <div className="space-y-4">
            {tempEducation && tempEducation.length > 0 ? (
              tempEducation.map((edu, idx) => (
                <div key={idx} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Education {idx + 1}</Label>
                    <button onClick={() => removeEducation(idx)} className="p-1 hover:bg-gray-100 rounded">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Institution</Label>
                    <Input value={edu.institution} onChange={(e) => updateEducation(idx, "institution", e.target.value)} className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Degree</Label>
                    <Input value={edu.degree} onChange={(e) => updateEducation(idx, "degree", e.target.value)} className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Year</Label>
                    <Input type="number" value={edu.year} onChange={(e) => updateEducation(idx, "year", e.target.value)} className="h-11" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No education entries yet. Click below to add one.</p>
            )}

            <button onClick={addEducation} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add another education
            </button>

            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button variant="outline" className={cancelButtonClass} onClick={() => setEducationDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEducation} className={saveButtonClass} disabled={isUpdating}>
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
            <button onClick={() => setSkillsDialogOpen(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>

          <div className="border-t my-4" />
          <div className="space-y-4">
            {tempSkills && tempSkills.length > 0 ? (
              tempSkills.map((skill, idx) => (
                <div key={idx} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Skill {idx + 1}</Label>
                    <button onClick={() => removeSkill(idx)} className="p-1 hover:bg-gray-100 rounded">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <Input value={skill} onChange={(e) => updateSkill(idx, e.target.value)} className="h-11" />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No skills added yet. Click below to add one.</p>
            )}

            <button onClick={addSkill} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
              <Plus className="w-4 h-4" />
              Add another skill
            </button>

            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button variant="outline" className={cancelButtonClass} onClick={() => setSkillsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSkills} className={saveButtonClass} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save & Change"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}

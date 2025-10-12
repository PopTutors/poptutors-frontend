import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import Textarea from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { X, Plus, Edit2 } from "lucide-react";

interface ProfileDialogsProps {
    // Dialog states (keeps other existing boolean dialogs)
    aboutDialogOpen: boolean;
    skillsDialogOpen: boolean;
    additionalDetailsDialogOpen: boolean;
    socialLinksDialogOpen: boolean;
    editProfileDialogOpen: boolean;

    // EXPERIENCE & EDUCATION: instead of single big list dialog, we expose per-item "item dialog"
    // When item dialog open with index === null -> it's an Add flow. When index is number -> Edit that item.
    experienceItemDialogOpen: boolean;
    experienceItemIndex: number | null; // null means add new
    educationItemDialogOpen: boolean;
    educationItemIndex: number | null; // null means add new

    // Temporary states
    tempProfile: any;
    tempSocialLinks: any[];
    tempEducation: any[];
    tempSkills: string[];
    tempExperiences: any[];

    // Handlers (existing)
    onDialogChange: (dialog: string, open: boolean) => void;
    onUpdateTempProfile: (updates: any) => void;
    onAddSocialLink: () => void;
    onRemoveSocialLink: (idx: number) => void;
    onUpdateSocialLink: (idx: number, field: string, value: string) => void;
    onSaveSocialLinks: () => void;
    onAddSkill: () => void;
    onRemoveSkill: (idx: number) => void;
    onUpdateSkill: (idx: number, value: string) => void;
    onSaveSkills: () => void;
    onSaveAdditionalDetails: () => void;
    onSaveProfile: () => void;
    onSaveEditProfile: () => void;

    // Experience/Education handlers (enhanced)
    onAddExperience: () => void; // should initialize a blank experience in parent temporary state
    onRemoveExperience: (idx: number) => void;
    onUpdateExperienceField: (idx: number, field: string, value: any) => void;
    onUpdateExperienceListField: (idx: number, field: string, list: string[]) => void;
    onSaveExperienceItem: (idx: number | null) => void; // parent saves either new (null) or existing index
    onOpenExperienceItem: (open: boolean, idx?: number | null) => void; // open item dialog

    onAddEducation: () => void;
    onRemoveEducation: (idx: number) => void;
    onUpdateEducationField: (idx: number, field: string, value: any) => void;
    onSaveEducationItem: (idx: number | null) => void;
    onOpenEducationItem: (open: boolean, idx?: number | null) => void;

    // Loading state
    isUpdating: boolean;
}

export const ProfileDialogs: React.FC<ProfileDialogsProps> = ({
    aboutDialogOpen,
    skillsDialogOpen,
    additionalDetailsDialogOpen,
    socialLinksDialogOpen,
    editProfileDialogOpen,
    experienceItemDialogOpen,
    experienceItemIndex,
    educationItemDialogOpen,
    educationItemIndex,
    tempProfile,
    tempSocialLinks,
    tempEducation,
    tempSkills,
    tempExperiences,
    onDialogChange,
    onUpdateTempProfile,
    onAddSocialLink,
    onRemoveSocialLink,
    onUpdateSocialLink,
    onSaveSocialLinks,
    onAddSkill,
    onRemoveSkill,
    onUpdateSkill,
    onSaveSkills,
    onSaveAdditionalDetails,
    onSaveProfile,
    onSaveEditProfile,
    onAddExperience,
    onRemoveExperience,
    onUpdateExperienceField,
    onUpdateExperienceListField,
    onSaveExperienceItem,
    onOpenExperienceItem,
    onAddEducation,
    onRemoveEducation,
    onUpdateEducationField,
    onSaveEducationItem,
    onOpenEducationItem,
    isUpdating
}) => {
    const cancelButtonClass = "m-0 w-[164px] h-[50px] -none text-[16px] font-semibold bg-[#fff] hover:bg-gray-50";
    const saveButtonClass = "m-0 w-[164px] h-[50px] -none text-[16px] font-semibold bg-[#019ACB] hover:bg-[#017a9e] text-white";

    // --- ABOUT (same as before) ---
    const renderAboutDialog = () => (
        <Dialog open={aboutDialogOpen} onOpenChange={(open) => onDialogChange("about", open)}>
            <DialogContent className="max-w-xl">
                <DialogHeader className="flex items-center justify-between bg-[#fafafa] w-full px-[24px] py-[16px] border border-b-[#E1E1E1]">
                    <DialogTitle className="text-xl font-semibold">About</DialogTitle>
                    <button onClick={() => onDialogChange("about", false)} className="p-1 hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>
                {/*  */}
                <div className="space-y-4 p-6">
                    <Textarea
                        value={tempProfile?.about || ""}
                        onChange={e => onUpdateTempProfile({ about: e.target.value })}
                        className="min-h-[200px] resize-none"
                        placeholder="Tell us about yourself..."
                    />
                    <div className="flex justify-end gap-3 border-t pt-3">
                        <Button variant="outline" className={cancelButtonClass} onClick={() => onDialogChange("about", false)}>
                            Cancel
                        </Button>
                        <Button onClick={onSaveProfile} className={saveButtonClass} disabled={isUpdating}>
                            {isUpdating ? "Saving..." : "Save & Change"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

    // --- ADDITIONAL DETAILS ---
    const renderAdditionalDetailsDialog = () => (
        <Dialog open={additionalDetailsDialogOpen} onOpenChange={(open) => onDialogChange("additionalDetails", open)}>
            <DialogContent className="max-w-xl">
                <DialogHeader className="flex items-center justify-between bg-[#fafafa] w-full px-[24px] py-[16px] border border-b-[#E1E1E1]">
                    <DialogTitle className="text-xl font-semibold">Additional details</DialogTitle>
                    <button onClick={() => onDialogChange("additionalDetails", false)} className="p-1 hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>

                <div className="space-y-4 p-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={tempProfile?.userId?.email || ""}
                            onChange={e => onUpdateTempProfile({ userId: { ...tempProfile?.userId, email: e.target.value } })}
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                        <Input
                            id="phone"
                            value={tempProfile?.mobile || ""}
                            onChange={e => onUpdateTempProfile({ mobile: e.target.value })}
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="language" className="text-sm font-medium">Language</Label>
                        <Input
                            id="language"
                            value={tempProfile?.preferredLanguage || ""}
                            onChange={e => onUpdateTempProfile({ preferredLanguage: e.target.value })}
                            className="h-11"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" className={cancelButtonClass} onClick={() => onDialogChange("additionalDetails", false)}>
                            Cancel
                        </Button>
                        <Button onClick={onSaveAdditionalDetails} className={saveButtonClass} disabled={isUpdating}>
                            {isUpdating ? "Saving..." : "Save & Change"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

    // --- SOCIAL LINKS ---
    const renderSocialLinksDialog = () => (
        <Dialog open={socialLinksDialogOpen} onOpenChange={(open) => onDialogChange("socialLinks", open)}>
            <DialogContent className="max-w-xl">
                <DialogHeader className="flex items-center justify-between bg-[#fafafa] w-full px-[24px] py-[16px] border border-b-[#E1E1E1]">
                    <DialogTitle className="text-xl font-semibold">Social links</DialogTitle>
                    <button onClick={() => onDialogChange("socialLinks", false)} className="p-1 hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>

                <div className="space-y-4 p-6">
                    {tempSocialLinks.length > 0 ? (
                        tempSocialLinks.map((link, idx) => (
                            <div key={idx} className="space-y-3 p-4 border ">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">{link.platform || `Link ${idx + 1}`}</Label>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onRemoveSocialLink(idx)} className="p-1 hover:bg-gray-100">
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <Input
                                    value={link.platform}
                                    onChange={e => onUpdateSocialLink(idx, "platform", e.target.value)}
                                    placeholder="Platform name (e.g., Instagram, Twitter)"
                                    className="h-11"
                                />
                                <Input
                                    value={link.url}
                                    onChange={e => onUpdateSocialLink(idx, "url", e.target.value)}
                                    placeholder="Enter your link (https://...)"
                                    className="h-11"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-8">No social links yet. Click below to add one.</p>
                    )}
                    <button onClick={onAddSocialLink} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <Plus className="w-4 h-4" /> Add another link
                    </button>
                    <div className="flex justify-end gap-3 pt-2 border-t">
                        <Button variant="outline" className={cancelButtonClass} onClick={() => onDialogChange("socialLinks", false)}>
                            Cancel
                        </Button>
                        <Button onClick={onSaveSocialLinks} className={saveButtonClass} disabled={isUpdating}>
                            {isUpdating ? "Saving..." : "Save & Change"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

    // --- SKILLS ---
    const renderSkillsDialog = () => (
        <Dialog open={skillsDialogOpen} onOpenChange={(open) => onDialogChange("skills", open)}>
            <DialogContent className="max-w-xl">
                <DialogHeader className="flex items-center justify-between bg-[#fafafa] w-full px-[24px] py-[16px] border border-b-[#E1E1E1]">
                    <DialogTitle className="text-xl font-semibold">Skills</DialogTitle>
                    <button onClick={() => onDialogChange("skills", false)} className="p-1 hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>

                <div className="space-y-4 p-6">
                    {tempSkills.length > 0 ? (
                        tempSkills.map((skill, idx) => (
                            <div key={idx} className="space-y-3 p-4 border ">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Skill {idx + 1}</Label>
                                    <button onClick={() => onRemoveSkill(idx)} className="p-1 hover:bg-gray-100">
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                                <Input
                                    value={skill}
                                    onChange={e => onUpdateSkill(idx, e.target.value)}
                                    className="h-11"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-8">No skills added yet. Click below to add one.</p>
                    )}
                    <button onClick={onAddSkill} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <Plus className="w-4 h-4" /> Add another skill
                    </button>
                    <div className="flex justify-end gap-3 pt-2 border-t">
                        <Button variant="outline" className={cancelButtonClass} onClick={() => onDialogChange("skills", false)}>
                            Cancel
                        </Button>
                        <Button onClick={onSaveSkills} className={saveButtonClass} disabled={isUpdating}>
                            {isUpdating ? "Saving..." : "Save & Change"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

    // --- EDIT PROFILE ---
    const renderEditProfileDialog = () => (
        <Dialog open={editProfileDialogOpen} onOpenChange={(open) => onDialogChange("editProfile", open)}>
            <DialogContent className="max-w-xl overflow-scroll">
                <DialogHeader className="flex items-center justify-between bg-[#fafafa] w-full px-[24px] py-[16px] border border-b-[#E1E1E1]">
                    <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
                    <button onClick={() => onDialogChange("editProfile", false)} className="p-1 hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>

                <div className="space-y-4 p-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Profile image URL</Label>
                        <Input
                            value={tempProfile?.profileImage || ""}
                            onChange={e => onUpdateTempProfile({ profileImage: e.target.value })}
                            placeholder="https://..."
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Full name</Label>
                        <Input
                            value={tempProfile?.userId?.name || ""}
                            onChange={e => onUpdateTempProfile({ userId: { ...tempProfile?.userId, name: e.target.value } })}
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Location (country)</Label>
                        <Input
                            value={tempProfile?.country || ""}
                            onChange={e => onUpdateTempProfile({ country: e.target.value })}
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
                                        onChange={e => onUpdateSkill(idx, e.target.value)}
                                        className="h-11 flex-1"
                                    />
                                    <button onClick={() => onRemoveSkill(idx)} className="p-2 hover:bg-gray-100">
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No skills yet.</p>
                        )}
                        <div>
                            <button onClick={onAddSkill} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add skill
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t">
                        <Button variant="outline" className={cancelButtonClass} onClick={() => onDialogChange("editProfile", false)}>
                            Cancel
                        </Button>
                        <Button onClick={onSaveEditProfile} className={saveButtonClass} disabled={isUpdating}>
                            {isUpdating ? "Saving..." : "Save & Change"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );

    // --- EXPERIENCE ITEM DIALOG (add or edit single experience) ---
    const renderExperienceItemDialog = () => {
        const isEdit = experienceItemIndex !== null && typeof experienceItemIndex === 'number';
        const xp = isEdit ? tempExperiences[experienceItemIndex as number] : { title: '', company: '', location: '', employmentType: '', startDate: '', endDate: '', duration: '', description: '', responsibilities: [], skills: [] };

        return (
            <Dialog open={experienceItemDialogOpen} onOpenChange={(open) => onOpenExperienceItem(open, null)}>
                <DialogContent className="max-w-2xl h-[700px] overflow-scroll">
                    <DialogHeader className="flex items-center justify-between bg-[#fafafa] w-full px-[24px] py-[16px] border border-b-[#E1E1E1]">
                        <DialogTitle className="text-xl font-semibold">{isEdit ? `Edit Experience ${experienceItemIndex! + 1}` : 'Add Experience'}</DialogTitle>
                        <button onClick={() => onOpenExperienceItem(false, null)} className="p-1 hover:bg-gray-100">
                            <X className="w-5 h-5" />
                        </button>
                    </DialogHeader>

                    <div className="space-y-4 p-6">
                        <Input value={xp.title} onChange={e => onUpdateExperienceField(isEdit ? experienceItemIndex! : tempExperiences.length, 'title', e.target.value)} placeholder="Role" className="h-11" />
                        <Input value={xp.company} onChange={e => onUpdateExperienceField(isEdit ? experienceItemIndex! : tempExperiences.length, 'company', e.target.value)} placeholder="Company" className="h-11" />
                        <Input value={xp.location || ''} onChange={e => onUpdateExperienceField(isEdit ? experienceItemIndex! : tempExperiences.length, 'location', e.target.value)} placeholder="Location" className="h-11" />
                        <Input value={xp.employmentType || ''} onChange={e => onUpdateExperienceField(isEdit ? experienceItemIndex! : tempExperiences.length, 'employmentType', e.target.value)} placeholder="Employment Type (e.g., Full-Time)" className="h-11" />
                        <div className="grid grid-cols-2 gap-3">
                            <Input value={xp.startDate || ''} onChange={e => onUpdateExperienceField(isEdit ? experienceItemIndex! : tempExperiences.length, 'startDate', e.target.value)} placeholder="Start Date (e.g., Jun 2019)" className="h-11" />
                            <Input value={xp.endDate || ''} onChange={e => onUpdateExperienceField(isEdit ? experienceItemIndex! : tempExperiences.length, 'endDate', e.target.value)} placeholder="End Date (e.g., Present)" className="h-11" />
                        </div>
                        <Input value={xp.duration || ''} onChange={e => onUpdateExperienceField(isEdit ? experienceItemIndex! : tempExperiences.length, 'duration', e.target.value)} placeholder="Duration (e.g., 2y 3m)" className="h-11" />
                        <Textarea value={xp.description || ''} onChange={e => onUpdateExperienceField(isEdit ? experienceItemIndex! : tempExperiences.length, 'description', e.target.value)} className="min-h-[100px]" placeholder="Description/summary" />

                        <Label className="text-sm font-medium">Responsibilities</Label>
                        {(xp.responsibilities ?? []).map((resp: string, rIdx: number) => (
                            <div key={rIdx} className="flex gap-2 mb-1">
                                <Input value={resp} onChange={e => {
                                    const newList = [...(xp.responsibilities ?? [])];
                                    newList[rIdx] = e.target.value;
                                    onUpdateExperienceListField(isEdit ? experienceItemIndex! : tempExperiences.length, 'responsibilities', newList);
                                }} className="h-11 flex-1" placeholder={`Responsibility ${rIdx + 1}`} />
                                <button onClick={() => {
                                    const newList = (xp.responsibilities ?? []).filter((_, i) => i !== rIdx);
                                    onUpdateExperienceListField(isEdit ? experienceItemIndex! : tempExperiences.length, 'responsibilities', newList);
                                }} className="p-2 hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
                            </div>
                        ))}
                        <button onClick={() => onUpdateExperienceListField(isEdit ? experienceItemIndex! : tempExperiences.length, 'responsibilities', [...(xp.responsibilities ?? []), ''])} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-2 my-1"><Plus className="w-4 h-4" /> Add responsibility</button>

                        <Label className="text-sm font-medium">Skills Used</Label>
                        {(xp.skills ?? []).map((skill: string, sIdx: number) => (
                            <div key={sIdx} className="flex gap-2 mb-1">
                                <Input value={skill} onChange={e => {
                                    const newList = [...(xp.skills ?? [])];
                                    newList[sIdx] = e.target.value;
                                    onUpdateExperienceListField(isEdit ? experienceItemIndex! : tempExperiences.length, 'skills', newList);
                                }} className="h-11 flex-1" placeholder={`Skill ${sIdx + 1}`} />
                                <button onClick={() => {
                                    const newList = (xp.skills ?? []).filter((_, i) => i !== sIdx);
                                    onUpdateExperienceListField(isEdit ? experienceItemIndex! : tempExperiences.length, 'skills', newList);
                                }} className="p-2 hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
                            </div>
                        ))}
                        <button onClick={() => onUpdateExperienceListField(isEdit ? experienceItemIndex! : tempExperiences.length, 'skills', [...(xp.skills ?? []), ''])} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-2 my-1"><Plus className="w-4 h-4" /> Add skill</button>

                        <div className="flex justify-end gap-3 pt-2 border-t">
                            <Button variant="outline" className={cancelButtonClass} onClick={() => onOpenExperienceItem(false, null)}>Cancel</Button>
                            <Button onClick={() => onSaveExperienceItem(isEdit ? experienceItemIndex : null)} className={saveButtonClass} disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save & Change'}</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    // --- EDUCATION ITEM DIALOG (add or edit single education) ---
    const renderEducationItemDialog = () => {
        const isEdit = educationItemIndex !== null && typeof educationItemIndex === 'number';
        const edu = isEdit ? tempEducation[educationItemIndex as number] : { degree: '', fieldOfStudy: '', institution: '', startYear: '', endYear: '', grade: '', description: '', currentlyStudying: false };

        return (
            <Dialog open={educationItemDialogOpen} onOpenChange={(open) => onOpenEducationItem(open, null)}>
                <DialogContent className="max-w-xl h-[700px] overflow-scroll">
                    <DialogHeader className="flex items-center justify-between bg-[#fafafa] w-full px-[24px] py-[16px] border border-b-[#E1E1E1]">
                        <DialogTitle className="text-xl font-semibold">{isEdit ? `Edit Education ${educationItemIndex! + 1}` : 'Add Education'}</DialogTitle>
                        <button onClick={() => onOpenEducationItem(false, null)} className="p-1 hover:bg-gray-100">
                            <X className="w-5 h-5" />
                        </button>
                    </DialogHeader>

                    <div className="space-y-4 p-6">
                        <Input value={edu.degree} onChange={e => onUpdateEducationField(isEdit ? educationItemIndex! : tempEducation.length, 'degree', e.target.value)} placeholder="Degree" className="h-11" />
                        <Input value={edu.fieldOfStudy || ''} onChange={e => onUpdateEducationField(isEdit ? educationItemIndex! : tempEducation.length, 'fieldOfStudy', e.target.value)} placeholder="Field of Study" className="h-11" />
                        <Input value={edu.institution || ''} onChange={e => onUpdateEducationField(isEdit ? educationItemIndex! : tempEducation.length, 'institution', e.target.value)} placeholder="Institution" className="h-11" />
                        <div className="grid grid-cols-2 gap-3">
                            <Input value={edu.startYear || ''} onChange={e => onUpdateEducationField(isEdit ? educationItemIndex! : tempEducation.length, 'startYear', e.target.value)} placeholder="Start Year" className="h-11" />
                            <Input value={edu.endYear || ''} onChange={e => onUpdateEducationField(isEdit ? educationItemIndex! : tempEducation.length, 'endYear', e.target.value)} placeholder="End Year" className="h-11" />
                        </div>
                        <Input value={edu.grade || ''} onChange={e => onUpdateEducationField(isEdit ? educationItemIndex! : tempEducation.length, 'grade', e.target.value)} placeholder="Grade (GPA/Percentage)" className="h-11" />
                        <Textarea value={edu.description || ''} onChange={e => onUpdateEducationField(isEdit ? educationItemIndex! : tempEducation.length, 'description', e.target.value)} className="min-h-[100px]" placeholder="Description" />
                        <div className="flex gap-2 items-center">
                            <input type="checkbox" checked={!!edu.currentlyStudying} onChange={e => onUpdateEducationField(isEdit ? educationItemIndex! : tempEducation.length, 'currentlyStudying', e.target.checked)} id={`currentlyStudying${educationItemIndex ?? 'new'}`} className="h-5 w-5 border-gray-300" />
                            <Label htmlFor={`currentlyStudying${educationItemIndex ?? 'new'}`} className="text-sm font-medium">Currently Studying?</Label>
                        </div>

                        <div className="flex justify-end gap-3 pt-2 border-t">
                            <Button variant="outline" className={cancelButtonClass} onClick={() => onOpenEducationItem(false, null)}>Cancel</Button>
                            <Button onClick={() => onSaveEducationItem(isEdit ? educationItemIndex : null)} className={saveButtonClass} disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save & Change'}</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <>
            {renderAboutDialog()}
            {renderAdditionalDetailsDialog()}
            {renderSocialLinksDialog()}
            {renderSkillsDialog()}
            {renderEditProfileDialog()}
            {renderExperienceItemDialog()}
            {renderEducationItemDialog()}
        </>
    );
};

export default ProfileDialogs;

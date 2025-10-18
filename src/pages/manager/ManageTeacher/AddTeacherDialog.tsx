// src/pages/manager/ManageTeacher/components/AddTeacherDialog.tsx
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import Textarea from '../../../components/ui/textarea';
import { Button } from '../../../components/ui';
import { Upload, Linkedin, Instagram, X } from 'lucide-react';
import { uploadToBunnyCDN } from '../../../utils/uploadToBunnyCdn';

export default function AddTeacherDialog({
    open,
    onClose,
    onAdd,
    busy,
}: {
    open: boolean;
    onClose: () => void;
    onAdd: (payload: any, file?: File | null, done?: () => void) => void;
    busy?: boolean;
}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [salary, setSalary] = useState('');
    const [skills, setSkills] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState < File | null > (null);
    const [linkedin, setLinkedin] = useState('');
    const [instagram, setInstagram] = useState('');
    const [uploading, setUploading] = useState(false);

    const resetForm = () => {
        setName('');
        setEmail('');
        setJobTitle('');
        setSubject('');
        setSalary('');
        setSkills('');
        setDescription('');
        setImageFile(null);
        setLinkedin('');
        setInstagram('');
    };

    const handleSubmit = async () => {
        if (uploading || busy) return;
        setUploading(true);

        try {
            let profileImageUrl: string | null = null;

            if (imageFile) {
                try {
                    const uploadResp = await uploadToBunnyCDN({
                        file: imageFile,
                        folderPath: 'teachers',
                    });
                    // log entire response for debugging
                    console.debug('uploadToBunnyCDN response:', uploadResp);

                    // accept multiple possible return shapes
                    profileImageUrl =
                        (uploadResp && (uploadResp.url || (uploadResp as any).publicUrl || (uploadResp as any).downloadUrl || (uploadResp as any).data?.url)) ??
                        null;

                    // Fallback: sometimes function returns string directly
                    if (!profileImageUrl && typeof uploadResp === 'string') profileImageUrl = uploadResp;

                    if (!profileImageUrl) {
                        console.warn('Uploader returned no URL. Full response:', uploadResp);
                        alert('Upload returned no URL. Check console/network for details.');
                        setUploading(false);
                        return;
                    }
                } catch (err) {
                    console.error('Image upload failed', err);
                    alert('Image upload failed. Please try again or remove the image.');
                    setUploading(false);
                    return;
                }
            }

            const payload: any = {
                name,
                email,
                jobTitle,
                subject,
                salary,
                skills: skills ? skills.split(',').map((s) => s.trim()) : [],
                description,
                linkedin,
                instagram,
                // only include profileImage if we have a URL, otherwise leave undefined
                ...(profileImageUrl ? { profileImage: profileImageUrl } : {}),
            };



            console.log('Submitting payload to onAdd:', payload);
            onAdd(payload, null, () => resetForm());
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>

            <DialogContent className="w-full sm:max-w-2xl max-h-[80vh] overflow-scroll">
                <DialogHeader className="flex items-center justify-between bg-[#fafafa] w-full px-[24px] py-[16px] border border-b-[#E1E1E1]">
                    <DialogTitle className="text-xl font-semibold">Add New Teacher</DialogTitle>
                    <button onClick={() => onClose()} className="p-1 hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>
                <div className="flex flex-col h-full">
                    <div className="overflow-y-auto p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <img
                                src="https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?fm=jpg&q=60&w=3000"
                                alt="Teacher avatar"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-md bg-card cursor-pointer">
                                <Upload className="size-4" />
                                <span className="text-sm">Upload Photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        setImageFile(e.target.files?.[0] ?? null)
                                    }
                                />
                            </label>
                        </div>

                        <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            {/* Full Name */}
                            <div className="grid gap-2">
                                <Label htmlFor="full-name">Full name</Label>
                                <Input
                                    id="full-name"
                                    placeholder="Enter teacher full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Job Title */}
                            <div className="grid gap-2">
                                <Label htmlFor="job-title">Job title</Label>
                                <Input
                                    id="job-title"
                                    placeholder="Enter job title"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Subject */}
                            <div className="grid gap-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    placeholder="Enter subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Salary */}
                            <div className="grid gap-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input
                                    id="salary"
                                    placeholder="Enter salary"
                                    value={salary}
                                    onChange={(e) => setSalary(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Skills */}
                            <div className="grid gap-2">
                                <Label htmlFor="skills">Required skills</Label>
                                <Input
                                    id="skills"
                                    placeholder="Enter required skills (comma separated)"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Bio */}
                            <div className="grid gap-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Enter description"
                                    className="w-full h-28 resize-none"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                />
                            </div>

                            {/* LinkedIn */}
                            <div className="grid gap-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <div className="relative">
                                    <Linkedin className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                    <Input
                                        id="linkedin"
                                        placeholder="LinkedIn profile URL"
                                        className="pl-9 w-full"
                                        value={linkedin}
                                        onChange={(e) =>
                                            setLinkedin(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Instagram */}
                            <div className="grid gap-2">
                                <Label htmlFor="instagram">Instagram</Label>
                                <div className="relative">
                                    <Instagram className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                    <Input
                                        id="instagram"
                                        placeholder="Instagram profile URL"
                                        className="pl-9 w-full"
                                        value={instagram}
                                        onChange={(e) =>
                                            setInstagram(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    <DialogFooter className="flex items-center justify-end gap-3 p-4 border-t border-border bg-card flex-shrink-0">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="m-0 w-[164px] h-[50px] rounded-none text-[16px] font-semibold bg-[#fff]"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={handleSubmit}
                            className="m-0 w-[164px] h-[50px] rounded-none text-[16px] font-semibold bg-[#019ACB]"
                            disabled={busy || uploading}
                            aria-disabled={busy || uploading}
                        >
                            {busy || uploading ? 'Adding…' : 'Add Teacher'}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

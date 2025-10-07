// src/pages/manager/ManageTeacher/components/AddTeacherDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import Textarea from '../../../components/ui/textarea';
import { Button } from '../../../components/ui';
import { Upload, Linkedin, Instagram } from 'lucide-react';

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
    const [jobTitle, setJobTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [salary, setSalary] = useState('');
    const [skills, setSkills] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState < File | null > (null);
    const [linkedin, setLinkedin] = useState('');
    const [instagram, setInstagram] = useState('');

    const handleSubmit = () => {
        const payload = {
            name,
            jobTitle,
            subject,
            salary,
            skills: skills ? skills.split(',').map((s) => s.trim()) : [],
            description,
            linkedin,
            instagram,
        };
        onAdd(payload, imageFile, () => {
            // reset local form
            setName(''); setJobTitle(''); setSubject(''); setSalary(''); setSkills(''); setDescription(''); setImageFile(null); setLinkedin(''); setInstagram('');
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full sm:max-w-2xl max-h-[80vh] overflow-scroll">
                <div className="flex flex-col h-full">
                    <div className="overflow-y-auto p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <img src="https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?fm=jpg&q=60&w=3000" alt="Teacher avatar" className="w-12 h-12 rounded-full object-cover" />
                            <label className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-md bg-card cursor-pointer">
                                <Upload className="size-4" />
                                <span className="text-sm">Upload Photo</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
                            </label>
                        </div>

                        <form className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="full-name">Full name</Label>
                                <Input id="full-name" placeholder="Enter teacher full name" value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="job-title">Job title</Label>
                                <Input id="job-title" placeholder="Enter job title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="Enter subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input id="salary" placeholder="Enter salary" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="skills">Require skills</Label>
                                <Input id="skills" placeholder="Enter required skills (comma separated)" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" placeholder="Enter description" className="w-full h-28 resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <div className="relative">
                                    <Linkedin className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                    <Input id="linkedin" placeholder="Linkedin profile url" className="pl-9 w-full" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="instagram">Instagram</Label>
                                <div className="relative">
                                    <Instagram className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                                    <Input id="instagram" placeholder="Instagram profile url" className="pl-9 w-full" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                                </div>
                            </div>
                        </form>
                    </div>

                    <DialogFooter className="flex items-center justify-end gap-3 p-4 border-t border-border bg-card flex-shrink-0">
                        <DialogClose asChild>
                            <Button variant="outline" className="m-0 w-[164px] h-[50px] rounded-none text-[16px] font-semibold bg-[#fff]">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSubmit} className="m-0 w-[164px] h-[37px] rounded-none text-[16px] font-semibold bg-[#019ACB]" disabled={busy} aria-disabled={busy}>
                            {busy ? 'Adding…' : 'Add Teacher'}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

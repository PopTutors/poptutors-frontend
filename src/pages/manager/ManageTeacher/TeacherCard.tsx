import React from 'react';
import { Star, ShieldOff, Trash2 } from 'lucide-react';
import Dropdown from './Dropdown';
import ImageWithFallback from './ImageWithFallback';
import { OpenIcon, FacebookIcon, InstagramIcon, LinkedInIcon } from '../../../assets/managers';
import { type Teacher } from './types';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../config/path';

export default function TeacherCard({
    teacher,
    onBlockToggle,
    onDelete,
}: {
    teacher: Teacher;
    onBlockToggle: (t: Teacher) => void;
    onDelete: (id: string | number) => void;
}) {
    const navigate = useNavigate();

    return (
        <article className="bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-150">
            <div className="relative">
                <ImageWithFallback src={teacher.image || '/placeholder.svg'} alt={teacher.name} className="bg-gray-100" />

                {teacher.blocked ? (
                    <div className="absolute top-3 right-3">
                        <Dropdown
                            items={[
                                {
                                    key: 'unblock',
                                    label: (
                                        <>
                                            <ShieldOff className="size-4 text-foreground" />
                                            <span>Unblock</span>
                                        </>
                                    ),
                                    onClick: () => onBlockToggle(teacher),
                                },
                                {
                                    key: 'delete',
                                    danger: true,
                                    label: (
                                        <>
                                            <Trash2 className="size-4" />
                                            <span>Delete</span>
                                        </>
                                    ),
                                    onClick: () => onDelete(teacher.id),
                                },
                            ]}
                        />
                    </div>
                ) : (
                    typeof teacher.rating === 'number' && (
                        <div className="absolute top-3 right-3 flex items-center gap-2 bg-white/95 border border-border rounded-full px-2 py-1 shadow-sm">
                            <span className="text-xs font-semibold">{teacher.rating}</span>
                            <Star className="size-3 text-[var(--brand-primary)]" />
                        </div>
                    )
                )}
            </div>

            <div className="p-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-[16px] font-poppins border-r pr-2">{teacher.name}</h3>
                        <p className="text-[12px] font-inter text-muted-foreground">{teacher.subject}</p>
                    </div>
                </div>

                <p className="text-[12px] text-[#8E8E93] text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {teacher.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="sr-only">Social links</span>
                        {teacher.linkedin && (
                            <a href={teacher.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted border border-border hover:shadow-sm" aria-label="LinkedIn">
                                <img src={LinkedInIcon} alt="LinkedIn" />
                            </a>
                        )}
                        {teacher.instagram && (
                            <a href={teacher.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted border border-border hover:shadow-sm" aria-label="Instagram">
                                <img src={InstagramIcon} alt="Instagram" />
                            </a>
                        )}
                        {teacher.facebook && <a href={teacher.facebook} className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:shadow-sm" aria-label="Facebook">
                            <img src={FacebookIcon} alt="facebook" />
                        </a>}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
                        <img src={OpenIcon} alt="Open documents" className="cursor-pointer" onClick={() => {
                            // navigate to teacher profile page; keep same path usage
                            window.location.href = paths.manager.teacherProfile.getHref(teacher.id);
                        }} />
                    </div>
                </div>
            </div>
        </article>
    );
}

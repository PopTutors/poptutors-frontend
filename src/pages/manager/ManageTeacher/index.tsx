
import React, { useEffect, useState } from 'react';
import {
    Search,
    Filter,
} from 'lucide-react';
import { Dialog } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui';
import FilterDialog from './FilterDialog';
import AddTeacherDialog from './AddTeacherDialog';
import TeacherCard from './TeacherCard';
import { useFetch } from '../../../api/UseFetch';
import { useGenericMutation } from '../../../api/useGenericMutation';
import { uploadToBunnyCDN } from '../../../utils/uploadToBunnyCdn';
import type { Teacher, Filters } from './types';

// const cancelButtonClass = 'm-0 w-[164px] h-[50px] rounded-none text-[16px] font-semibold bg-[#fff]';
const saveButtonClass = 'm-0 w-[164px] h-[37px] rounded-none text-[16px] font-semibold bg-[#019ACB]';

export default function ManageTeacher(): JSX.Element {
    const [grid, setGrid] = useState(true);
    const [query, setQuery] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // form temp fields are handled inside AddTeacherDialog and passed back on submit
    const [teachers, setTeachers] = useState < Teacher[] > ([]);
    const { data: fetchResp, isLoading } = useFetch < { success: boolean; data: any[] } > (
        ['teachers'],
        '/teacher',
        true,
        {
            useTokenFromCookie: false,
            cookieName: 'token',
            onSuccessCallback: (resp) => {
                if (resp?.data) {
                    const mapped = resp.data.map((p: any) => ({
                        id: p._id,
                        name: p.userId?.name || p.name || 'Unknown',
                        subject: p.skills?.join(', ') || p.subject || 'N/A',
                        description: Array.isArray(p.experience)
                            ? p.experience.map((exp: any) => `${exp.title} at ${exp.company}`).join(', ')
                            : p.experience || p.description || 'No description',
                        image: p.profileImage || p.image,
                        rating: p.avgRating,
                        blocked: p.blocked || false,
                        linkedin: p.linkedin,
                        instagram: p.instagram,
                    }));
                    setTeachers(mapped);
                }
            },
        }
    );

    const addMutation = useGenericMutation();
    const updateMutation = useGenericMutation();
    const deleteMutation = useGenericMutation();

    // Filters
    const [tempFilters, setTempFilters] = useState < Filters > ({ status: 'all', minRating: null, subject: '' });
    const [appliedFilters, setAppliedFilters] = useState < Filters > ({ status: 'all', minRating: null, subject: '' });

    useEffect(() => {
        if (fetchResp) {
            if (Array.isArray((fetchResp as any).data)) {
                const mapped = (fetchResp as any).data.map((p: any) => ({
                    id: p._id,
                    name: p.userId?.name || p.name || 'Unknown',
                    subject: p.skills?.join(', ') || p.subject || 'N/A',
                    description: p.experience || p.description || 'No description',
                    image: p.profileImage || p.image,
                    rating: p.avgRating,
                    blocked: p.blocked || false,
                    linkedin: p.linkedin,
                    instagram: p.instagram,
                }));
                setTeachers(mapped);
            } else if (Array.isArray(fetchResp)) {
                setTeachers(fetchResp as any);
            } else if ((fetchResp as any).data && Array.isArray((fetchResp as any).data)) {
                setTeachers((fetchResp as any).data);
            }
        }
    }, [fetchResp]);

    // Add teacher handler (called by AddTeacherDialog)
    const handleAddTeacher = async (payload: any, imageFile?: File | null, onDone?: () => void) => {
        let imageUrl: string | undefined = undefined;

        if (imageFile) {
            try {
                const uploadRes = await uploadToBunnyCDN({ file: imageFile, folderPath: 'teachers' });
                imageUrl = uploadRes.url;
            } catch (err: any) {
                alert(`Image upload failed: ${err?.message || err}`);
                return;
            }
        }

        const body = { ...payload, profileImage: imageUrl };
        addMutation.mutate({
            endpoint: '/teacher',
            data: body,
            method: 'POST',
            requiresAuth: true,
            successMessage: 'Teacher added',
            invalidateKeys: ['teachers'],
            onSuccessCallback: (resp) => {
                const returned = resp?.data?.data ?? resp?.data;
                if (returned) {
                    if (Array.isArray(returned)) setTeachers(returned);
                    else {
                        const t: Teacher = {
                            id: returned._id || returned.id,
                            name: returned.userId?.name || returned.name || payload.name,
                            subject: returned.skills?.join(', ') || returned.subject || payload.subject,
                            description: returned.experience || returned.description || payload.description,
                            image: returned.profileImage || returned.image || imageUrl,
                            rating: returned.avgRating,
                            blocked: returned.blocked || false,
                            linkedin: returned.linkedin,
                            instagram: returned.instagram,
                        };
                        setTeachers((prev) => [t, ...prev]);
                    }
                }
                onDone?.();
                setIsAddOpen(false);
            },
        });
    };

    // Toggle block/unblock
    const handleToggleBlock = (teacher: Teacher) => {
        const newBlocked = !teacher.blocked;
        updateMutation.mutate({
            endpoint: `/teacher/${teacher.id}`,
            data: { blocked: newBlocked },
            method: 'PUT',
            requiresAuth: true,
            successMessage: newBlocked ? 'Teacher blocked' : 'Teacher unblocked',
            invalidateKeys: ['teachers'],
            onSuccessCallback: () => {
                setTeachers((prev) => prev.map((t) => (t.id === teacher.id ? { ...t, blocked: newBlocked } : t)));
            },
        });
    };

    // Delete teacher
    const handleDelete = (id: string | number) => {
        if (!confirm('Delete this teacher? This action cannot be undone.')) return;
        deleteMutation.mutate({
            endpoint: `/teacher/${id}`,
            data: null,
            method: 'DELETE',
            requiresAuth: true,
            successMessage: 'Teacher deleted',
            invalidateKeys: ['teachers'],
            onSuccessCallback: () => {
                setTeachers((prev) => prev.filter((t) => t.id !== id));
            },
        });
    };

    // Filtering + searching
    const filterByQuery = (t: Teacher) => t.name.toLowerCase().includes(query.toLowerCase());
    const visibleTeachers = teachers.filter((t) => {
        if (!filterByQuery(t)) return false;

        if (appliedFilters.subject.trim()) {
            const sub = appliedFilters.subject.toLowerCase();
            const subjectMatch = (t.subject || '').toLowerCase().includes(sub) || (t.description || '').toLowerCase().includes(sub) || (t.name || '').toLowerCase().includes(sub);
            if (!subjectMatch) return false;
        }

        if (appliedFilters.status === 'active' && t.blocked) return false;
        if (appliedFilters.status === 'blocked' && !t.blocked) return false;

        if (appliedFilters.minRating && typeof t.rating === 'number') {
            if (t.rating < appliedFilters.minRating) return false;
        }
        if (appliedFilters.minRating && typeof t.rating !== 'number') return false;

        return true;
    });

    const addBusy = !!(addMutation && (addMutation as any).isLoading);
    const activeFilterCount = (appliedFilters.status !== 'all' ? 1 : 0) + (appliedFilters.minRating ? 1 : 0) + (appliedFilters.subject ? 1 : 0);

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto px-6 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Total {visibleTeachers.length} Teachers</h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search..."
                                className="h-9 w-64 border border-border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)]"
                                aria-label="Search teachers"
                            />
                        </div>

                        <button
                            type="button"
                            aria-label="Filter"
                            onClick={() => { setTempFilters(appliedFilters); setIsFilterOpen(true); }}
                            className="relative h-9 border border-border bg-card px-3 text-sm hover:bg-muted flex items-center gap-2"
                        >
                            <Filter className="size-4" />
                            {activeFilterCount > 0 && <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 rounded-full text-xs bg-[var(--brand-primary)] text-white">{activeFilterCount}</span>}
                        </button>

                        <div className="flex bg-muted items-center h-[48px]">
                            <button type="button" onClick={() => setIsAddOpen(true)} className={`${saveButtonClass} text-white`}>
                                <span>+ Add Teacher</span>
                            </button>
                        </div>
                    </div>
                </div>

                <FilterDialog
                    open={isFilterOpen}
                    tempFilters={tempFilters}
                    setTempFilters={setTempFilters}
                    onApply={() => { setAppliedFilters(tempFilters); setIsFilterOpen(false); }}
                    onReset={() => { const reset = { status: 'all', minRating: null, subject: '' } as Filters; setTempFilters(reset); setAppliedFilters(reset); setIsFilterOpen(false); }}
                />

                <AddTeacherDialog
                    open={isAddOpen}
                    onClose={() => setIsAddOpen(false)}
                    onAdd={(payload, file, done) => handleAddTeacher(payload, file, done)}
                    busy={addBusy}
                />

                {/* All Teachers grid */}
                <section className="mb-8">
                    <h3 className="text-[16px] font-epilogue font-medium mb-4">All Teacher's</h3>
                    <div className={`grid gap-8 ${grid ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {isLoading ? <div>Loading...</div> : visibleTeachers.map((t) => (
                            <TeacherCard key={t.id} teacher={t} onBlockToggle={handleToggleBlock} onDelete={handleDelete} />
                        ))}
                    </div>
                </section>

                {/* Recently added */}
                <section>
                    <h3 className="text-[16px] font-epilogue font-medium mb-4">Recently added</h3>
                    <div className={`grid gap-8 ${grid ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {visibleTeachers.map((t) => (
                            <TeacherCard key={`recent-${t.id}`} teacher={t} onBlockToggle={handleToggleBlock} onDelete={handleDelete} />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

// ManageTeacher.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  MoreVertical,
  ShieldOff,
  Info,
  Trash2,
  Linkedin,
  Instagram,
  Facebook,
  Upload,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import Textarea from '../../components/ui/textarea';
import { Button } from '../../components/ui';
import { FacebookIcon, InstagramIcon, LabelIcon, LinkedInIcon, OpenIcon } from '../../assets/managers';

// hooks (adjust paths if needed)
import { useFetch } from '../../api/UseFetch';
import { useGenericMutation } from '../../api/useGenericMutation';

// Bunny CDN uploader util (adjust path if needed)
import { uploadToBunnyCDN } from '../../utils/uploadToBunnyCdn';

type Teacher = {
  id: number | string;
  user?: any;
  name: string;
  subject: string;
  description: string;
  image?: string | null;
  rating?: number | null;
  blocked?: boolean;
  linkedin?: string;
  instagram?: string;
};

function useOnClickOutside<T extends HTMLElement>(ref: React.RefObject<T>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, [ref, handler]);
}

const cancelButtonClass = 'm-0 w-[164px] h-[50px] rounded-none text-[16px] font-semibold bg-[#fff]';
const saveButtonClass = 'm-0 w-[164px] h-[37px] rounded-none text-[16px] font-semibold bg-[#019ACB]';

function Dropdown({
  items,
  align = 'right',
}: {
  items: { key: string; label: React.ReactNode; danger?: boolean; onClick?: () => void }[];
  align?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef < HTMLDivElement | null > (null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-label="Open actions"
        onClick={() => setOpen((s) => !s)}
        className="p-1 w-8 h-8"
      >
        <MoreVertical className="size-5" />
      </button>
      {open ? (
        <div
          role="menu"
          className={`absolute z-50 mt-2 w-44 shadow-lg bg-card bg-white ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          <div className="py-1">
            {items.map((it) => (
              <button
                key={it.key}
                type="button"
                onClick={() => {
                  it.onClick?.();
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted ${it.danger ? 'text-destructive' : 'text-foreground'
                  }`}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ImageWithFallback({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [err, setErr] = useState(false);
  const showPlaceholder = !src || err;
  const placeholder =
    'https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D';

  return (
    <div
      className={`w-full h-48 md:h-52 lg:h-56 overflow-hidden bg-muted ${className ?? ''} relative`}
      aria-hidden
    >
      <img
        src={showPlaceholder ? placeholder : src!}
        alt={alt}
        onError={() => setErr(true)}
        className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
      />
    </div>
  );
}

/* ---------- TeacherCard: blocked shows only actions + image; else show rating (if exists) ---------- */
function TeacherCard({
  teacher,
  onBlockToggle,
  onDelete,
}: {
  teacher: Teacher;
  onBlockToggle: (t: Teacher) => void;
  onDelete: (id: string | number) => void;
}) {
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
              <a
                href={teacher.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted border border-border hover:shadow-sm"
                aria-label="LinkedIn"
              >
                <img src={LinkedInIcon} alt="LinkedIn" />
              </a>
            )}
            {teacher.instagram && (
              <a
                href={teacher.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted border border-border hover:shadow-sm"
                aria-label="Instagram"
              >
                <img src={InstagramIcon} alt="Instagram" />
              </a>
            )}
            <a href="#" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:shadow-sm" aria-label="Facebook">
              <img src={FacebookIcon} alt="facebook" />
            </a>
          </div>

          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
            <img src={OpenIcon} alt="Open documents" />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------- ManageTeacher (main component) ------------------- */
export default function ManageTeacher(): JSX.Element {
  const [grid, setGrid] = useState(true);
  const [query, setQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Add dialog open
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Simplified form fields (per your screenshot)
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherJobTitle, setNewTeacherJobTitle] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTeacherSalary, setNewTeacherSalary] = useState('');
  const [newTeacherSkills, setNewTeacherSkills] = useState('');
  const [newTeacherDescription, setNewTeacherDescription] = useState('');
  const [newTeacherImage, setNewTeacherImage] = useState < File | null > (null);
  const [newTeacherLinkedin, setNewTeacherLinkedin] = useState('');
  const [newTeacherInstagram, setNewTeacherInstagram] = useState('');

  // Local list (kept in sync with server via useFetch + invalidation)
  const [teachers, setTeachers] = useState < Teacher[] > ([]);

  // Fetch teachers (expects backend response { success: true, data: Teacher[] })
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
            description: p.experience || p.description || 'No description',
            image: p.profileImage || p.image,
            rating: p.avgRating || 5,
            blocked: p.blocked || false,
            linkedin: p.linkedin,
            instagram: p.instagram,
          }));
          setTeachers(mapped);
        }
      },
    }
  );

  // Generic mutations
  const addMutation = useGenericMutation();
  const updateMutation = useGenericMutation();
  const deleteMutation = useGenericMutation();

  // Helpers & filtering
  const filterByQuery = (t: Teacher) => t.name.toLowerCase().includes(query.toLowerCase());

  // Filters state & UI
  type Filters = {
    status: 'all' | 'active' | 'blocked';
    minRating: number | null;
    subject: string;
  };

  // temporary controls inside dialog
  const [tempFilters, setTempFilters] = useState < Filters > ({
    status: 'all',
    minRating: null,
    subject: '',
  });

  // applied (used by list)
  const [appliedFilters, setAppliedFilters] = useState < Filters > ({
    status: 'all',
    minRating: null,
    subject: '',
  });

  // compute visible teachers using search + applied filters
  const visibleTeachers = teachers.filter((t) => {
    // search query
    if (!filterByQuery(t)) return false;

    // subject filter (simple substring)
    if (appliedFilters.subject.trim()) {
      const sub = appliedFilters.subject.toLowerCase();
      const subjectMatch =
        (t.subject || '').toLowerCase().includes(sub) ||
        (t.description || '').toLowerCase().includes(sub) ||
        (t.name || '').toLowerCase().includes(sub);
      if (!subjectMatch) return false;
    }

    // status filter
    if (appliedFilters.status === 'active' && t.blocked) return false;
    if (appliedFilters.status === 'blocked' && !t.blocked) return false;

    // minRating filter
    if (appliedFilters.minRating && typeof t.rating === 'number') {
      if (t.rating < appliedFilters.minRating) return false;
    }
    if (appliedFilters.minRating && typeof t.rating !== 'number') {
      // if teacher has no rating but minRating is set -> exclude
      return false;
    }

    return true;
  });

  // Add teacher handler (uploads image to BunnyCDN first, then sends JSON to backend)
  const handleAddTeacher = async () => {
    if (!newTeacherName || !newTeacherSubject) {
      alert('Please enter name and subject');
      return;
    }

    let imageUrl: string | undefined = undefined;

    if (newTeacherImage) {
      try {
        const uploadRes = await uploadToBunnyCDN({
          file: newTeacherImage,
          folderPath: 'teachers',
        });
        imageUrl = uploadRes.url;
      } catch (err: any) {
        console.error('Upload to BunnyCDN failed:', err);
        alert(`Image upload failed: ${err?.message || err}`);
        return;
      }
    }

    const payload = {
      name: newTeacherName,
      jobTitle: newTeacherJobTitle,
      subject: newTeacherSubject,
      salary: newTeacherSalary,
      skills: newTeacherSkills ? newTeacherSkills.split(',').map((s) => s.trim()) : [],
      description: newTeacherDescription,
      linkedin: newTeacherLinkedin,
      instagram: newTeacherInstagram,
      profileImage: imageUrl,
    };

    addMutation.mutate({
      endpoint: '/teacher',
      data: payload,
      method: 'POST',
      requiresAuth: true,
      successMessage: 'Teacher added',
      invalidateKeys: ['teachers'],
      onSuccessCallback: (resp) => {
        const returned = resp?.data?.data ?? resp?.data;
        if (returned) {
          if (Array.isArray(returned)) setTeachers(returned);
          else {
            const t = {
              id: returned._id || returned.id,
              name: returned.userId?.name || returned.name || newTeacherName,
              subject: returned.skills?.join(', ') || returned.subject || newTeacherSubject,
              description: returned.experience || returned.description || newTeacherDescription,
              image: returned.profileImage || returned.image || imageUrl,
              rating: returned.avgRating,
              blocked: returned.blocked || false,
              linkedin: returned.linkedin,
              instagram: returned.instagram,
            } as Teacher;
            setTeachers((prev) => [t, ...prev]);
          }
        }

        setIsDialogOpen(false);
        setNewTeacherName('');
        setNewTeacherJobTitle('');
        setNewTeacherSubject('');
        setNewTeacherSalary('');
        setNewTeacherSkills('');
        setNewTeacherDescription('');
        setNewTeacherImage(null);
        setNewTeacherLinkedin('');
        setNewTeacherInstagram('');
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

  // Keep teachers state in sync when fetchResp changes (fallback)
  useEffect(() => {
    if (fetchResp) {
      // If your hook already returns the mapped shape, just set it directly:
      // setTeachers(fetchResp);
      // But to be safe, try to map if necessary:
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchResp]);

  const addBusy = !!(addMutation && (addMutation as any).isLoading);

  // Count active filters for badge
  const activeFilterCount =
    (appliedFilters.status !== 'all' ? 1 : 0) + (appliedFilters.minRating ? 1 : 0) + (appliedFilters.subject ? 1 : 0);

  // Filter dialog actions
  const handleOpenFilter = () => {
    // initialize temp filters to applied filters
    setTempFilters(appliedFilters);
    setIsFilterOpen(true);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(tempFilters);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    const reset = { status: 'all', minRating: null, subject: '' } as Filters;
    setTempFilters(reset);
    setAppliedFilters(reset);
    setIsFilterOpen(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto px-6 py-6">
        {/* Toolbar */}
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

            {/* Filter button opens filter dialog */}
            <button
              type="button"
              aria-label="Filter"
              onClick={handleOpenFilter}
              className="relative h-9 border border-border bg-card px-3 text-sm hover:bg-muted flex items-center gap-2"
            >
              <Filter className="size-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 rounded-full text-xs bg-[var(--brand-primary)] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Filter Dialog */}
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogContent className="w-full sm:max-w-md max-h-[70vh] rounded-lg overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="overflow-y-auto p-6 space-y-4">
                    <DialogHeader>
                      <DialogTitle className="text-lg">Filter teachers</DialogTitle>
                    </DialogHeader>

                    {/* Status */}
                    <div className="grid gap-2">
                      <Label>Status</Label>
                      <select
                        value={tempFilters.status}
                        onChange={(e) => setTempFilters((s) => ({ ...s, status: e.target.value as Filters['status'] }))}
                        className="h-10 border border-border rounded-md px-3"
                      >
                        <option value="all">All</option>
                        <option value="active">Active (not blocked)</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>

                    {/* Minimum rating */}
                    <div className="grid gap-2">
                      <Label>Minimum rating</Label>
                      <select
                        value={tempFilters.minRating ?? ''}
                        onChange={(e) =>
                          setTempFilters((s) => ({
                            ...s,
                            minRating: e.target.value === '' ? null : Number(e.target.value),
                          }))
                        }
                        className="h-10 border border-border rounded-md px-3"
                      >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5</option>
                      </select>
                    </div>

                    {/* Subject */}
                    <div className="grid gap-2">
                      <Label>Subject / keyword</Label>
                      <Input
                        placeholder="e.g. assignments, physics"
                        value={tempFilters.subject}
                        onChange={(e) => setTempFilters((s) => ({ ...s, subject: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <DialogFooter className="flex items-center justify-end gap-3 p-4 border-t border-border bg-card flex-shrink-0">
                    <Button variant="outline" className="m-0" onClick={handleResetFilters}>
                      Reset
                    </Button>
                    <Button onClick={handleApplyFilters} className={saveButtonClass}>
                      Apply
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex bg-muted items-center h-[48px]">
              <button
                type="button"
                onClick={() => setIsDialogOpen(true)}
                className={`${saveButtonClass} text-white`}
              >
                <span>+ Add Teacher</span>
              </button>

              {/* Add Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-full sm:max-w-2xl max-h-[80vh]  overflow-scroll">
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
                            onChange={(e) => setNewTeacherImage(e.target.files?.[0] ?? null)}
                          />
                        </label>
                      </div>

                      <form className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="full-name">Full name</Label>
                          <Input
                            id="full-name"
                            placeholder="Enter teacher full name"
                            value={newTeacherName}
                            onChange={(e) => setNewTeacherName(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="job-title">Job title</Label>
                          <Input
                            id="job-title"
                            placeholder="Enter job title"
                            value={newTeacherJobTitle}
                            onChange={(e) => setNewTeacherJobTitle(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            placeholder="Enter subject"
                            value={newTeacherSubject}
                            onChange={(e) => setNewTeacherSubject(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="salary">Salary</Label>
                          <Input
                            id="salary"
                            placeholder="Enter salary"
                            value={newTeacherSalary}
                            onChange={(e) => setNewTeacherSalary(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="skills">Require skills</Label>
                          <Input
                            id="skills"
                            placeholder="Enter required skills (comma separated)"
                            value={newTeacherSkills}
                            onChange={(e) => setNewTeacherSkills(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            placeholder="Enter description"
                            className="w-full h-28 resize-none"
                            value={newTeacherDescription}
                            onChange={(e) => setNewTeacherDescription(e.target.value)}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <div className="relative">
                            <Linkedin className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                              id="linkedin"
                              placeholder="Linkedin profile url"
                              className="pl-9 w-full"
                              value={newTeacherLinkedin}
                              onChange={(e) => setNewTeacherLinkedin(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="instagram">Instagram</Label>
                          <div className="relative">
                            <Instagram className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                              id="instagram"
                              placeholder="Instagram profile url"
                              className="pl-9 w-full"
                              value={newTeacherInstagram}
                              onChange={(e) => setNewTeacherInstagram(e.target.value)}
                            />
                          </div>
                        </div>
                      </form>
                    </div>

                    <DialogFooter className="flex items-center justify-end gap-3 p-4 border-t border-border bg-card flex-shrink-0">
                      <DialogClose asChild>
                        <Button variant="outline" className={cancelButtonClass}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={handleAddTeacher}
                        className={saveButtonClass}
                        disabled={addBusy}
                        aria-disabled={addBusy}
                      >
                        {addBusy ? 'Adding…' : 'Add Teacher'}
                      </Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Science teacher */}
        <section className="mb-8">
          <h3 className="text-[16px] font-epilogue font-medium mb-4">All Teacher's</h3>
          <div className={`grid gap-8 ${grid ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              visibleTeachers.map((t) => (
                <TeacherCard key={t.id} teacher={t} onBlockToggle={handleToggleBlock} onDelete={handleDelete} />
              ))
            )}
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

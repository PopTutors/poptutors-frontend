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
  Plus,
  Upload,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import Textarea from '../../components/ui/textarea';
import { Button } from '../../components/ui';

type Teacher = {
  id: number;
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
const saveButtonClass =
  'm-0 w-[164px] h-[50px] rounded-none text-[16px] font-semibold bg-[#019ACB]';
function Dropdown({
  items,
  align = 'right',
}: {
  items: { key: string; label: React.ReactNode; danger?: boolean; onClick?: () => void }[];
  align?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-label="Open actions"
        onClick={() => setOpen((s) => !s)}
        className="p-1 rounded-md bg-card/80 hover:bg-card border border-border"
      >
        <MoreVertical className="size-4" />
      </button>
      {open ? (
        <div
          role="menu"
          className={`absolute z-50 mt-2 w-44 rounded-md shadow-lg bg-card border border-border ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
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
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted ${
                  it.danger ? 'text-destructive' : 'text-foreground'
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
  return showPlaceholder ? (
    <img
      src={`https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D`}
      alt={alt}
      className={`${className ?? ''} object-cover`}
    />
  ) : (
    <img
      src={src! || '/placeholder.svg'}
      alt={alt}
      className={`${className ?? ''} object-cover`}
      onError={() => setErr(true)}
    />
  );
}

function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="relative">
        <ImageWithFallback
          src={teacher.image || '/placeholder.svg'}
          alt={teacher.name}
          className="w-full h-48"
        />

        {typeof teacher.rating === 'number' ? (
          <div className="absolute top-3 left-3 bg-card rounded-full h-6 px-2 flex items-center gap-1 shadow border border-border">
            <span className="text-xs font-semibold">{teacher.rating}</span>
            <Star className="size-3 text-[var(--brand-primary)]" />
          </div>
        ) : null}

        {teacher.blocked ? (
          <div className="absolute top-3 left-12 bg-card rounded-full h-6 px-2 flex items-center gap-1 shadow border border-border">
            <ShieldOff className="size-3 text-destructive" />
            <span className="text-[10px] text-muted-foreground">Blocked</span>
          </div>
        ) : null}

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
              },
              {
                key: 'report',
                label: (
                  <>
                    <Info className="size-4 text-foreground" />
                    <span>Report</span>
                  </>
                ),
              },
              {
                key: 'delete',
                danger: true,
                label: (
                  <>
                    <Trash2 className="size-4" />
                    <span>Delete Job</span>
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg mb-1 pr-2 border-r border-border">{teacher.name}</h3>
          <p className="text-sm text-muted-foreground mb-1">{teacher.subject}</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {teacher.description}
        </p>

        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="sr-only">Social links</span>
          {teacher.linkedin && (
            <a href={teacher.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="size-5" aria-label="LinkedIn" />
            </a>
          )}
          {teacher.instagram && (
            <a href={teacher.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram className="size-5" aria-label="Instagram" />
            </a>
          )}
          <Facebook className="size-5" aria-label="Facebook" />
        </div>
      </div>
    </article>
  );
}

export default function SettingsPage(): JSX.Element {
  const [grid, setGrid] = useState(true);
  const [query, setQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTeacherDescription, setNewTeacherDescription] = useState('');
  const [newTeacherImage, setNewTeacherImage] = useState<File | null>(null);
  const [newTeacherLinkedin, setNewTeacherLinkedin] = useState('');
  const [newTeacherInstagram, setNewTeacherInstagram] = useState('');

  const [scienceTeachers, setScienceTeachers] = useState<Teacher[]>([
    {
      id: 1,
      name: 'James Anderson',
      subject: 'Assignments and thesis',
      description:
        'James is a highly trained human-like teacher to help you write your thesis and school.',
      image: '/teacher-portrait-blue-background.jpg',
      rating: 5,
      linkedin: 'https://www.linkedin.com/in/jamesanderson',
      instagram: 'https://www.instagram.com/jamesanderson',
    },
    {
      id: 2,
      name: 'James Anderson',
      subject: 'Assignments and thesis',
      description:
        'James is a highly trained human-like teacher to help you write your thesis and school.',
      image: '/smiling-male-teacher.jpg',
      blocked: true,
    },
    {
      id: 3,
      name: 'James Anderson',
      subject: 'Assignments and thesis',
      description:
        'James is a highly trained human-like teacher to help you write your thesis and school.',
      image: '/teacher-glass-wall.jpg',
    },
  ]);

  const [recentlyAdded, setRecentlyAdded] = useState<Teacher[]>([
    {
      id: 4,
      name: 'James Anderson',
      subject: 'Assignments and thesis',
      description:
        'James is a highly trained human-like teacher to help you write your thesis and school.',
      image: '/female-teacher.png',
    },
    {
      id: 5,
      name: 'James Anderson',
      subject: 'Assignments and thesis',
      description:
        'James is a highly trained human-like teacher to help you write your thesis and school.',
      image: '/male-teacher-plaid-shirt.jpg',
    },
    {
      id: 6,
      name: 'James Anderson',
      subject: 'Assignments and thesis',
      description:
        'James is a highly trained human-like teacher to help you write your thesis and school.',
      image: '/male-teacher-warm-background.jpg',
    },
  ]);

  const total = scienceTeachers.length + recentlyAdded.length;

  const filterByQuery = (t: Teacher) => t.name.toLowerCase().includes(query.toLowerCase());

  const handleAddTeacher = () => {
    if (newTeacherName && newTeacherSubject && newTeacherDescription) {
      const newTeacher: Teacher = {
        id: total + 1,
        name: newTeacherName,
        subject: newTeacherSubject,
        description: newTeacherDescription,
        image: newTeacherImage ? URL.createObjectURL(newTeacherImage) : '/placeholder.svg',
        linkedin: newTeacherLinkedin,
        instagram: newTeacherInstagram,
      };
      setRecentlyAdded((prev) => [newTeacher, ...prev]);
      setNewTeacherName('');
      setNewTeacherSubject('');
      setNewTeacherDescription('');
      setNewTeacherImage(null);
      setNewTeacherLinkedin('');
      setNewTeacherInstagram('');
      setIsDialogOpen(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto px-6 py-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          <nav aria-label="Settings sections" className="flex gap-8 border-b border-border">
            <button className="pb-3 text-muted-foreground hover:text-foreground">Overview</button>
            <button className="pb-3 text-muted-foreground hover:text-foreground">
              Social Links
            </button>
            <button className="relative pb-3 text-[#141414] font-medium">
              Manage Teacher
              <span className="border-b border-[#019ACB] absolute -bottom-[1px] left-0 h-[2px] w-full bg-[var(--brand-primary)]" />
            </button>
          </nav>
        </header>

        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Total {total} Teachers</h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="h-9 w-64 rounded-md border border-border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-primary)]"
                aria-label="Search teachers"
              />
            </div>

            <button
              type="button"
              aria-label="Filter"
              className="h-9 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted flex items-center gap-2"
            >
              <Filter className="size-4" />
            </button>

            <div className="flex bg-muted rounded-md p-1">
              <button
                onClick={() => setGrid(true)}
                className={`p-1 rounded ${grid ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="size-4" />
              </button>
              <button
                onClick={() => setGrid(false)}
                className={`p-1 rounded ${!grid ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
                aria-label="List view"
              >
                <List className="size-4" />
              </button>
              {/* visible button that explicitly opens the dialog */}
              <button
                type="button"
                onClick={() => setIsDialogOpen(true)}
                className={`${saveButtonClass} text-white ml-2`}
              >
                <span>+ Add Teacher</span>
              </button>
              {/* ===== Dialog wraps both Trigger and Content so button opens the dialog ===== */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[700px] h-scroll overflow-y-auto">
                  <DialogHeader className="pb-2">
                    <DialogTitle className="text-xl">Add new teacher</DialogTitle>
                  </DialogHeader>

                  <div className="flex items-center gap-3 pb-2">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D"
                      alt="Teacher avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <label className="h-9 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted inline-flex items-center gap-2 cursor-pointer">
                      <Upload className="size-4" />
                      <span>Upload Photo</span>
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
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="job-title">Job title</Label>
                      <Input
                        id="job-title"
                        placeholder="Enter job title"
                        value={newTeacherSubject}
                        onChange={(e) => setNewTeacherSubject(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Enter subject"
                        value={newTeacherSubject}
                        onChange={(e) => setNewTeacherSubject(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="salary">Salary</Label>
                      <Input id="salary" placeholder="Enter salary" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="skills">Require skills</Label>
                      <Input id="skills" placeholder="Enter required skills" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Enter description"
                        className="h-2"
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
                          className="pl-9"
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
                          className="pl-9"
                          value={newTeacherInstagram}
                          onChange={(e) => setNewTeacherInstagram(e.target.value)}
                        />
                      </div>
                    </div>
                  </form>

                  <DialogFooter className="pt-2">
                    <DialogClose asChild>
                      <Button variant="outline" className={cancelButtonClass}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button onClick={handleAddTeacher} className={saveButtonClass}>
                      Save & Change
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Science teacher */}
        <section className="mb-8">
          <h3 className="text-lg font-medium mb-4">Science teacher</h3>
          <div
            className={`grid gap-8 ${grid ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          >
            {scienceTeachers.filter(filterByQuery).map((t) => (
              <TeacherCard key={t.id} teacher={t} />
            ))}
          </div>
        </section>

        {/* Recently added */}
        <section>
          <h3 className="text-lg font-medium mb-4">Recently added</h3>
          <div
            className={`grid gap-8 ${grid ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          >
            {recentlyAdded.filter(filterByQuery).map((t) => (
              <TeacherCard key={t.id} teacher={t} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

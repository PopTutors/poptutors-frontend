import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { X as XIcon, Edit2 as EditIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../../components/ui/dialog";
import { useFetch } from "../../api";
import { useGenericMutation } from "../../api/useGenericMutation";

/**
 * JobDetails page
 * - reads :id and :type from params
 * - shows description, meta grid, right column summary & required skills
 * - Edit Job Details opens dialog with prefilled form
 *
 * Note: adapt update API call in handleSave to your backend (this simulation just closes dialog).
 */

type ServiceType = "assignment" | "session" | "liveHelp";

type JobData = {
    _id: string;
    title?: string;
    description?: string;
    subject?: string;
    topic?: string;
    expertiseLevel?: string;
    additionalServices?: string;
    language?: string;
    skills?: string[]; // tags
    timeframe?: string;
    budgetMin?: number;
    budgetMax?: number;
    studentPrice?: number;
    teacherPrice?: number;
    university?: string;
    courseCode?: string;
    chooseTime?: string;
    postedAt?: string | Date;
    jobType?: string;
};

const pill = "inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm mr-2 mb-2";

export default function JobDetailsPage(): JSX.Element {
    const { id: jobId, type } = useParams < { id: string; type: ServiceType } > ();

    // fetch job item (replace endpoint to your API shape)
    const { data, isLoading, error } = useFetch(
        ["job", jobId, type],
        `/manager-dashboard/job/${jobId}?type=${type}`,
        true,
        { requiresAuth: true }
    );

    // Normalized job object for UI
    const job: JobData = useMemo(() => {
        const d = data ?? {};
        // make sure skills is array
        return {
            _id: d._id ?? jobId,
            title: d.title ?? d.subject ?? "Untitled Job",
            description: d.description ?? d.details ?? d.metadata?.topic ?? "",
            subject: d.subject ?? d.metadata?.subject ?? "",
            topic: d.topic ?? d.metadata?.topic ?? "",
            expertiseLevel: d.expertiseLevel ?? d.metadata?.expertise ?? "",
            additionalServices: d.additionalServices ?? d.metadata?.additionalServices ?? "",
            language: d.language ?? d.metadata?.language ?? "",
            skills: Array.isArray(d.skills) ? d.skills : (d.metadata?.skills ?? d.skills ?? []),
            timeframe: d.timeframe ?? d.metadata?.timeframe ?? "",
            budgetMin: d.budgetMin ?? d.studentPrice ?? d.budget?.min ?? undefined,
            budgetMax: d.budgetMax ?? d.teacherPrice ?? d.budget?.max ?? undefined,
            studentPrice: d.studentPrice ?? d.studentPrice ?? undefined,
            teacherPrice: d.teacherPrice ?? d.teacherPrice ?? undefined,
            university: d.university ?? d.metadata?.university ?? "",
            courseCode: d.courseCode ?? d.metadata?.courseCode ?? "",
            chooseTime: d.chooseTime ?? d.metadata?.scheduledDateTime ?? "",
            postedAt: d.postedAt ?? d.createdAt ?? d.postedAt ?? undefined,
            jobType: d.jobType ?? d.type ?? (type === "liveHelp" ? "Live Help" : type === "session" ? "Session" : "Assignment"),
        } as JobData;
    }, [data, jobId, type]);

    // Edit dialog state
    const [openEdit, setOpenEdit] = useState(false);

    // form state
    const [form, setForm] = useState < JobData > ({
        _id: job._id ?? "",
        title: "",
        description: "",
        subject: "",
        topic: "",
        expertiseLevel: "",
        additionalServices: "",
        language: "",
        skills: [],
        timeframe: "",
        budgetMin: undefined,
        budgetMax: undefined,
        studentPrice: undefined,
        teacherPrice: undefined,
        university: "",
        courseCode: "",
        chooseTime: "",
        postedAt: undefined,
        jobType: job.jobType,
    });

    useEffect(() => {
        // when job loads, populate form
        if (job) {
            setForm({
                _id: job._id,
                title: job.title,
                description: job.description,
                subject: job.subject,
                topic: job.topic,
                expertiseLevel: job.expertiseLevel,
                additionalServices: job.additionalServices,
                language: job.language,
                skills: job.skills ?? [],
                timeframe: job.timeframe,
                budgetMin: job.budgetMin,
                budgetMax: job.budgetMax,
                studentPrice: job.studentPrice,
                teacherPrice: job.teacherPrice,
                university: job.university,
                courseCode: job.courseCode,
                chooseTime: job.chooseTime,
                postedAt: job.postedAt,
                jobType: job.jobType,
            });
        }
    }, [job]);

    const addSkill = (s: string) => {
        if (!s) return;
        setForm((f) => ({ ...f, skills: Array.from(new Set([...(f.skills ?? []), s])) }));
    };
    const removeSkill = (s: string) => {
        setForm((f) => ({ ...f, skills: (f.skills ?? []).filter((t) => t !== s) }));
    };

    // Save handler - wire to real update API as needed
    const { mutate, isLoadingP } = useGenericMutation < any > ();

    const handleSave = () => {
        mutate({
            endpoint: `/manager-dashboard/job/${form._id}?type=${type}`, // ✅ correct endpoint
            data: form, // ✅ updated job details
            method: "PUT", // updating job
            requiresAuth: true, // include auth header
            successMessage: "Job updated successfully!",
            errorMessage: "Failed to update job",
            invalidateKeys: ["job", form._id, type], // ✅ invalidate this job query so useFetch refetches
            onSuccessCallback: (res) => {
                console.log("Job Updated:", res);
                setOpenEdit(false);
            },
            onErrorCallback: (err) => {
                console.error("Error updating job:", err);
                alert(err?.message || "Failed to save changes");
            },
        });
    };

    if (isLoading) {
        return <div className="p-6">Loading job details...</div>;
    }
    if (error) {
        return <div className="p-6 text-red-500">Failed to load job details</div>;
    }

    return (
        <div>
            <div className="flex items-start justify-between mb-6">
                <h2 className="text-[20px] font-epilogue font-semibold">{job.title}</h2>

                <div>
                    <button
                        onClick={() => setOpenEdit(true)}
                        className="flex items-center gap-2 px-3 py-2 border bg-white hover:bg-gray-50 text-sm"
                    >
                        <EditIcon className="w-4 h-4" />
                        Edit Job Details
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main column (left two-thirds) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description card */}
                    <div className="bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="font-semibold font-epilogue mb-3">Description</h3>
                        <p className="text-[16px] font-inter text-gray-700 leading-relaxed">{job.description || "No description provided."}</p>
                    </div>

                    {/* Meta grid */}
                    <div className="bg-white p-6 shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <div className="text-xs text-gray-400">Academic Subjects</div>
                                <div className="text-sm text-gray-900 mt-2">{job.subject || "—"}</div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400">Topic</div>
                                <div className="text-sm text-gray-900 mt-2">{job.topic || "—"}</div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400">Expertise Levels</div>
                                <div className="text-sm text-gray-900 mt-2">{job.expertiseLevel || "—"}</div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400">Additional Services</div>
                                <div className="text-sm text-gray-900 mt-2">{job.additionalServices || "—"}</div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400">Language Support</div>
                                <div className="text-sm text-gray-900 mt-2">{job.language || "—"}</div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400">Skills</div>
                                <div className="text-sm text-gray-900 mt-2">
                                    {(job.skills ?? []).length ? (
                                        <div className="flex flex-wrap">
                                            {(job.skills ?? []).map((s) => (
                                                <span key={s} className="text-sm text-gray-700 mr-3 mb-2">{s}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">—</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400">Timeframe for Completion</div>
                                <div className="text-sm text-gray-900 mt-2">{job.timeframe || "—"}</div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400">Budget</div>
                                <div className="text-sm text-gray-900 mt-2">
                                    {job.budgetMin || job.budgetMax ? (
                                        `${job.budgetMin ? `$${job.budgetMin}` : ""}${job.budgetMax ? ` - $${job.budgetMax}` : ""}`
                                    ) : (
                                        <span className="text-gray-500">—</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400">University</div>
                                <div className="text-sm text-gray-900 mt-2">{job.university || "—"}</div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400">Course Code</div>
                                <div className="text-sm text-gray-900 mt-2">{job.courseCode || "—"}</div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400">Choose Time</div>
                                <div className="text-sm text-gray-900 mt-2">{job.chooseTime || "—"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column (summary) */}
                <div className="space-y-6">
                    <div className="bg-white p-5 shadow-sm border border-gray-100">
                        <h4 className="font-semibold mb-3">Description</h4>
                        <div className="text-sm text-gray-600">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Job Posted On:</span>
                                <span>{job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "—"}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Job Type:</span>
                                <span>{job.jobType || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Budgets:</span>
                                <span>
                                    {job.studentPrice ? `Student: $${job.studentPrice}` : ""}
                                    {job.teacherPrice ? `${job.studentPrice ? " " : ""} Teacher: $${job.teacherPrice}` : ""}
                                    {!job.studentPrice && !job.teacherPrice && <span className="text-gray-500">—</span>}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 shadow-sm border border-gray-100">
                        <h4 className="font-semibold mb-3">Required Skills</h4>
                        <div>
                            {(job.skills ?? []).length ? (
                                <div className="flex flex-wrap">
                                    {(job.skills ?? []).map((s) => (
                                        <div key={s} className="px-3 py-1 mr-2 mb-2 bg-blue-50 text-blue-700 rounded">{s}</div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500">No skills listed</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="max-w-3xl w-full">
                    <DialogHeader>
                        <div className="flex items-start justify-between w-full">
                            <DialogTitle className="text-lg font-semibold">Edit Job Details</DialogTitle>
                            <DialogClose asChild>
                                <button className="p-1 hover:bg-gray-100">
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </DialogClose>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                value={form.title ?? ""}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={form.description ?? ""}
                                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                rows={5}
                                className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600">Subject</label>
                                <input
                                    value={form.subject ?? ""}
                                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600">Topic</label>
                                <input
                                    value={form.topic ?? ""}
                                    onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600">Expertise Level</label>
                                <select
                                    value={form.expertiseLevel ?? ""}
                                    onChange={(e) => setForm((f) => ({ ...f, expertiseLevel: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                                >
                                    <option value="">Select</option>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                    <option>Expert</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600">Language</label>
                                <input
                                    value={form.language ?? ""}
                                    onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600">Timeframe</label>
                                <input
                                    value={form.timeframe ?? ""}
                                    onChange={(e) => setForm((f) => ({ ...f, timeframe: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600">Choose Time</label>
                                <input
                                    type="datetime-local"
                                    value={form.chooseTime ?? ""}
                                    onChange={(e) => setForm((f) => ({ ...f, chooseTime: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600">Budget Min</label>
                                <input
                                    type="number"
                                    value={form.budgetMin ?? ""}
                                    onChange={(e) => setForm((f) => ({ ...f, budgetMin: e.target.value ? Number(e.target.value) : undefined }))}
                                    className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Budget Max</label>
                                <input
                                    type="number"
                                    value={form.budgetMax ?? ""}
                                    onChange={(e) => setForm((f) => ({ ...f, budgetMax: e.target.value ? Number(e.target.value) : undefined }))}
                                    className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">University</label>
                                <input
                                    value={form.university ?? ""}
                                    onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        {/* Skills tags editor */}
                        <div>
                            <label className="block text-sm text-gray-600">Skills (press Enter to add)</label>
                            <SkillsInput
                                initialTags={form.skills ?? []}
                                onChange={(tags) => setForm((f) => ({ ...f, skills: tags }))}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setOpenEdit(false)}
                                className="px-4 py-2 border bg-white text-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="px-4 py-2 bg-primary text-white text-sm hover:opacity-95"
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

/* Small skills input helper component */
function SkillsInput({ initialTags, onChange }: { initialTags?: string[]; onChange: (tags: string[]) => void }) {
    const [tags, setTags] = useState < string[] > (initialTags ?? []);
    const [value, setValue] = useState("");

    useEffect(() => setTags(initialTags ?? []), [initialTags]);

    useEffect(() => onChange(tags), [tags, onChange]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            const v = value.trim();
            if (!v) return;
            if (!tags.includes(v)) setTags((t) => [...t, v]);
            setValue("");
        } else if (e.key === "Backspace" && !value && tags.length) {
            setTags((t) => t.slice(0, -1));
        }
    }

    return (
        <div className="mt-2">
            <div className="flex flex-wrap items-center gap-2">
                {tags.map((t) => (
                    <div key={t} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        <span>{t}</span>
                        <button
                            type="button"
                            onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            ×
                        </button>
                    </div>
                ))}
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add skill and press Enter"
                    className="min-w-[160px] border border-gray-200 px-2 py-1 text-sm"
                />
            </div>
        </div>
    );
}

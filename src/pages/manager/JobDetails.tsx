import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { X as XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../../components/ui/dialog";
import { useFetch } from "../../api";
import { useGenericMutation } from "../../api/useGenericMutation";
import { ManagerEditIcon } from "../../assets/managers";

/** Types */
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
    skills?: string[];
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
    // free-form meta stored as key: value pairs
    meta?: Record<string, any>;
};

/** Field definition for dynamic meta */
type DynamicField = {
    id: string; // unique id for UI
    key: string; // actual key to save in meta
    label: string;
    type: "text" | "number" | "datetime" | "select";
    value?: any;
    options?: string[]; // for select
    group?: string; // optional grouping (left/center/right)
};

const pill = "font-medium text-[16px] bg-[#019ACB14] text-[#019ACB] px-[12px] py-[4px] ";

/** Helper to generate simple unique id */
const uid = (prefix = "") => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

export default function JobDetailsPage(): JSX.Element {
    const { id: jobId, type } = useParams < { id: string; type: ServiceType } > ();

    const { data, isLoading, error } = useFetch(
        ["job", jobId, type],
        `/manager-dashboard/job/${jobId}?type=${type}`,
        true,
        { requiresAuth: true }
    );

    const job: JobData = useMemo(() => {
        const d = data ?? {};
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
            meta: d.metadata ?? d.meta ?? {},
        } as JobData;
    }, [data, jobId, type]);

    // Edit dialog + navigation tabs
    const [openEdit, setOpenEdit] = useState(false);
    const tabs = ["Description", "Meta", "Budget & Scheduling", "Skills"];
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    // form overall
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
        meta: {},
    });

    // dynamic fields for Meta tab
    const [dynamicFields, setDynamicFields] = useState < DynamicField[] > ([]);

    // populate form when job loads
    useEffect(() => {
        if (job) {
            setForm((f) => ({
                ...f,
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
                meta: job.meta ?? {},
            }));
            // initialize dynamicFields from meta keys (if present)
            const meta = job.meta ?? {};
            const keys = Object.keys(meta);
            if (keys.length) {
                setDynamicFields(
                    keys.map((k) => ({
                        id: uid("f_"),
                        key: k,
                        label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                        type: typeof meta[k] === "number" ? "number" : k.toLowerCase().includes("date") || k.toLowerCase().includes("time") ? "datetime" : "text",
                        value: meta[k],
                        group: "left",
                    }))
                );
            } else {
                // default meta fields if none provided
                setDynamicFields([
                    { id: uid("f_"), key: "university", label: "University", type: "text", value: job.university ?? "", group: "center" },
                    { id: uid("f_"), key: "course_code", label: "Course Code", type: "text", value: job.courseCode ?? "", group: "center" },
                    { id: uid("f_"), key: "timeframe", label: "Timeframe", type: "text", value: job.timeframe ?? "", group: "right" },
                ]);
            }
        }
    }, [job]);

    // Skills helpers (keeps in sync with form.skills)
    const addSkill = (s: string) => {
        if (!s) return;
        setForm((f) => ({ ...f, skills: Array.from(new Set([...(f.skills ?? []), s])) }));
    };
    const removeSkill = (s: string) => {
        setForm((f) => ({ ...f, skills: (f.skills ?? []).filter((t) => t !== s) }));
    };

    // dynamic field CRUD
    const addDynamicField = (type: DynamicField["type"] = "text") => {
        const newF: DynamicField = {
            id: uid("f_"),
            key: `meta_${uid("")}`,
            label: "New Field",
            type,
            value: type === "number" ? 0 : "",
            options: type === "select" ? ["Option 1", "Option 2"] : undefined,
            group: "center",
        };
        setDynamicFields((s) => [...s, newF]);
    };

    const updateDynamicField = (id: string, patch: Partial<DynamicField>) => {
        setDynamicFields((s) => s.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    };

    const removeDynamicFieldById = (id: string) => {
        setDynamicFields((s) => s.filter((f) => f.id !== id));
    };

    // Keep dynamic field values in sync with form.meta
    useEffect(() => {
        const newMeta: Record<string, any> = { ...(form.meta ?? {}) };
        dynamicFields.forEach((f) => {
            newMeta[f.key] = f.value;
        });
        setForm((prev) => ({ ...prev, meta: newMeta }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dynamicFields]);

    // mutation
    const { mutate, isLoadingP } = useGenericMutation < any > ();

    const handleSave = () => {
        // build payload: form + meta from dynamic fields
        const payload = {
            ...form,
            meta: { ...(form.meta ?? {}) },
        };
        // ensure dynamic fields keys are reflected
        dynamicFields.forEach((f) => {
            payload.meta[f.key] = f.value;
        });

        mutate({
            endpoint: `/manager-dashboard/job/${form._id}?type=${type}`,
            data: payload,
            method: "PUT",
            requiresAuth: true,
            successMessage: "Job updated successfully!",
            errorMessage: "Failed to update job",
            invalidateKeys: ["job", form._id, type],
            onSuccessCallback: (res) => {
                setOpenEdit(false);
                // reset to first tab next time
                setActiveTabIndex(0);
            },
            onErrorCallback: (err) => {
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
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <h2 className="text-[20px] text-[#141414] font-semibold">{job.title}</h2>
                <div>
                    <button
                        onClick={() => {
                            setOpenEdit(true);
                            setActiveTabIndex(0);
                        }}
                        className="flex items-center gap-2 px-[16px] py-[12px] border bg-white hover:bg-gray-50 text-[16px] font-medium font-inter text-[#019ACB]"
                    >
                        <div className="w-[20px] h-[20px] fill-[#019ACB]" >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.2559 4.8989L15.1011 2.74408C14.7757 2.41864 14.248 2.41864 13.9226 2.74408L2.74408 13.9226C2.5878 14.0788 2.5 14.2908 2.5 14.5118V17.5H5.48816C5.70917 17.5 5.92113 17.4122 6.07741 17.2559L17.2559 6.07741C17.5813 5.75197 17.5813 5.22434 17.2559 4.8989Z" stroke="#019ACB" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M10 17.5H15" stroke="#019ACB" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.0833 4.58325L15.4166 7.91658" stroke="#019ACB" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        Edit Job Details
                    </button>
                </div>
            </div>

            {/* Layout: main + right column */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main column (span 2) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description card */}
                    <div className="bg-white p-6 shadow-sm border border-gray-100">
                        <h3 className="font-semibold text-[18px] mb-3 text-[#141414] font-poppins">Description</h3>
                        <p className="text-[16px] text-[#434343] leading-relaxed font-inter">{job.description || "No description provided."}</p>
                    </div>

                    {/* Meta grid (render dynamicFields grouped into 3 columns) */}
                    <div className="bg-white p-6 shadow-sm border border-gray-100">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            {["left", "center", "right"].map((g) => (
                                <div key={g}>
                                    {dynamicFields.filter((f) => (f.group ?? "center") === g).length ? (
                                        dynamicFields
                                            .filter((f) => (f.group ?? "center") === g)
                                            .map((f) => (
                                                <div key={f.id} className="mb-4">
                                                    <div className="text-[14px] text-[#141414] font-inter font-medium">{f.label}</div>
                                                    <div className="text-[14px] text-[#8E8E93] font-inter mt-2">
                                                        {f.type === "datetime" ? (f.value ? new Date(f.value).toLocaleString() : "—") : String(f.value ?? "—")}
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <div className="text-[#8E8E93] italic">—</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    <div className="bg-white p-5 shadow-sm border border-gray-100">
                        <h4 className="font-semibold text-[18px] mb-3 text-[#141414] font-poppins">Timeline and Budget</h4>
                        <div className="text-sm text-gray-600">
                            <div className="flex justify-between mb-2">
                                <span className="text-[#515B6F] text-[16px] font-inter">Job Posted On:</span>
                                <span className="text-[#141414] text-[16px] font-inter font-semibold">{job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "—"}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-[#515B6F] text-[16px] font-inter">Job Type:</span>
                                <span className="text-[#141414] text-[16px] font-inter font-semibold">{job.jobType || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#515B6F] text-[16px] font-inter">Budgets:</span>
                                <span className="text-[#141414] text-[16px] font-inter font-semibold">
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
                            {(["Project Management"]).length ? (
                                <div className="flex flex-wrap">
                                    {(["Project Management"]).map((s) => (
                                        <div key={s} className={pill}>
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500">No skills listed</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Dialog with tabs and forward/back navigation */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent className="max-w-4xl w-full p-6">
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

                    <div className="mt-4">
                        {/* Tabs header */}
                        <div className="flex items-center gap-3 border-b pb-3 mb-4 overflow-auto">
                            {tabs.map((t, i) => (
                                <button
                                    key={t}
                                    onClick={() => setActiveTabIndex(i)}
                                    className={`px-3 py-1 rounded text-sm ${i === activeTabIndex ? "bg-primary text-white" : "text-gray-600 bg-gray-50"}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div className="space-y-4">
                            {activeTabIndex === 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        value={form.title ?? ""}
                                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                                    />

                                    <label className="block text-sm font-medium text-gray-700 mt-4">Description</label>
                                    <textarea
                                        rows={5}
                                        value={form.description ?? ""}
                                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                        className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                                    />
                                </div>
                            )}

                            {activeTabIndex === 1 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm font-medium text-gray-700">Meta fields</div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => addDynamicField("text")} className="px-2 py-1 text-sm border bg-white">+ Add text</button>
                                            <button onClick={() => addDynamicField("number")} className="px-2 py-1 text-sm border bg-white">+ Add number</button>
                                            <button onClick={() => addDynamicField("datetime")} className="px-2 py-1 text-sm border bg-white">+ Add date</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {dynamicFields.map((f) => (
                                            <div key={f.id} className="flex items-start gap-3 border p-3 rounded">
                                                <div className="flex-1">
                                                    <div className="flex gap-2 items-center">
                                                        <input
                                                            value={f.label}
                                                            onChange={(e) => updateDynamicField(f.id, { label: e.target.value })}
                                                            className="block w-1/3 border border-gray-200 px-2 py-1 text-sm"
                                                            placeholder="Label"
                                                        />
                                                        <input
                                                            value={f.key}
                                                            onChange={(e) => updateDynamicField(f.id, { key: e.target.value })}
                                                            className="block w-1/3 border border-gray-200 px-2 py-1 text-sm"
                                                            placeholder="Key (used in payload)"
                                                        />
                                                        <select
                                                            value={f.type}
                                                            onChange={(e) => updateDynamicField(f.id, { type: e.target.value as DynamicField["type"] })}
                                                            className="block w-1/6 border border-gray-200 px-2 py-1 text-sm"
                                                        >
                                                            <option value="text">Text</option>
                                                            <option value="number">Number</option>
                                                            <option value="datetime">Date/Time</option>
                                                            <option value="select">Select</option>
                                                        </select>

                                                        <select
                                                            value={f.group ?? "center"}
                                                            onChange={(e) => updateDynamicField(f.id, { group: e.target.value })}
                                                            className="block w-1/6 border border-gray-200 px-2 py-1 text-sm"
                                                        >
                                                            <option value="left">Left</option>
                                                            <option value="center">Center</option>
                                                            <option value="right">Right</option>
                                                        </select>
                                                    </div>

                                                    <div className="mt-2">
                                                        {f.type === "text" && (
                                                            <input
                                                                value={f.value ?? ""}
                                                                onChange={(e) => updateDynamicField(f.id, { value: e.target.value })}
                                                                className="block w-full border border-gray-200 px-2 py-1 text-sm"
                                                            />
                                                        )}
                                                        {f.type === "number" && (
                                                            <input
                                                                type="number"
                                                                value={f.value ?? ""}
                                                                onChange={(e) => updateDynamicField(f.id, { value: e.target.value ? Number(e.target.value) : undefined })}
                                                                className="block w-full border border-gray-200 px-2 py-1 text-sm"
                                                            />
                                                        )}
                                                        {f.type === "datetime" && (
                                                            <input
                                                                type="datetime-local"
                                                                value={f.value ?? ""}
                                                                onChange={(e) => updateDynamicField(f.id, { value: e.target.value })}
                                                                className="block w-full border border-gray-200 px-2 py-1 text-sm"
                                                            />
                                                        )}
                                                        {f.type === "select" && (
                                                            <div className="flex gap-2">
                                                                <input
                                                                    value={f.options?.join(",") ?? ""}
                                                                    onChange={(e) => updateDynamicField(f.id, { options: e.target.value.split(",").map((s) => s.trim()) })}
                                                                    className="block w-full border border-gray-200 px-2 py-1 text-sm"
                                                                    placeholder="comma, separated, options"
                                                                />
                                                                <select
                                                                    value={String(f.value ?? (f.options && f.options[0]) ?? "")}
                                                                    onChange={(e) => updateDynamicField(f.id, { value: e.target.value })}
                                                                    className="block border border-gray-200 px-2 py-1 text-sm"
                                                                >
                                                                    {(f.options ?? []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                                                                </select>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 items-end">
                                                    <button onClick={() => removeDynamicFieldById(f.id)} className="text-sm px-3 py-1 border bg-white">Remove</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTabIndex === 2 && (
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
                                        <label className="block text-sm text-gray-600">Choose Time</label>
                                        <input
                                            type="datetime-local"
                                            value={form.chooseTime ?? ""}
                                            onChange={(e) => setForm((f) => ({ ...f, chooseTime: e.target.value }))}
                                            className="mt-1 block w-full border border-gray-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTabIndex === 3 && (
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Skills (press Enter to add)</label>
                                    <SkillsInput
                                        initialTags={form.skills ?? []}
                                        onChange={(tags) => setForm((f) => ({ ...f, skills: tags }))}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer controls */}
                        <div className="flex items-center justify-between gap-3 pt-4 border-t mt-6">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        if (activeTabIndex > 0) setActiveTabIndex((i) => i - 1);
                                        else setOpenEdit(false);
                                    }}
                                    className="px-4 py-2 border bg-white text-sm hover:bg-gray-50"
                                >
                                    {activeTabIndex > 0 ? "← Back" : "Close"}
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                {activeTabIndex < tabs.length - 1 && (
                                    <button
                                        onClick={() => setActiveTabIndex((i) => Math.min(tabs.length - 1, i + 1))}
                                        className="px-4 py-2 border bg-white text-sm hover:bg-gray-50"
                                    >
                                        Next →
                                    </button>
                                )}

                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-primary text-white text-sm hover:opacity-95"
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

/* SkillsInput same as before */
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

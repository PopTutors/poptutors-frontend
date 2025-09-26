import React, { useState, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadToBunnyCDN } from '../../../utils/uploadToBunnyCdn';
import { useGenericMutation } from '../../../api/useGenericMutation';
import toast from 'react-hot-toast';
import { Listbox, Transition } from '@headlessui/react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
    ArrowLeft,
    Bell,
    Plus,
    ChevronDown,
    ArrowRight,
    Calendar,
    Upload,
    X,
    FileText,
    Download,
    Check,
} from 'lucide-react';
import { UploadIcon } from '../../../assets/managers';
import { MultiSelect } from '../../../components/ui/multi-select';

// Custom Select Component (kept same)
function Select({ value, onChange, placeholder, children, className = '' }) {
    return (
        <Listbox value={value} onChange={onChange}>
            <div className="relative">
                <Listbox.Button
                    className={`h-12 w-full flex items-center justify-between border border-gray-300 bg-white px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
                >
                    <span className="block truncate text-gray-900">
                        {value
                            ? children.find((child) => child.props.value === value)?.props.children ||
                            value
                            : placeholder}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {children}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
function SelectItem({ value, children, className = '' }) {
    return (
        <Listbox.Option
            value={value}
            className={({ active, selected }) =>
                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                } ${className}`
            }
        >
            {({ selected }) => (
                <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {children}
                    </span>
                    {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                    ) : null}
                </>
            )}
        </Listbox.Option>
    );
}

const STEPS = [
    { id: 1, title: 'Step 1', subtitle: 'Exam details' },
    { id: 2, title: 'Step 2', subtitle: 'Book an Expert' },
    { id: 3, title: 'Step 3', subtitle: 'Upload file' },
];

export default function PostALiveHelp() {
    const router = useNavigate();

    // Stepper
    const [step, setStep] = useState(1);
    const fileInputRef = useRef(null);

    // --- Step 1 fields (updated to match screenshot)
    const [subject, setSubject] = useState('computer-science'); // Subjects
    const [topic, setTopic] = useState('case-studies'); // Topics
    const [expertise, setExpertise] = useState(''); // Expertise Levels (Backend: Beginner, Intermediate, Advanced, Expert)
    const [courseCode, setCourseCode] = useState(''); // Course Code
    const [language, setLanguage] = useState(''); // Language Support
    const [skills, setSkills] = useState(['Python', 'React Js', 'Node Js']);
    const [availableSkills] = useState([
        { label: 'Python', value: 'Python' },
        { label: 'React Js', value: 'React Js' },
        { label: 'Node Js', value: 'Node Js' },
        // add more if needed
    ]);
    const [numQuestions, setNumQuestions] = useState(''); // No. of Questions
    const [budget, setBudget] = useState(''); // Budget
    const [university, setUniversity] = useState(''); // University Name
    const [helpType, setHelpType] = useState(''); // Help Type (Backend: Certificates, Live University Help, Quiz, Live Interview)
    const [additionalServices, setAdditionalServices] = useState(''); // Additional Services (topic)
    const [professorName, setProfessorName] = useState(''); // Professor Name
    const [dateTime, setDateTime] = useState(''); // Date and Time Slot
    const [duration, setDuration] = useState(''); // Duration (hours)
    const [questionTypes, setQuestionTypes] = useState({
        mcq: true,
        writing: false,
        diagram: false,
        code: false,
    }); // Question Type checkboxes (Backend: MCQ Type, Writing Type, Diagram, Code)
    const [helpModes, setHelpModes] = useState({
        chat: true,
        call: false,
        whatsapp: false,
    }); // Help Mode checkboxes (Backend: Chat, Call, Whatsapp)

    // Step 2 & 3 related
    const [requirements, setRequirements] = useState(''); // Description / instructions (used in step 2)
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // API mutation hook — changed endpoint usage below to '/sessionas'
    const { mutate, isLoading } = useGenericMutation < { id: number; title: string } > ();

    // helpers
    const resetForm = () => {
        setStep(1);
        setSubject('computer-science');
        setTopic('case-studies');
        setExpertise('');
        setCourseCode('');
        setLanguage('');
        setSkills(['Python', 'React Js', 'Node Js']);
        setNumQuestions('');
        setBudget('');
        setUniversity('');
        setHelpType('');
        setAdditionalServices('');
        setProfessorName('');
        setDateTime('');
        setQuestionTypes({ mcq: true, writing: false, diagram: false, code: false });
        setHelpModes({ chat: true, call: false, whatsapp: false });
        setRequirements('');
        setUploadedFiles([]);
    };

    const goNext = () => setStep((s) => Math.min(STEPS.length, s + 1));
    const goPrev = () => setStep((s) => Math.max(1, s - 1));
    const goTo = (s) => setStep(s);

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files || []);
        const newFiles = files.map((file) => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2), // MB
            file,
        }));
        setUploadedFiles((prev) => [...prev, ...newFiles]);
    };
    const removeFile = (index) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleQuestionType = (key) => {
        setQuestionTypes((prev) => ({ ...prev, [key]: !prev[key] }));
    };
    const toggleHelpMode = (key) => {
        setHelpModes((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmitStep = async () => {
        if (step < STEPS.length) {
            goNext();
            return;
        }

        // Validate budget
        const budgetMatch = budget && budget.match(/\d+/);
        const pricePerHour = budgetMatch ? parseInt(budgetMatch[0]) : 0;
        if (pricePerHour <= 0) {
            toast.error('Please enter a valid budget amount');
            return;
        }

        // Validate duration
        const durationHours = duration ? parseInt(duration) : 1;
        if (durationHours <= 0) {
            toast.error('Please enter a valid duration');
            return;
        }

        // Upload files to BunnyCDN and collect URLs
        let documents = [];
        if (uploadedFiles && uploadedFiles.length > 0) {
            try {
                toast('Uploading files...');
                const uploadResults = await Promise.all(
                    uploadedFiles.map(async (f) => {
                        if (f.url) return f;
                        const result = await uploadToBunnyCDN({ file: f.file, folderPath: 'live-help' });
                        return {
                            url: result.url,
                            fileName: result.fileName,
                            fileSize: result.fileSize,
                            fileType: result.fileType,
                        };
                    })
                );
                documents = uploadResults.map(f => f.url);
            } catch (error) {
                toast.error('File upload failed. Please try again.');
                return;
            }
        }

        // Prepare payload for backend (send exact enum values)
        const payload = {
            title: topic?.trim() || 'Live Help Request',
            description: requirements?.trim() || '',
            pricePerHour,
            liveHelpHours: durationHours,
            status: 'Requested',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            documents,
            metadata: {
                subject,
                topic,
                expertise,
                courseCode,
                language,
                skills,
                numQuestions,
                university,
                helpType,
                questionTypes: Object.keys(questionTypes).filter(k => questionTypes[k]).map(k => {
                    if (k === 'mcq') return 'MCQ Type';
                    if (k === 'writing') return 'Writing Type';
                    if (k === 'diagram') return 'Diagram';
                    if (k === 'code') return 'Code';
                    return k;
                }),
                additionalServices,
                helpModes: Object.keys(helpModes).filter(k => helpModes[k]).map(k => {
                    if (k === 'chat') return 'Chat';
                    if (k === 'call') return 'Call';
                    if (k === 'whatsapp') return 'Whatsapp';
                    return k;
                }),
                scheduledDateTime: dateTime,
                professorName,
            },
        };

        mutate({
            endpoint: '/live-help',
            data: payload,
            method: 'POST',
            requiresAuth: true,
            successMessage: 'Live help request submitted successfully!',
            errorMessage: 'Failed to submit live help request',
            invalidateKeys: ['live-help'],
            onSuccessCallback: () => {
                toast.success('Live help request submitted successfully!');
                resetForm();
                setTimeout(() => {
                    router('/manager/live-help-listings');
                }, 1500);
            },
            onErrorCallback: (err) => {
                toast.error('Error submitting live help request');
                console.error('Error Creating Live Help:', err);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <div className="flex flex-col lg:flex-row px-4 md:px-8 lg:px-[72px] py-6 gap-8 lg:gap-12">
                {/* Stepper column */}
                <div className="w-full lg:w-[293px]">
                    <div className="flex flex-col relative">
                        {STEPS.map((s, i) => (
                            <div key={s.id} className="flex items-start gap-3 mb-8 relative">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full cursor-pointer z-10 ${step >= s.id ? 'bg-[#019ACB]' : 'bg-gray-200'
                                        }`}
                                    onClick={() => goTo(s.id)}
                                >
                                    <span
                                        className={`${step >= s.id ? 'text-white' : 'text-gray-600'} font-medium text-base`}
                                    >
                                        {s.id}
                                    </span>
                                </div>
                                <div className="flex flex-col pt-2">
                                    <span className={`${step === s.id ? 'text-[#019ACB]' : 'text-[#141414]'} font-medium text-base text-[16px]`}>
                                        {s.title}
                                    </span>
                                    <span className="text-[#141414] text-[16px]">{s.subtitle}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`absolute left-5 top-12 w-0.5 h-8 ${step > s.id ? 'bg-[#019ACB]' : 'bg-gray-200'}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: step content */}
                <div className="flex-1 max-w-4xl">
                    <div className="bg-white border border-gray-200 p-8">
                        {/* Step 1: Exam / Session Details */}
                        {step === 1 && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Subjects</label>
                                        <Select value={subject} onChange={setSubject} placeholder="Select Subject">
                                            <SelectItem value="computer-science">Computer Science</SelectItem>
                                            <SelectItem value="mathematics">Mathematics</SelectItem>
                                            <SelectItem value="physics">Physics</SelectItem>
                                            <SelectItem value="chemistry">Chemistry</SelectItem>
                                            <SelectItem value="biology">Biology</SelectItem>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Topics</label>
                                        <Select value={topic} onChange={setTopic} placeholder="Select Topic">
                                            <SelectItem value="case-studies">Case Studies</SelectItem>
                                            <SelectItem value="algorithms">Algorithms</SelectItem>
                                            <SelectItem value="data-structures">Data Structures</SelectItem>
                                            <SelectItem value="machine-learning">Machine Learning</SelectItem>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Expertise Levels</label>
                                        <Select value={expertise} onChange={setExpertise} placeholder="Select Expertise Level">
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                            <SelectItem value="Expert">Expert</SelectItem>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Course Code</label>
                                        <Input
                                            value={courseCode}
                                            onChange={(e) => setCourseCode(e.target.value)}
                                            className="h-12 border-gray-300 rounded-none"
                                            placeholder="Enter Course Code"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Language Support</label>
                                        <Select value={language} onChange={setLanguage} placeholder="Select Language">
                                            <SelectItem value="english">English</SelectItem>
                                            <SelectItem value="spanish">Spanish</SelectItem>
                                            <SelectItem value="french">French</SelectItem>
                                            <SelectItem value="german">German</SelectItem>
                                            <SelectItem value="chinese">Chinese</SelectItem>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Skills</label>
                                        <MultiSelect value={skills} options={availableSkills} onChange={setSkills} placeholder="Select skills..." />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">No. of Questions</label>
                                        <Select value={numQuestions} onChange={setNumQuestions} placeholder="Select No. of Questions">
                                            <SelectItem value="1-5">1 - 5</SelectItem>
                                            <SelectItem value="6-10">6 - 10</SelectItem>
                                            <SelectItem value="11-20">11 - 20</SelectItem>
                                            <SelectItem value="20+">20+</SelectItem>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Budget</label>
                                        <Input
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                            className="h-12 border-gray-300 rounded-none"
                                            placeholder="For budget the currency selection"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">University Name / Organization</label>
                                        <Input
                                            value={university}
                                            onChange={(e) => setUniversity(e.target.value)}
                                            className="h-12 border-gray-300 rounded-none"
                                            placeholder="Enter University Name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Help Type</label>
                                        <Select value={helpType} onChange={setHelpType} placeholder="Select type of help you need from expert">
                                            <SelectItem value="Certificates">Certificates</SelectItem>
                                            <SelectItem value="Live University Help">Live University Help</SelectItem>
                                            <SelectItem value="Quiz">Quiz</SelectItem>
                                            <SelectItem value="Live Interview">Live Interview</SelectItem>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Additional Services</label>
                                        <Input
                                            value={additionalServices}
                                            onChange={(e) => setAdditionalServices(e.target.value)}
                                            className="h-12 border-gray-300 rounded-none"
                                            placeholder="Topic"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Course Code (optional)</label>
                                        <Input
                                            value={courseCode}
                                            onChange={(e) => setCourseCode(e.target.value)}
                                            className="h-12 border-gray-300 rounded-none"
                                            placeholder="Enter Course Code"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Professor Name</label>
                                        <Input
                                            value={professorName}
                                            onChange={(e) => setProfessorName(e.target.value)}
                                            className="h-12 border-gray-300 rounded-none"
                                            placeholder="Type if you need any additional services"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Date and Time Slot</label>
                                        <div className="relative">
                                            <Input
                                                type="datetime-local"
                                                value={dateTime}
                                                onChange={(e) => setDateTime(e.target.value)}
                                                className="h-12 border-gray-300"
                                                placeholder="Choose Time"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Duration (hours)</label>
                                        <Input
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="h-12 border-gray-300 rounded-none"
                                            placeholder="Enter duration in hours"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Question Type</label>
                                    <div className="flex items-center gap-4">
                                        <label className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={questionTypes.mcq}
                                                onChange={() => toggleQuestionType('mcq')}
                                                className="h-4 w-4 bg-white checked:text-[#019ACB] bg-white checked::after:text-[#019ACB]"
                                            />
                                            <span className="text-sm">MCQ Type</span>
                                        </label>
                                        <label className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={questionTypes.writing}
                                                onChange={() => toggleQuestionType('writing')}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-sm">Writing Type</span>
                                        </label>
                                        <label className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={questionTypes.diagram}
                                                onChange={() => toggleQuestionType('diagram')}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-sm">Diagram</span>
                                        </label>
                                        <label className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={questionTypes.code}
                                                onChange={() => toggleQuestionType('code')}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-sm">Code</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Help Mode</label>
                                    <div className="flex items-center gap-4">
                                        <label className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={helpModes.chat}
                                                onChange={() => toggleHelpMode('chat')}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-sm">Chat</span>
                                        </label>
                                        <label className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={helpModes.call}
                                                onChange={() => toggleHelpMode('call')}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-sm">Call</span>
                                        </label>
                                        <label className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={helpModes.whatsapp}
                                                onChange={() => toggleHelpMode('whatsapp')}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-sm">Whatsapp</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Description & Instruction (kept same) */}
                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={requirements}
                                            onChange={(e) => setRequirements(e.target.value)}
                                            className="w-full min-h-[150px] p-3 border border-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter description or instructions..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Upload and File (kept same) */}
                        {step === 3 && (
                            <div className="space-y-8">
                                <div className="bg-[#eef5f7] border-2 border-dashed border-[#019ACB] rounded-lg p-12 text-center bg-blue-50">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        accept=".pdf,.ppt,.xls,.jpg,.png"
                                    />
                                    <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center space-y-4">
                                        <img onClick={() => fileInputRef.current?.click()} src={UploadIcon} className="w-10 h-10" alt="upload" />
                                        <div>
                                            <h3 className="text-[20px] font-medium text-[#019ACB] mb-2">Drop your document here</h3>
                                            <p className="text-[16px] text-[#8E8E93]">PDF, PPT, XLS or JPG, PNG (Max: 25MB)</p>
                                        </div>
                                    </div>
                                </div>

                                {uploadedFiles.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                                <div className="flex items-center space-x-3">
                                                    <FileText className="h-5 w-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{file.size} MB</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button type="button" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 bg-transparent border-0 hover:bg-gray-100">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <Button type="button" onClick={() => removeFile(index)} className="h-8 w-8 p-0 text-red-400 hover:text-red-600 bg-transparent border-0 hover:bg-red-50">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
                            <div>
                                {step > 1 && (
                                    <Button onClick={goPrev} type="button" className="w-[158px] h-[48px] text-[16px] px-[12px] py-[24px] border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 bg-white">
                                        Back
                                    </Button>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-500">
                                    {step} of {STEPS.length}
                                </div>
                                <Button
                                    onClick={handleSubmitStep}
                                    type="button"
                                    className="bg-[#019ACB] w-[158px] h-[48px] text-[16px] text-white px-[12px] py-[24px] h-12 flex items-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Submitting...' : step < STEPS.length ? 'Next Step' : 'Submit'}
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

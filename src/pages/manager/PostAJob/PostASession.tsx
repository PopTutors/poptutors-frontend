import React, { useState, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import for navigation
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
function Select({ value, onChange, placeholder, children, className = "" }) {
    return (
        <Listbox value={value} onChange={onChange}>
            <div className="relative">
                <Listbox.Button className={`h-12 w-full flex items-center justify-between border border-gray-300 bg-white px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}>
                    <span className="block truncate text-gray-900">
                        {value ? children.find(child => child.props.value === value)?.props.children || value : placeholder}
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

function SelectItem({ value, children, className = "" }) {
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
    { id: 1, title: 'Step 1', subtitle: 'Session details' },
    { id: 2, title: 'Step 2', subtitle: 'Description & instruction' },
    { id: 3, title: 'Step 3', subtitle: 'Upload and file' },
];

export default function PostASession() {
    const router = useNavigate(); // Initialize router for navigation

    // Stepper
    const [step, setStep] = useState(1);
    const fileInputRef = useRef(null);

    // Controlled state for form fields (changed to session fields)
    const [subject, setSubject] = useState('computer-science');         // Academic Subjects
    const [topic, setTopic] = useState('case-studies');                // Topics
    const [expertise, setExpertise] = useState('');                    // Expertise Levels
    const [sessionAgenda, setSessionAgenda] = useState('');           // Session Agenda
    const [language, setLanguage] = useState('');                      // Language Support
    const [timeframe, setTimeframe] = useState('timezone');            // Timezone/timeframe
    const [budget, setBudget] = useState('');                          // Budget
    const [university, setUniversity] = useState('');                  // University/Organization
    const [dateTime, setDateTime] = useState('');                      // Date and Time Slot
    const [requirements, setRequirements] = useState('');              // Specific Requirements or Instructions
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Skills state (kept same component usage)
    const [skills, setSkills] = useState(['Python', 'React Js', 'Node Js']);
    const [availableSkills] = useState([
        { label: 'Python', value: 'Python' },
        { label: 'React Js', value: 'React Js' },
        { label: 'Node Js', value: 'Node Js' },
        // ...
    ]);

    // API mutation hook (same hook)
    const { mutate, isLoading } = useGenericMutation < { id: number; title: string } > ();

    // Function to reset form to initial state (adjusted defaults for sessions)
    const resetForm = () => {
        setStep(1);
        setSubject('computer-science');
        setTopic('case-studies');
        setExpertise('');
        setSessionAgenda('');
        setLanguage('');
        setTimeframe('timezone');
        setBudget('');
        setUniversity('');
        setDateTime('');
        setRequirements('');
        setUploadedFiles([]);
        setSkills(['Python', 'React Js', 'Node Js']);
    };

    const goNext = () => setStep((s) => Math.min(STEPS.length, s + 1));
    const goPrev = () => setStep((s) => Math.max(1, s - 1));
    const goTo = (s) => setStep(s);

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const newFiles = files.map(file => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2), // Size in MB
            file: file
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitStep = async () => {
        if (step < STEPS.length) {
            goNext();
            return;
        }

        // Validate budget
        const budgetMatch = budget.match && budget.match(/\d+/);
        const budgetNumber = budgetMatch ? parseInt(budgetMatch[0]) : (typeof budget === 'number' ? budget : 0);
        if (budget && budgetNumber <= 0) {
            toast.error('Please enter a valid budget amount');
            return;
        }

        // Upload files to BunnyCDN and collect URLs
        let documents = [];
        if (uploadedFiles.length > 0) {
            try {
                toast('Uploading files...');
                const uploadResults = await Promise.all(
                    uploadedFiles.map(async (f) => {
                        if (f.url) return f;
                        const result = await uploadToBunnyCDN({ file: f.file, folderPath: 'sessions' });
                        return {
                            fileName: result.fileName,
                            fileSize: result.fileSize,
                            url: result.url,
                            fileType: result.fileType,
                        };
                    })
                );
                documents = uploadResults;
            } catch (error) {
                toast.error('File upload failed. Please try again.');
                return;
            }
        }

        // Prepare session payload (aligned with RequestSessionForm)
        // Date/time handling
        let startTime = dateTime;
        if (dateTime) {
            const parsedDate = new Date(dateTime);
            if (!isNaN(parsedDate.getTime())) {
                startTime = parsedDate.toISOString();
            }
        }
        // End time (default 1 hour)
        let endTime = startTime;
        if (startTime) {
            const startDate = new Date(startTime);
            startDate.setHours(startDate.getHours() + 1);
            endTime = startDate.toISOString();
        }

        const sessionPayload = {
            subject,
            topic,
            language,
            expertiseLevel: expertise,
            skillsRequired: skills,
            budget: budgetNumber,
            isNegotiable: true,
            sessionType: '1-on-1',
            startTime,
            endTime,
            timezone: 'UTC',
            documents,
            universityName: university,
            sessionAgenda,
            additionalServices: '',
            requirements: requirements || '',
        };

        mutate({
            endpoint: '/sessions',
            data: sessionPayload,
            method: 'POST',
            requiresAuth: true,
            successMessage: 'Session submitted successfully!',
            errorMessage: 'Failed to submit session',
            invalidateKeys: ['sessions'],
            onSuccessCallback: () => {
                toast.success('Session posted successfully!');
                resetForm();
                setTimeout(() => {
                    router('/manager/job-listings');
                }, 1500);
            },
            onErrorCallback: (err) => {
                toast.error('Error posting session');
                console.error('Error Creating Session:', err);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-inter">

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row px-4 md:px-8 lg:px-[72px] py-6 gap-8 lg:gap-12">
                {/* Stepper column */}
                <div className="w-full lg:w-[293px]">
                    {/* Desktop: vertical stepper */}
                    <div className="flex flex-col relative">
                        {STEPS.map((s, i) => (
                            <div key={s.id} className="flex items-start gap-3 mb-8 relative">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full cursor-pointer z-10 ${step >= s.id ? 'bg-[#019ACB]' : 'bg-gray-200'
                                        }`}
                                    onClick={() => goTo(s.id)}
                                >
                                    <span className={`${step >= s.id ? 'text-white' : 'text-gray-600'} font-medium text-base`}>
                                        {s.id}
                                    </span>
                                </div>

                                <div className="flex flex-col pt-2">
                                    <span className={`${step === s.id ? 'text-[#019ACB]' : 'text-[#141414]'} font-medium text-base text-[16px]`}>
                                        {s.title}
                                    </span>
                                    <span className="text-[#141414] text-[16px]">
                                        {s.subtitle}
                                    </span>
                                </div>

                                {/* Vertical line */}
                                {i < STEPS.length - 1 && (
                                    <div className={`absolute left-5 top-12 w-0.5 h-8 ${step > s.id ? 'bg-[#019ACB]' : 'bg-gray-200'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: step content */}
                <div className="flex-1 max-w-4xl">
                    <div className="bg-white border border-gray-200 p-8">
                        {/* Step 1: Session Details */}
                        {step === 1 && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Academic Subjects</label>
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
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                            <SelectItem value="expert">Expert</SelectItem>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Skills</label>
                                        <MultiSelect
                                            value={skills}
                                            options={availableSkills}
                                            onChange={setSkills}
                                            placeholder="Select skills..."
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
                                        <label className="text-sm font-medium text-gray-700">University Name/Organization</label>
                                        <Input
                                            value={university}
                                            onChange={(e) => setUniversity(e.target.value)}
                                            className="h-12 border-gray-300 rounded-none"
                                            placeholder="Enter University Name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Session Agenda</label>
                                        <Select value={sessionAgenda} onChange={setSessionAgenda} placeholder="Select Session Agenda">
                                            <SelectItem value="Subject tutoring">Subject tutoring</SelectItem>
                                            <SelectItem value="Exam Preparation">Exam Preparation</SelectItem>
                                            <SelectItem value="Project and Thesis">Project and Thesis</SelectItem>
                                            <SelectItem value="Professional Certification Training">Professional Certification Training</SelectItem>
                                            <SelectItem value="Career Counselling">Career Counselling</SelectItem>
                                            <SelectItem value="Skill Building">Skill Building</SelectItem>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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



                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Specific Requirements or Instructions</label>
                                    <textarea
                                        value={requirements}
                                        onChange={(e) => setRequirements(e.target.value)}
                                        className="w-full h-13 p-3 border border-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Write Here.."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Description & Instruction */}
                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Description</label>
                                        <textarea
                                            value={requirements}
                                            onChange={(e) => setRequirements(e.target.value)}
                                            className="w-full min-h-[150px] p-3 border border-gray-300  resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter description or instructions..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Upload and File */}
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

                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center space-y-4">
                                        <img
                                            onClick={() => fileInputRef.current?.click()}
                                            src={UploadIcon} className='w-10 h-10' />
                                        <div>
                                            <h3 className="text-[20px] font-medium text-[#019ACB] mb-2">Drop your document here</h3>
                                            <p className="text-[16px] text-[#8E8E93]">PDF, PPT, XLS or JPG, PNG (Max: 25MB)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Uploaded Files List */}
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
                                                    <Button
                                                        type="button"
                                                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 bg-transparent border-0 hover:bg-gray-100"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="h-8 w-8 p-0 text-red-400 hover:text-red-600 bg-transparent border-0 hover:bg-red-50"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Footer with prev / next */}
                        <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
                            <div>
                                {step > 1 && (
                                    <Button
                                        onClick={goPrev}
                                        type="button"
                                        className="w-[158px] h-[48px] text-[16px] px-[12px] py-[24px] border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 bg-white"
                                    >
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
                                    {isLoading ? 'Submitting...' : (step < STEPS.length ? 'Next Step' : 'Submit')}
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

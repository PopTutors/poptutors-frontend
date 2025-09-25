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

// Custom Select Component
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
  { id: 1, title: 'Step 1', subtitle: 'Assignment details' },
  { id: 2, title: 'Step 2', subtitle: 'Description & instruction' },
  { id: 3, title: 'Step 3', subtitle: 'Upload and file' },
];

export default function PostAJob() {
  const router = useNavigate(); // Initialize router for navigation

  // Stepper
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);

  // Controlled state for form fields
  const [subject, setSubject] = useState('computer-science');
  const [assignmentType, setAssignmentType] = useState('case-studies');
  const [expertise, setExpertise] = useState('');
  const [additionalService, setAdditionalService] = useState('');
  const [language, setLanguage] = useState('');
  const [timeframe, setTimeframe] = useState('timezone');
  const [budget, setBudget] = useState('');
  const [university, setUniversity] = useState('');
  const [subjectField, setSubjectField] = useState('cs');
  const [topic, setTopic] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Skills state
  const [skills, setSkills] = useState(['Python', 'React Js', 'Node Js']);
  const [availableSkills] = useState([
    { label: 'Python', value: 'Python' },
    { label: 'React Js', value: 'React Js' },
    { label: 'Node Js', value: 'Node Js' },
    // ...
  ]);



  // API mutation hook
  const { mutate, isLoading } = useGenericMutation < { id: number; title: string } > ();

  // Function to reset form to initial state
  const resetForm = () => {
    setStep(1);
    setSubject('computer-science');
    setAssignmentType('case-studies');
    setExpertise('');
    setAdditionalService('');
    setLanguage('');
    setTimeframe('timezone');
    setBudget('');
    setUniversity('');
    setSubjectField('cs');
    setTopic('');
    setCourseCode('');
    setProfessorName('');
    setDateTime('');
    setDescription('');
    setRequirements('');
    setUploadedFiles([]);
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
    } else {
      // Final submit: construct payload and call API
      const budgetMatch = budget.match(/\d+/);
      const budgetNumber = budgetMatch ? parseInt(budgetMatch[0]) : 0;
      if (budgetNumber <= 0) {
        toast.error('Please enter a valid budget amount');
        return;
      }

      // Upload files to BunnyCDN and collect URLs
      let filesForApi = [];
      if (uploadedFiles.length > 0) {
        try {
          toast('Uploading files...');
          const uploadResults = await Promise.all(
            uploadedFiles.map(async (f) => {
              // If file already has url, use it; else upload
              if (f.url) return f;
              const result = await uploadToBunnyCDN({ file: f.file });
              return {
                url: result.url,
                fileName: result.fileName,
                fileSize: result.fileSize,
                fileType: result.fileType,
              };
            })
          );
          filesForApi = uploadResults;
        } catch (error) {
          toast.error('File upload failed. Please try again.');
          return;
        }
      }

      // Prepare assignment payload
      const assignmentPayload = {
        data: {
          title: topic.trim() || 'Untitled',
          description: requirements.trim(),
          subject: subject,
          course: subjectField,
          courseCode: courseCode.trim(),
          status: 'submitted',
          milestones: [
            {
              percentage: 50,
              description: 'First Draft',
              isCompleted: false,
              paymentStatus: 'pending',
            },
            {
              percentage: 100,
              description: 'Final Submission',
              isCompleted: false,
              paymentStatus: 'pending',
            },
          ],
          studentPrice: budgetNumber,
          attachments: filesForApi,
          metadata: {
            assignmentType: assignmentType || '',
            expertiseLevel: expertise || '',
            additionalServices: additionalService || '',
            language: language,
            skills: skills || [],
            timeframe: timeframe || '',
            universityName: university.trim() || '',
            professorName: professorName.trim(),
            dateTime: dateTime,
            requirements: requirements.trim() || '',
          },
        },
      };

      mutate({
        endpoint: '/assignments',
        data: assignmentPayload,
        method: 'POST',
        requiresAuth: true,
        successMessage: 'Assignment submitted successfully!',
        errorMessage: 'Failed to submit assignment',
        invalidateKeys: ['assignments'],
        onSuccessCallback: () => {
          toast.success('Assignment posted successfully!');
          // Clear the form
          resetForm();
          // Navigate to job listings page after a brief delay
          setTimeout(() => {
            router('/manager/job-listings'); // Adjust this path to match your actual job listings route
          }, 1500);
        },
        onErrorCallback: (err) => {
          toast.error('Error posting assignment');
          console.error('Error Creating Assignment:', err);
        },
      });
    }
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
            {/* Step 1: Assignment Details */}
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
                    <label className="text-sm font-medium text-gray-700">Assignment Types</label>
                    <Select value={assignmentType} onChange={setAssignmentType} placeholder="Select Assignment Type">
                      <SelectItem value="case-studies">Case Studies</SelectItem>
                      <SelectItem value="essays">Essays</SelectItem>
                      <SelectItem value="research-papers">Research Papers</SelectItem>
                      <SelectItem value="lab-reports">Lab Reports</SelectItem>
                      <SelectItem value="presentations">Presentations</SelectItem>
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
                    <label className="text-sm font-medium text-gray-700">Additional Services</label>
                    <Select value={additionalService} onChange={setAdditionalService} placeholder="Select Additional Services">
                      <SelectItem value="proofreading">Proofreading</SelectItem>
                      <SelectItem value="editing">Editing</SelectItem>
                      <SelectItem value="formatting">Formatting</SelectItem>
                      <SelectItem value="plagiarism-check">Plagiarism Check</SelectItem>
                    </Select>
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
                    <label className="text-sm font-medium text-gray-700">Timeframe for Completion</label>
                    <Select value={timeframe} onChange={setTimeframe} placeholder="Select Timeframe">
                      <SelectItem value="timezone">Eastern European Time (EET), Cairo UTC +3</SelectItem>
                      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                      <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                      <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
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
                    <label className="text-sm font-medium text-gray-700">University Name</label>
                    <Input
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="h-12 border-gray-300 rounded-none"
                      placeholder="Enter University Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Subject</label>
                    <Select value={subjectField} onChange={setSubjectField} placeholder="Select Subject">
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Topic Name</label>
                    <Input
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="h-12 border-gray-300"
                      placeholder="Topic"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Course Code</label>
                    <Input
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      className="h-12 border-gray-300"
                      placeholder="Enter Course Code"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Professor Name</label>
                    <Input
                      value={professorName}
                      onChange={(e) => setProfessorName(e.target.value)}
                      className="h-12 border-gray-300"
                      placeholder="Professor Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Date and Time</label>
                    <div className="relative">
                      <Input
                        type="datetime-local"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        className="h-12 border-gray-300"
                        placeholder="Choose Time"
                      />
                      {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" /> */}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Description & Instruction */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-4">

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Specific Requirements or Instructions</label>
                    <textarea
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="w-full min-h-[150px] p-3 border border-gray-300  resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter specific requirements or instructions..."
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
                    {/* <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    >
                      Browse Files
                    </Button> */}
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
// src/components/AssignmentForm.tsx
import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select';
import { MultiSelect } from '../ui/multi-select';
import Textarea from '../ui/textarea';
import { UploadIcon, X, FileIcon } from 'lucide-react';
import FieldError from '../ui/FieldError';
import { useGenericMutation } from '../../api/useGenericMutation';

import { uploadToBunnyCDN } from '../../utils/uploadToBunnyCdn';
import toast from 'react-hot-toast';

interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

// VALIDATION SCHEMA
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  assignmentType: z.string().optional().or(z.literal('')),
  expertiseLevel: z.string().optional().or(z.literal('')),
  additionalServices: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  skills: z.array(z.string()).default([]),
  timeframe: z.string().optional().or(z.literal('')),
  budget: z.string().min(1, 'Budget is required'),
  universityName: z.string().optional().or(z.literal('')),
  course: z.string().min(1, 'Course is required'),
  courseCode: z.string().min(1, 'Course Code is required'),
  professorName: z.string().min(1, 'Professor Name is required'),
  dateTime: z.string().min(1, 'Date and Time is required'),
  requirements: z.string().min(1, 'Specific requirements are required'),
});

type FormData = z.infer<typeof formSchema>;

interface AssignmentPayload {
  data: {
    title: string;
    description: string;
    subject: string;
    course: string;
    courseCode: string;
    status: string;
    milestones: Array<{
      percentage: number;
      description: string;
      isCompleted: boolean;
      paymentStatus: string;
    }>;
    studentPrice: number;
    attachments?: UploadResponse[];
    metadata?: {
      assignmentType?: string;
      expertiseLevel?: string;
      additionalServices?: string;
      language: string;
      skills: string[];
      timeframe?: string;
      universityName?: string;
      professorName: string;
      dateTime: string;
      requirements?: string;
    };
  };
}

export const AssignmentForm: React.FC = () => {
  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState < UploadResponse[] > ([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef < HTMLInputElement | null > (null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm < FormData > ({
    resolver: zodResolver(formSchema) as any,
    mode: 'onBlur',
    defaultValues: {
      title: '',
      subject: '',
      assignmentType: '',
      expertiseLevel: '',
      additionalServices: '',
      language: '',
      skills: [],
      timeframe: '',
      budget: '',
      universityName: '',
      course: '',
      courseCode: '',
      professorName: '',
      dateTime: '',
      requirements: '',
    },
  });

  type OptionType = { value: string; label: string };

  // Options
  const subjects: OptionType[] = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Business', label: 'Business' },
    { value: 'Literature', label: 'Literature' },
  ];

  const assignmentTypes: OptionType[] = [
    { value: 'Case Studies', label: 'Case Studies' },
    { value: 'Algorithms', label: 'Algorithms' },
    { value: 'Data Structures', label: 'Data Structures' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Research Paper', label: 'Research Paper' },
    { value: 'Essay', label: 'Essay' },
    { value: 'Project', label: 'Project' },
    { value: 'Report', label: 'Report' },
  ];

  const expertiseLevels: OptionType[] = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Expert', label: 'Expert' },
  ];

  const languages: OptionType[] = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Hindi', label: 'Hindi' },
  ];

  const timeframeOptions: OptionType[] = [
    { value: 'EET', label: 'Eastern European Time (EET), Cairo UTC+3' },
    { value: 'IST', label: 'India Standard Time (IST), UTC+5:30' },
    { value: 'GMT', label: 'Greenwich Mean Time (GMT), UTC+0' },
    { value: 'PST', label: 'Pacific Standard Time (PST), UTC−8' },
    { value: 'EST', label: 'Eastern Standard Time (EST), UTC−5' },
  ];

  const skillOptions = [
    'Python',
    'React Js',
    'Node Js',
    'JavaScript',
    'HTML',
    'CSS',
    'Angular',
    'Vue.js',
    'Java',
    'C++',
    'Data Analysis',
    'Machine Learning',
    'Research',
    'Writing',
  ];

  // mutation hook
  const { mutate, isLoading } = useGenericMutation < { id: number; title: string } > ();

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadToBunnyCDN({
          file,
        })
      );

      const uploadResults = await Promise.all(uploadPromises);
      setUploadedFiles((prev) => [...prev, ...uploadResults]);
      toast.success(`${uploadResults.length} file(s) uploaded successfully!`);

      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove uploaded file
  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submission
  const onSubmit = (data: FormData) => {
    console.log('✅ Form Submitted Data:', data);
    console.log('✅ Uploaded Files:', uploadedFiles);

    // Parse budget to number
    const budgetMatch = data.budget.match(/\d+/);
    const budgetNumber = budgetMatch ? parseInt(budgetMatch[0]) : 0;

    if (budgetNumber <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    // Prepare assignment payload according to API structure
    const assignmentPayload: AssignmentPayload = {
      data: {
        title: data.title.trim(),
        description: data.requirements.trim(),
        subject: data.subject,
        course: data.course.trim(),
        courseCode: data.courseCode.trim(),
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
        attachments: uploadedFiles,
        metadata: {
          assignmentType: data.assignmentType || undefined,
          expertiseLevel: data.expertiseLevel || undefined,
          additionalServices: data.additionalServices?.trim() || undefined,
          language: data.language,
          skills: data.skills || [],
          timeframe: data.timeframe || undefined,
          universityName: data.universityName?.trim() || undefined,
          professorName: data.professorName.trim(),
          dateTime: data.dateTime,
          requirements: data.requirements?.trim() || undefined,
        },
      },
    };

    console.log('✅ Assignment Payload:', assignmentPayload);

    mutate({
      endpoint: '/assignments',
      data: assignmentPayload,
      method: 'POST',
      requiresAuth: true,
      successMessage: 'Assignment submitted successfully!',
      errorMessage: 'Failed to submit assignment',
      invalidateKeys: ['assignments'],
      onSuccessCallback: (res) => {
        console.log('Assignment Created:', res);
        reset();
        setUploadedFiles([]);
      },
      onErrorCallback: (err) => {
        console.error('Error Creating Assignment:', err);
      },
    });
  };

  const onError = (errors: any) => {
    console.error('❌ Form validation errors:', errors);
    toast.error('Please fill in all required fields correctly');
  };

  return (
    <>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Submit New Assignment</h1>
          <hr className="border-t border-[2px] border-gray-200 w-32 mt-[4px]" />
        </div>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.ppt,.pptx,.xls,.xlsx"
          />
          <Button
            variant="pill_outline"
            size="pill"
            className="py-2"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
            <UploadIcon />
          </Button>
        </div>
      </div>

      {/* Display uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="mb-6">
          <Label className="mb-2 block">Uploaded Files</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-700 truncate">{file.fileName}</span>
                  <span className="text-xs text-gray-500">({Math.round(file.fileSize / 1024)}KB)</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUploadedFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* Title & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Assignment Title *</Label>
            <Controller name="title" control={control} render={({ field }) => <Input {...field} placeholder="Enter assignment title" />} />
            <FieldError name="title" errors={errors} />
          </div>

          <div>
            <Label>Budget *</Label>
            <Controller
              name="budget"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter budget (e.g., $100, ₹5000)" />}
            />
            <FieldError name="budget" errors={errors} />
          </div>
        </div>

        {/* Subject & Assignment Type (using Headless compound Select) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Academic Subject *</Label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onChange={(v) => field.onChange(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError name="subject" errors={errors} />
          </div>

          <div>
            <Label>Assignment Type</Label>
            <Controller
              name="assignmentType"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onChange={(v) => field.onChange(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignmentTypes.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError name="assignmentType" errors={errors} />
          </div>
        </div>

        {/* Expertise Level & Additional Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Expertise Level</Label>
            <Controller
              name="expertiseLevel"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onChange={(v) => field.onChange(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {expertiseLevels.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError name="expertiseLevel" errors={errors} />
          </div>

          <div>
            <Label>Additional Services</Label>
            <Controller name="additionalServices" control={control} render={({ field }) => <Input {...field} placeholder="Any additional services?" />} />
          </div>
        </div>

        {/* Language & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Language Support *</Label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onChange={(v) => field.onChange(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError name="language" errors={errors} />
          </div>

          <div>
            <Label>Skills</Label>
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  {...field}
                  options={skillOptions.map((skill) => ({ label: skill, value: skill }))}
                  placeholder="Select skills"
                />
              )}
            />
            <FieldError name="skills" errors={errors} />
          </div>
        </div>

        {/* Timeframe & University */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Timeframe for Completion</Label>
            <Controller
              name="timeframe"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onChange={(v) => field.onChange(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframeOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError name="timeframe" errors={errors} />
          </div>

          <div>
            <Label>University Name / Organization</Label>
            <Controller name="universityName" control={control} render={({ field }) => <Input {...field} placeholder="Enter University Name" />} />
            <FieldError name="universityName" errors={errors} />
          </div>
        </div>

        {/* Course & Course Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Course Name *</Label>
            <Controller name="course" control={control} render={({ field }) => <Input {...field} placeholder="Enter course name" />} />
            <FieldError name="course" errors={errors} />
          </div>

          <div>
            <Label>Course Code *</Label>
            <Controller name="courseCode" control={control} render={({ field }) => <Input {...field} placeholder="Enter Course Code" />} />
            <FieldError name="courseCode" errors={errors} />
          </div>
        </div>

        {/* Professor Name & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Professor Name *</Label>
            <Controller name="professorName" control={control} render={({ field }) => <Input {...field} placeholder="Professor Name" />} />
            <FieldError name="professorName" errors={errors} />
          </div>

          <div>
            <Label>Deadline Date and Time *</Label>
            <Controller name="dateTime" control={control} render={({ field }) => <Input {...field} type="datetime-local" />} />
            <FieldError name="dateTime" errors={errors} />
          </div>
        </div>

        {/* Requirements */}
        <div>
          <Label>Specific Requirements or Instructions *</Label>
          <Controller name="requirements" control={control} render={({ field }) => <Textarea {...field} rows={4} placeholder="Write here..." />} />
          <FieldError name="requirements" errors={errors} />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="pill_outline"
            size="pill"
            type="button"
            onClick={() => {
              reset();
              setUploadedFiles([]);
            }}
          >
            Cancel
          </Button>
          <Button variant="pill_solid" size="pill" type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default AssignmentForm;

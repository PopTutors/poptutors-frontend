// src/components/BookExpertForm.tsx
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
import toast from 'react-hot-toast';
import { useGenericMutation } from '../../api/useGenericMutation';
import { uploadMultipleFiles } from '../../utils/uploadToBunnyCdn';

//
// Validation schema
//
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  topic: z.string().min(1, 'Topic is required'),
  expertise: z.string().min(1, 'Expertise level is required'),
  courseCode: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  numQuestions: z.string().min(1, 'Number of questions is required'),
  budget: z.string().min(1, 'Budget is required'),
  university: z.string().min(1, 'University is required'),
  helpType: z.string().min(1, 'Help type is required'),
  questionTypes: z.array(z.string()).optional(),
  additionalServices: z.string().optional(),
  helpModes: z.array(z.string()).min(1, 'Help mode is required'),
  dateTime: z.string().min(1, 'Date and time is required'),
  duration: z.string().min(1, 'Duration is required'),
  requirements: z.string().min(1, 'Requirements are required'),
});

type FormData = z.infer<typeof formSchema>;

interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

type OptionType = { value: string; label: string };

export default function BookExpertForm() {
  const [uploadedFiles, setUploadedFiles] = useState < UploadResponse[] > ([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef < HTMLInputElement | null > (null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm < FormData > ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subject: '',
      topic: '',
      expertise: '',
      courseCode: '',
      language: '',
      skills: [],
      numQuestions: '',
      budget: '',
      university: '',
      helpType: '',
      questionTypes: [],
      additionalServices: '',
      helpModes: [],
      dateTime: '',
      duration: '',
      requirements: '',
    },
  });

  // Options
  const subjects: OptionType[] = [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Business', label: 'Business' },
    { value: 'Economics', label: 'Economics' },
    { value: 'Biology', label: 'Biology' },
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
    { value: 'Chinese', label: 'Chinese' },
  ];

  const skillOptions = [
    'Python',
    'JavaScript',
    'Java',
    'C++',
    'React',
    'Node.js',
    'Mathematics',
    'Statistics',
    'Data Analysis',
    'Machine Learning',
    'Physics',
    'Chemistry',
    'Biology',
    'Research',
    'Writing',
    'Problem Solving',
    'Critical Thinking',
  ];

  const helpTypes: OptionType[] = [
    { value: 'Assignment Help', label: 'Assignment Help' },
    { value: 'Exam Preparation', label: 'Exam Preparation' },
    { value: 'Concept Clarification', label: 'Concept Clarification' },
    { value: 'Project Guidance', label: 'Project Guidance' },
    { value: 'Research Support', label: 'Research Support' },
  ];

  const questionTypeOptions = [
    'Multiple Choice',
    'Short Answer',
    'Long Answer',
    'Numerical',
    'Theory',
    'Practical',
    'Case Study',
    'Problem Solving',
  ];

  const helpModeOptions = [
    'Live Video Call',
    'Voice Call',
    'Screen Sharing',
    'Chat Support',
    'Email Support',
    'Document Review',
  ];

  const { mutate, isLoading } = useGenericMutation < { id: string; title: string } > ();

  // File upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadResults = await uploadMultipleFiles({
        files: Array.from(files),
        folderPath: 'live-help',
      });
      setUploadedFiles((prev) => [...prev, ...uploadResults]);
      toast.success(`${uploadResults.length} file(s) uploaded successfully!`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit
  const onSubmit = (data: FormData) => {
    console.log('✅ Form Submitted Data:', data);
    console.log('✅ Uploaded Files:', uploadedFiles);

    const budgetMatch = data.budget.match(/[\d.]+/);
    const pricePerHour = budgetMatch ? parseFloat(budgetMatch[0]) : 0;
    if (pricePerHour <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    const durationHours = parseInt(data.duration, 10);
    if (isNaN(durationHours) || durationHours <= 0) {
      toast.error('Please enter a valid duration');
      return;
    }

    const payload = {
      title: data.title.trim(),
      description: data.requirements.trim(),
      pricePerHour: pricePerHour,
      liveHelpHours: durationHours,
      status: 'requested',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      documents: uploadedFiles.map((f) => f.url),
      metadata: {
        subject: data.subject,
        topic: data.topic,
        expertise: data.expertise,
        courseCode: data.courseCode || undefined,
        language: data.language,
        skills: data.skills,
        numQuestions: data.numQuestions,
        university: data.university,
        helpType: data.helpType,
        questionTypes: data.questionTypes || [],
        additionalServices: data.additionalServices || undefined,
        helpModes: data.helpModes,
        scheduledDateTime: data.dateTime,
      },
    };

    console.log('✅ Live Help Payload:', payload);

    mutate({
      endpoint: '/live-help',
      data: payload,
      method: 'POST',
      requiresAuth: true,
      successMessage: 'Live help request submitted successfully!',
      errorMessage: 'Failed to submit live help request',
      invalidateKeys: ['live-help'],
      onSuccessCallback: (response) => {
        console.log('Live Help Created:', response);
        reset();
        setUploadedFiles([]);
        toast.success('Live help request submitted successfully!');
      },
      onErrorCallback: (error) => {
        console.error('Error Creating Live Help:', error);
        toast.error('Failed to submit live help request. Please try again.');
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
          <h1 className="text-xl font-semibold text-gray-800">Book Expert Live Help</h1>
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
            {isUploading ? 'Uploading...' : 'Upload Files'}
            <UploadIcon />
          </Button>
        </div>
      </div>

      {/* Uploaded files */}
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
        {/* Title & Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Title *</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter session title" />}
            />
            <FieldError name="title" errors={errors} />
          </div>

          <div>
            <Label>Subject *</Label>
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
        </div>

        {/* Topic & Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Topic *</Label>
            <Controller
              name="topic"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Specific topic or chapter" />}
            />
            <FieldError name="topic" errors={errors} />
          </div>

          <div>
            <Label>Expertise Level *</Label>
            <Controller
              name="expertise"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onChange={(v) => field.onChange(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {expertiseLevels.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError name="expertise" errors={errors} />
          </div>
        </div>

        {/* Course Code & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Course Code</Label>
            <Controller
              name="courseCode"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Course Code (optional)" />}
            />
            <FieldError name="courseCode" errors={errors} />
          </div>

          <div>
            <Label>Language *</Label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onChange={(v) => field.onChange(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError name="language" errors={errors} />
          </div>
        </div>

        {/* Skills */}
        <div>
          <Label>Required Skills *</Label>
          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                options={skillOptions.map((skill) => ({ label: skill, value: skill }))}
                placeholder="Select required skills"
              />
            )}
          />
          <FieldError name="skills" errors={errors} />
        </div>

        {/* Number of Questions & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Number of Questions *</Label>
            <Controller
              name="numQuestions"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Approximate number of questions" />}
            />
            <FieldError name="numQuestions" errors={errors} />
          </div>

          <div>
            <Label>Budget (per hour) *</Label>
            <Controller
              name="budget"
              control={control}
              render={({ field }) => <Input {...field} placeholder="e.g., $50, ₹2000" />}
            />
            <FieldError name="budget" errors={errors} />
          </div>
        </div>

        {/* University & Help Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>University *</Label>
            <Controller
              name="university"
              control={control}
              render={({ field }) => <Input {...field} placeholder="University or Institution" />}
            />
            <FieldError name="university" errors={errors} />
          </div>

          <div>
            <Label>Help Type *</Label>
            <Controller
              name="helpType"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onChange={(v) => field.onChange(v ?? '')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Help Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {helpTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError name="helpType" errors={errors} />
          </div>
        </div>

        {/* Question Types */}
        <div>
          <Label>Question Types</Label>
          <Controller
            name="questionTypes"
            control={control}
            render={({ field }) => {
              const mappedValue = Array.isArray(field.value)
                ? field.value.map((item: any) => (typeof item === 'string' ? item : item.value))
                : [];
              return (
                <MultiSelect
                  {...field}
                  value={mappedValue}
                  options={questionTypeOptions.map((type) => ({ label: type, value: type }))}
                  placeholder="Select question types (optional)"
                />
              );
            }}
          />
          <FieldError name="questionTypes" errors={errors} />
        </div>

        {/* Additional Services */}
        <div>
          <Label>Additional Services</Label>
          <Controller
            name="additionalServices"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Any additional services needed (optional)" />}
          />
          <FieldError name="additionalServices" errors={errors} />
        </div>

        {/* Help Modes */}
        <div>
          <Label>Preferred Help Modes *</Label>
          <Controller
            name="helpModes"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                options={helpModeOptions.map((mode) => ({ label: mode, value: mode }))}
                placeholder="Select preferred help modes"
              />
            )}
          />
          <FieldError name="helpModes" errors={errors} />
        </div>

        {/* Date & Time and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Preferred Date & Time *</Label>
            <Controller
              name="dateTime"
              control={control}
              render={({ field }) => <Input {...field} type="datetime-local" />}
            />
            <FieldError name="dateTime" errors={errors} />
          </div>

          <div>
            <Label>Duration (hours) *</Label>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Duration in hours (e.g., 2)" />}
            />
            <FieldError name="duration" errors={errors} />
          </div>
        </div>

        {/* Requirements */}
        <div>
          <Label>Requirements / Description *</Label>
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => <Textarea {...field} rows={4} placeholder="Describe your help request in detail..." />}
          />
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
          <Button variant="pill_solid" size="pill" type="submit" disabled={isLoading || isUploading}>
            {isLoading ? 'Submitting...' : 'Book Expert'}
          </Button>
        </div>
      </form>
    </>
  );
}

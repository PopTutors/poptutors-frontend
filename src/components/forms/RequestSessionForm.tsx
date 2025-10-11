// src/components/RequestSessionForm.tsx
import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadIcon, X, FileIcon } from 'lucide-react';
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
import { DateTimeDurationInput } from '../ui/DateTimeDurationInput';
import FieldError from '../ui/FieldError';
import toast from 'react-hot-toast';
import { useGenericMutation } from '../../api/useGenericMutation';
import { uploadToBunnyCDN } from '../../utils/uploadToBunnyCdn';

//
// Validation schema
//
const formSchema = z.object({
  subject: z
    .union([z.string(), z.object({ value: z.string(), label: z.string() })])
    .transform((val) => (typeof val === 'string' ? val : val.value))
    .refine((val) => val.length > 0, 'Subject is required'),
  topic: z.string().min(1, 'Topic is required'),
  expertiseLevel: z
    .union([z.string(), z.object({ value: z.string(), label: z.string() })])
    .transform((val) => (typeof val === 'string' ? val : val.value))
    .refine((val) => val.length > 0, 'Expertise level is required'),
  skills: z
    .union([z.array(z.string()), z.array(z.object({ value: z.string(), label: z.string() }))])
    .transform((val) => val.map((item) => (typeof item === 'string' ? item : item.value)))
    .refine((val) => val.length > 0, 'At least one skill is required'),
  language: z
    .union([z.string(), z.object({ value: z.string(), label: z.string() })])
    .transform((val) => (typeof val === 'string' ? val : val.value))
    .refine((val) => val.length > 0, 'Language is required'),
  budget: z.string().min(1, 'Budget is required'),
  universityName: z.string().min(1, 'University name is required'),
  sessionAgenda: z
    .union([z.string(), z.object({ value: z.string(), label: z.string() })])
    .transform((val) => (typeof val === 'string' ? val : val.value))
    .refine((val) => val.length > 0, 'Session agenda is required'),
  additionalServices: z.string().optional(),
  dateTime: z.date({ required_error: 'Date and time is required' }),
  duration: z.string().min(1, 'Duration is required'),
  requirements: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const subjects = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Chemistry', label: 'Chemistry' },
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
];

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
];

const agendaOptions = [
  'Subject tutoring',
  'Exam Preparation',
  'Project and Thesis',
  'Professional Certification Training',
  'Career Counselling',
  'Skill Building',
];

const RequestSessionForm: React.FC = () => {
  type UploadResponse = { fileName?: string; fileSize?: number; url?: string };
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
      subject: { value: 'Computer Science', label: 'Computer Science' } as any,
      topic: 'Case Studies',
      expertiseLevel: { value: 'intermediate', label: 'Intermediate' } as any,
      skills: [
        { value: 'Python', label: 'Python' },
        { value: 'React Js', label: 'React Js' },
        { value: 'Node Js', label: 'Node Js' },
      ] as any,
      language: { value: 'English', label: 'English' } as any,
      budget: '',
      universityName: '',
      sessionAgenda: { value: 'Subject tutoring', label: 'Subject tutoring' } as any,
      additionalServices: '',
      dateTime: new Date(),
      duration: '1 hour',
      requirements: '',
    },
  });

  const { mutate, isLoading } = useGenericMutation();

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadToBunnyCDN({
          file,
          folderPath: 'sessions',
        })
      );

      const uploadResults = await Promise.all(uploadPromises);
      setUploadedFiles((prev) => [...prev, ...uploadResults]);
      toast.success(`${uploadResults.length} file(s) uploaded successfully!`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (rawData: any) => {
    try {
      // rawData fields have been transformed by zod (subject, language, etc. become strings)
      const data: FormData = rawData;
      const budgetMatch = data.budget.match(/[\d.]+/);
      const budgetNumber = budgetMatch ? parseInt(budgetMatch[0]) : 0;

      if (budgetNumber <= 0) {
        toast.error('Please enter a valid budget amount');
        return;
      }

      // dateTime should be a Date (validation enforced by zod), but handle defensively
      let startTimeISO: string;
      if (data.dateTime instanceof Date && !isNaN(data.dateTime.getTime())) {
        startTimeISO = data.dateTime.toISOString();
      } else {
        const parsed = new Date(data.dateTime as any);
        if (isNaN(parsed.getTime())) {
          toast.error('Please select a valid date and time');
          return;
        }
        startTimeISO = parsed.toISOString();
      }

      // duration parsing: if contains 'hour', add hours
      let endTimeISO = startTimeISO;
      if (typeof data.duration === 'string' && data.duration.includes('hour')) {
        const durationMatch = data.duration.match(/\d+/);
        const hours = durationMatch ? parseInt(durationMatch[0], 10) : 1;
        const startDate = new Date(startTimeISO);
        startDate.setHours(startDate.getHours() + hours);
        endTimeISO = startDate.toISOString();
      }

      const sessionPayload = {
        subject: data.subject,
        topic: data.topic,
        language: data.language,
        expertiseLevel: data.expertiseLevel,
        skillsRequired: data.skills,
        budget: budgetNumber,
        isNegotiable: true,
        sessionType: '1-on-1',
        startTime: startTimeISO,
        endTime: endTimeISO,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        documents: uploadedFiles.map((f) => f.url).filter(Boolean),
        universityName: data.universityName,
        sessionAgenda: data.sessionAgenda,
        additionalServices: data.additionalServices || '',
        requirements: data.requirements || '',
      };

      mutate({
        endpoint: '/sessions',
        data: sessionPayload,
        method: 'POST',
        requiresAuth: true,
        successMessage: 'Session requested successfully! 🎉',
        errorMessage: 'Failed to request session. Please try again.',
        invalidateKeys: ['sessions'],
        onSuccessCallback: () => {
          reset();
          setUploadedFiles([]);
          toast.success('Session requested successfully!');
        },
        onErrorCallback: (error) => {
          console.error('Session request error:', error);
          toast.error('Failed to request session. Please check your details and try again.');
        },
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-full p-0">
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Request Session</h1>
          <hr className="border-t border-[2px] border-gray-200 w-32 mt-[4px]" />
        </div>
        <div className="flex justify-end gap-3">
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
            <UploadIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mb-6">
          <Label className="mb-2 block">Uploaded Files</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={`file-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-700 truncate">
                    {file.fileName || `File ${index + 1}`}
                  </span>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Subject & Topic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Subjects</Label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => {
                // field.value can be string or {value,label}; normalize to primitive
                const currentValue =
                  typeof field.value === 'string' ? field.value : field.value?.value ?? '';
                return (
                  <Select value={currentValue} onValueChange={(v) => field.onChange(v ?? '')}>
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
                );
              }}
            />
            <FieldError name="subject" errors={errors} />
          </div>

          <div>
            <Label>Topics</Label>
            <Controller
              name="topic"
              control={control}
              render={({ field }) => <Input {...field} type="text" placeholder="Enter Topic" />}
            />
            <FieldError name="topic" errors={errors} />
          </div>
        </div>

        {/* Expertise & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Expertise Levels</Label>
            <Controller
              name="expertiseLevel"
              control={control}
              render={({ field }) => {
                const currentValue =
                  typeof field.value === 'string' ? field.value : field.value?.value ?? '';
                return (
                  <Select value={currentValue} onValueChange={(v) => field.onChange(v ?? '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Expertise Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                );
              }}
            />
            <FieldError name="expertiseLevel" errors={errors} />
          </div>

          <div>
            <Label>Skills</Label>
            <Controller
              name="skills"
              control={control}
              render={({ field }) => {
                const mappedValue = Array.isArray(field.value)
                  ? field.value.map((item) => (typeof item === 'string' ? item : item.value))
                  : [];
                return (
                  <MultiSelect
                    options={skillOptions.map((skill) => ({ label: skill, value: skill }))}
                    placeholder="Select skills"
                    value={mappedValue}
                    onChange={(vals: string[]) => field.onChange(vals)}
                  />
                );
              }}
            />
            <FieldError name="skills" errors={errors} />
          </div>
        </div>

        {/* Language & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Language</Label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => {
                const currentValue =
                  typeof field.value === 'string' ? field.value : field.value?.value ?? '';
                return (
                  <Select value={currentValue} onValueChange={(v) => field.onChange(v ?? '')}>
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
                );
              }}
            />
            <FieldError name="language" errors={errors} />
          </div>

          <div>
            <Label>Budget</Label>
            <Controller
              name="budget"
              control={control}
              render={({ field }) => (
                <Input {...field} type="text" placeholder="Enter budget (e.g. 50 USD)" />
              )}
            />
            <FieldError name="budget" errors={errors} />
          </div>
        </div>

        {/* University & Agenda */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>University Name/Organization</Label>
            <Controller
              name="universityName"
              control={control}
              render={({ field }) => (
                <Input {...field} type="text" placeholder="Enter University Name" />
              )}
            />
            <FieldError name="universityName" errors={errors} />
          </div>

          <div>
            <Label>Session Agenda</Label>
            <Controller
              name="sessionAgenda"
              control={control}
              render={({ field }) => {
                const currentValue =
                  typeof field.value === 'string' ? field.value : field.value?.value ?? '';
                return (
                  <Select value={currentValue} onValueChange={(v) => field.onChange(v ?? '')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Session Agenda" />
                    </SelectTrigger>
                    <SelectContent>
                      {agendaOptions.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
            <FieldError name="sessionAgenda" errors={errors} />
          </div>
        </div>

        {/* Additional Services & Date/Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Additional Services</Label>
            <Controller
              name="additionalServices"
              control={control}
              render={({ field }) => (
                <Input {...field} type="text" placeholder="Type if you need any additional services" />
              )}
            />
            <FieldError name="additionalServices" errors={errors} />
          </div>

          <div>
            <Label>Date and Time Slot</Label>
            <Controller
              name="dateTime"
              control={control}
              render={({ field }) => (
                <DateTimeDurationInput
                  value={field.value as Date}
                  onChange={(val: Date) => field.onChange(val)}
                  durationField={{
                    name: 'duration',
                    control: control,
                  }}
                />
              )}
            />
            <FieldError name="dateTime" errors={errors} />
          </div>
        </div>

        {/* Requirements */}
        <div>
          <Label>Specific Requirements or Instructions</Label>
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => <Textarea {...field} rows={5} placeholder="Write here..." />}
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
            {isLoading ? 'Booking...' : 'Book Now'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestSessionForm;

import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { MultiSelect } from '../ui/multi-select';
import Textarea from '../ui/textarea';
import toast from 'react-hot-toast';
import { useGenericMutation } from '../../api/useGenericMutation';
import { uploadMultipleFiles } from '../../utils/uploadToBunnyCdn';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  topic: z.string().min(1, 'Topic is required'),
  expertise: z.string().min(1, 'Expertise is required'),
  courseCode: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  numQuestions: z.string().min(1, 'Number of questions is required'),
  budget: z.string().optional(),
  university: z.string().min(1, 'University is required'),
  helpType: z.string().min(1, 'Help type is required'),
  questionTypes: z.array(z.string()),
  additionalServices: z.string().optional(),
  helpModes: z.array(z.string()).min(1, 'Help mode is required'),
  dateTime: z.date(),
  duration: z.string().min(1, 'Duration is required'),
  requirements: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function BookExpertForm() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
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
      dateTime: new Date(),
      duration: '',
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
      const uploadResults = await uploadMultipleFiles({
        files,
        folderPath: 'live-help',
      });
      setUploadedFiles((prev) => [...prev, ...uploadResults]);
      toast.success(`${uploadResults.length} file(s) uploaded successfully!`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast.error('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: FormData) => {
    // Prepare payload for /live-help API
    const payload = {
      title: data.title,
      description: data.requirements || '',
      subject: data.subject,
      topic: data.topic,
      expertise: data.expertise,
      courseCode: data.courseCode,
      language: data.language,
      skills: data.skills,
      numQuestions: data.numQuestions,
      budget: data.budget ? parseFloat(data.budget) : undefined,
      university: data.university,
      helpType: data.helpType,
      questionTypes: data.questionTypes,
      additionalServices: data.additionalServices,
      helpModes: data.helpModes,
      dateTime: data.dateTime instanceof Date ? data.dateTime.toISOString() : data.dateTime,
      duration: data.duration,
      documents: uploadedFiles,
      liveHelpHours: data.duration ? parseInt(data.duration) : undefined,
      pricePerHour: data.budget ? parseFloat(data.budget) : undefined,
      status: 'requested',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    mutate({
      endpoint: '/live-help',
      data: payload,
      method: 'POST',
      requiresAuth: true,
      successMessage: 'Live help request submitted!',
      errorMessage: 'Failed to submit live help request.',
      invalidateKeys: ['live-help'],
      onSuccessCallback: () => {
        reset();
        setUploadedFiles([]);
        toast.success('Live help request submitted!');
      },
      onErrorCallback: () => {
        toast.error('Failed to submit live help request.');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label>Title</Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Title" />}
        />
        <FieldError name="title" errors={errors} />
      </div>
      <div>
        <Label>Subject</Label>
        <Controller
          name="subject"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Subject" />}
        />
        <FieldError name="subject" errors={errors} />
      </div>
      <div>
        <Label>Topic</Label>
        <Controller
          name="topic"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Topic" />}
        />
        <FieldError name="topic" errors={errors} />
      </div>
      <div>
        <Label>Expertise</Label>
        <Controller
          name="expertise"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Expertise" />}
        />
        <FieldError name="expertise" errors={errors} />
      </div>
      <div>
        <Label>Course Code</Label>
        <Controller
          name="courseCode"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Course Code" />}
        />
        <FieldError name="courseCode" errors={errors} />
      </div>
      <div>
        <Label>Language</Label>
        <Controller
          name="language"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Language" />}
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
              options={['Python', 'Math', 'React', 'Node'].map((skill) => ({
                label: skill,
                value: skill,
              }))}
              value={field.value.map((val) => ({ label: val, value: val }))}
              onChange={(options) => field.onChange(options.map((option) => option.value))}
              placeholder="Select skills"
            />
          )}
        />
        <FieldError name="skills" errors={errors} />
      </div>
      <div>
        <Label>Number of Questions</Label>
        <Controller
          name="numQuestions"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Number of Questions" />}
        />
        <FieldError name="numQuestions" errors={errors} />
      </div>
      <div>
        <Label>Budget (per hour)</Label>
        <Controller
          name="budget"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Budget" />}
        />
        <FieldError name="budget" errors={errors} />
      </div>
      <div>
        <Label>University</Label>
        <Controller
          name="university"
          control={control}
          render={({ field }) => <Input {...field} placeholder="University" />}
        />
        <FieldError name="university" errors={errors} />
      </div>
      <div>
        <Label>Help Type</Label>
        <Controller
          name="helpType"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Help Type" />}
        />
        <FieldError name="helpType" errors={errors} />
      </div>
      <div>
        <Label>Question Types</Label>
        <Controller
          name="questionTypes"
          control={control}
          render={({ field }) => (
            <MultiSelect
              options={['MCQ', 'Theory', 'Numerical'].map((type) => ({ label: type, value: type }))}
              value={field.value.map((val) => ({ label: val, value: val }))}
              onChange={(options) => field.onChange(options.map((option) => option.value))}
              placeholder="Select question types"
            />
          )}
        />
        <FieldError name="questionTypes" errors={errors} />
      </div>
      <div>
        <Label>Additional Services</Label>
        <Controller
          name="additionalServices"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Additional Services" />}
        />
        <FieldError name="additionalServices" errors={errors} />
      </div>
      <div>
        <Label>Help Modes</Label>
        <Controller
          name="helpModes"
          control={control}
          render={({ field }) => (
            <MultiSelect
              options={['Live', 'Chat', 'Email'].map((mode) => ({ label: mode, value: mode }))}
              value={field.value.map((val) => ({ label: val, value: val }))}
              onChange={(options) => field.onChange(options.map((option) => option.value))}
              placeholder="Select help modes"
            />
          )}
        />
        <FieldError name="helpModes" errors={errors} />
      </div>
      <div>
        <Label>Date & Time</Label>
        <Controller
          name="dateTime"
          control={control}
          render={({ field }) => (
            <Input
              type="datetime-local"
              value={
                field.value instanceof Date ? field.value.toISOString().slice(0, 16) : field.value
              }
              onChange={(e) => field.onChange(new Date(e.target.value))}
            />
          )}
        />
        <FieldError name="dateTime" errors={errors} />
      </div>
      <div>
        <Label>Duration (hours)</Label>
        <Controller
          name="duration"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Duration in hours" />}
        />
        <FieldError name="duration" errors={errors} />
      </div>
      <div>
        <Label>Requirements / Description</Label>
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <Textarea {...field} rows={4} placeholder="Describe your help request" />
          )}
        />
        <FieldError name="requirements" errors={errors} />
      </div>
      <div className="mb-6">
        <Label className="mb-2 block">Upload Files</Label>
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
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>
        {uploadedFiles.length > 0 && (
          <div className="mt-2">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span>{file.fileName}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUploadedFile(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
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
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
}

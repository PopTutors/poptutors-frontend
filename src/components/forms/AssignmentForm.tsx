import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { MultiSelect } from '../ui/multi-select';
import Textarea from '../ui/textarea';
import { UploadIcon } from 'lucide-react';
import FieldError from '../ui/FieldError';

// 1) Validation schema
const formSchema = z.object({
  subject: z.string().min(1, 'Academic Subject is required'),
  assignmentType: z.string().min(1, 'Assignment Type is required'),
  expertiseLevel: z.string().min(1, 'Expertise Level is required'),
  additionalServices: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  timeframe: z.string().min(1, 'Timeframe is required'),
  budget: z.string().min(1, 'Budget is required'),
  universityName: z.string().min(1, 'University/Organization is required'),
  courseSubject: z.string().min(1, 'Subject is required'),
  topicName: z.string().min(1, 'Topic Name is required'),
  courseCode: z.string().min(1, 'Course Code is required'),
  professorName: z.string().min(1, 'Professor Name is required'),
  dateTime: z.string().min(1, 'Date and Time is required'),
  requirements: z.string().optional(),
});

export const AssignmentForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: 'Computer Science',
      assignmentType: 'Case Studies',
      expertiseLevel: '',
      additionalServices: '',
      language: '',
      skills: ['Python', 'React Js', 'Node Js'],
      timeframe: '',
      budget: '',
      universityName: '',
      courseSubject: '',
      topicName: '',
      courseCode: '',
      professorName: '',
      dateTime: '',
      requirements: '',
    },
  });

  // --- options ---
  const subjects = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
  ];

  const assignmentTypes = [
    { value: 'Case Studies', label: 'Case Studies' },
    { value: 'Algorithms', label: 'Algorithms' },
    { value: 'Data Structures', label: 'Data Structures' },
    { value: 'Web Development', label: 'Web Development' },
  ];

  const expertiseLevels = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Expert', label: 'Expert' },
  ];

  const languages = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
  ];

  const timeframeOptions = [
    { value: 'EET', label: 'Eastern European Time (EET), Cairo UTC+3' },
    { value: 'IST', label: 'India Standard Time (IST), UTC+5:30' },
    { value: 'GMT', label: 'Greenwich Mean Time (GMT), UTC+0' },
    { value: 'PST', label: 'Pacific Standard Time (PST), UTC−8' },
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

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  return (
    <>
      <div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Submit New Assignment</h1>
          <hr className="border-t border-[2px] border-gray-200 w-32 mt-[4px]" />
        </div>
        <div className="flex justify-end">
          <Button variant="pill_outline" size="pill" className="py-2">
            Upload File
            <UploadIcon />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Academic Subjects */}
          <div>
            <Label>Academic Subjects</Label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select options={subjects} placeholder="Computer Science" {...field} />
              )}
            />
            <FieldError name="subject" errors={errors} />
          </div>

          {/* 1. Assignment Types */}
          <div>
            <Label>Assignment Types</Label>
            <Controller
              name="assignmentType"
              control={control}
              render={({ field }) => (
                <Select options={assignmentTypes} placeholder="Case Studies" {...field} />
              )}
            />
            <FieldError name="assignmentType" errors={errors} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2. Expertise Levels */}
          <div>
            <Label>Expertise Levels</Label>
            <Controller
              name="expertiseLevel"
              control={control}
              render={({ field }) => (
                <Select options={expertiseLevels} placeholder="Select Expertise Level" {...field} />
              )}
            />
            <FieldError name="expertiseLevel" errors={errors} />
          </div>

          {/* 2. Additional Services */}
          <div>
            <Label>Additional Services</Label>
            <Controller
              name="additionalServices"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Any additional services?" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 3. Language Support */}
          <div>
            <Label>Language Support</Label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Select options={languages} placeholder="Select Language" {...field} />
              )}
            />
            <FieldError name="language" errors={errors} />
          </div>

          {/* 3. Skills */}
          <div>
            <Label>Skills</Label>
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={skillOptions.map((s) => ({ label: s, value: s }))}
                  {...field}
                />
              )}
            />
            <FieldError name="skills" errors={errors} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 4. Timeframe for Completion */}
          <div>
            <Label>Timeframe for Completion</Label>
            <Controller
              name="timeframe"
              control={control}
              render={({ field }) => (
                <Select options={timeframeOptions} placeholder="Select Timezone" {...field} />
              )}
            />
            <FieldError name="timeframe" errors={errors} />
          </div>

          {/* 4. Budget */}
          <div>
            <Label>Budget</Label>
            <Controller
              name="budget"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="For budget the currency selection" />
              )}
            />
            <FieldError name="budget" errors={errors} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 5. University Name / Organization */}
          <div>
            <Label>University Name / Organization</Label>
            <Controller
              name="universityName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter University Name" />}
            />
            <FieldError name="universityName" errors={errors} />
          </div>

          {/* 5. Subject (Course Subject) */}
          <div>
            <Label>Subject</Label>
            <Controller
              name="courseSubject"
              control={control}
              render={({ field }) => (
                <Select options={subjects} placeholder="Select Subject" {...field} />
              )}
            />
            <FieldError name="courseSubject" errors={errors} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 6. Topic Name */}
          <div>
            <Label>Topic Name</Label>
            <Controller
              name="topicName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Topic Name" />}
            />
            <FieldError name="topicName" errors={errors} />
          </div>

          {/* 6. Course Code */}
          <div>
            <Label>Course Code</Label>
            <Controller
              name="courseCode"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter Course Code" />}
            />
            <FieldError name="courseCode" errors={errors} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 7. Professor Name */}
          <div>
            <Label>Professor Name</Label>
            <Controller
              name="professorName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Professor Name" />}
            />
            <FieldError name="professorName" errors={errors} />
          </div>

          {/* 7. Date and Time */}
          <div>
            <Label>Date and Time</Label>
            <Controller
              name="dateTime"
              control={control}
              render={({ field }) => <Input {...field} type="datetime-local" />}
            />
            <FieldError name="dateTime" errors={errors} />
          </div>
        </div>

        {/* Specific Requirements or Instructions */}
        <div>
          <Label>Specific Requirements or Instructions</Label>
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => <Textarea {...field} rows={4} placeholder="Write here..." />}
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="pill_outline" size="pill">
            Cancel
          </Button>
          <Button variant="pill_solid" size="pill">
            Submit Request
          </Button>
        </div>
      </form>
    </>
  );
};

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
import { useGenericMutation } from '../../api/useGenericMutation';

// ✅ Validation schema
const formSchema = z.object({
  subject: z.string(),
  assignmentType: z.string(),
  expertiseLevel: z.string(),
  additionalServices: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  skills: z.array(z.string()),
  timeframe: z.string(),
  budget: z.string(),
  universityName: z.string(),
  courseSubject: z.string(),
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
      subject: '',
      assignmentType: '',
      expertiseLevel: '',
      additionalServices: '',
      language: '',
      skills: [],
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

  // ✅ Options
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

  const { mutate, isLoading } = useGenericMutation<{ id: number; name: string }>();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('✅ Form Submitted Data:', data);

    mutate({
      endpoint: '/assignments', // API endpoint
      data: { data }, // POST data
      method: 'POST', // default POST
      requiresAuth: true, // auth header required
      successMessage: 'User added successfully!',
      errorMessage: 'Failed to add user',
      invalidateKeys: ['assignments'], // query key refresh
      onSuccessCallback: (res) => {
        console.log('User Created:', res);
      },
      onErrorCallback: (err) => {
        alert(err);
        console.error('Error Creating User:', err);
      },
    });
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
        {/* Subject & Assignment Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Academic Subjects</Label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select
                  options={subjects}
                  placeholder="Select Subject"
                  value={subjects.find((opt) => opt.value === field.value) || null}
                  onChange={(opt) => field.onChange(opt?.value || '')}
                />
              )}
            />
            <FieldError name="subject" errors={errors} />
          </div>

          <div>
            <Label>Assignment Types</Label>
            <Controller
              name="assignmentType"
              control={control}
              render={({ field }) => (
                <Select
                  options={assignmentTypes}
                  placeholder="Select Type"
                  value={assignmentTypes.find((opt) => opt.value === field.value) || null}
                  onChange={(opt) => field.onChange(opt?.value || '')}
                />
              )}
            />
            <FieldError name="assignmentType" errors={errors} />
          </div>
        </div>

        {/* Expertise Level & Additional Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Expertise Levels</Label>
            <Controller
              name="expertiseLevel"
              control={control}
              render={({ field }) => (
                <Select
                  options={expertiseLevels}
                  placeholder="Select Level"
                  value={expertiseLevels.find((opt) => opt.value === field.value) || null}
                  onChange={(opt) => field.onChange(opt?.value || '')}
                />
              )}
            />
            <FieldError name="expertiseLevel" errors={errors} />
          </div>

          <div>
            <Label>Additional Services</Label>
            <Controller
              name="additionalServices"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Any additional services?" />}
            />
          </div>
        </div>

        {/* Language & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Language Support</Label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Select
                  options={languages}
                  placeholder="Select Language"
                  value={languages.find((opt) => opt.value === field.value) || null}
                  onChange={(opt) => field.onChange(opt?.value || '')}
                />
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
                  options={skillOptions.map((s) => ({ label: s, value: s }))}
                  value={field.value?.map((v) => ({ label: v, value: v })) || []}
                  onChange={(val) => field.onChange(val.map((v) => v.value))}
                />
              )}
            />
            <FieldError name="skills" errors={errors} />
          </div>
        </div>

        {/* Timeframe & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Timeframe for Completion</Label>
            <Controller
              name="timeframe"
              control={control}
              render={({ field }) => (
                <Select
                  options={timeframeOptions}
                  placeholder="Select Timezone"
                  value={timeframeOptions.find((opt) => opt.value === field.value) || null}
                  onChange={(opt) => field.onChange(opt?.value || '')}
                />
              )}
            />
            <FieldError name="timeframe" errors={errors} />
          </div>

          <div>
            <Label>Budget</Label>
            <Controller
              name="budget"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter budget with currency" />}
            />
            <FieldError name="budget" errors={errors} />
          </div>
        </div>

        {/* University & Course Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>University Name / Organization</Label>
            <Controller
              name="universityName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter University Name" />}
            />
            <FieldError name="universityName" errors={errors} />
          </div>

          <div>
            <Label>Subject</Label>
            <Controller
              name="courseSubject"
              control={control}
              render={({ field }) => (
                <Select
                  options={subjects}
                  placeholder="Select Subject"
                  value={subjects.find((opt) => opt.value === field.value) || null}
                  onChange={(opt) => field.onChange(opt?.value || '')}
                />
              )}
            />
            <FieldError name="courseSubject" errors={errors} />
          </div>
        </div>

        {/* Topic Name & Course Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Topic Name</Label>
            <Controller
              name="topicName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Topic Name" />}
            />
            <FieldError name="topicName" errors={errors} />
          </div>

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

        {/* Professor Name & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Professor Name</Label>
            <Controller
              name="professorName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Professor Name" />}
            />
            <FieldError name="professorName" errors={errors} />
          </div>

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

        {/* Requirements */}
        <div>
          <Label>Specific Requirements or Instructions</Label>
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => <Textarea {...field} rows={4} placeholder="Write here..." />}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="pill_outline" size="pill" type="button">
            Cancel
          </Button>
          <Button variant="pill_solid" size="pill" type="submit">
            Submit Request
          </Button>
        </div>
      </form>
    </>
  );
};

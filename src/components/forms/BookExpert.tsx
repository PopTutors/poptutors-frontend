'use client';

import { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { MultiSelect } from '../ui/multi-select';
import Textarea from '../ui/textarea';
import { DateTimeDurationInput } from '../ui/DateTimeDurationInput';
import { UploadIcon } from 'lucide-react';
import FieldError from '../ui/FieldError';

const formSchema = z.object({
  subject: z.string().min(1),
  topic: z.string().min(1),
  expertise: z.string().min(1),
  courseCode: z.string().optional(),
  language: z.string().min(1),
  skills: z.array(z.string()).min(1),
  numQuestions: z.string().min(1),
  budget: z.string().optional(),
  university: z.string().min(1),
  helpType: z.string().min(1),
  questionTypes: z.array(z.string()),
  additionalServices: z.string().optional(),
  helpModes: z.array(z.string()).min(1),
  dateTime: z.date(),
  duration: z.string().min(1),
  requirements: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function BookExpertForm() {
  const [customQuestionType, setCustomQuestionType] = useState('');
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  const subjects = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
  ];
  const topics = [
    { value: 'Case Studies', label: 'Case Studies' },
    { value: 'Algorithms', label: 'Algorithms' },
    { value: 'Data Structures', label: 'Data Structures' },
    { value: 'Web Dev', label: 'Web Development' },
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
  const questionTypeOptions = ['MCQ Type', 'Writing Type', 'Diagram', 'Code', 'Other'];
  const helpTypeOptions = [
    { value: 'Certifications', label: 'Certifications' },
    { value: 'Live University Exam', label: 'Live University Exam' },
    { value: 'Quiz', label: 'Quiz' },
    { value: 'Live Interview', label: 'Live Interview' },
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
  const numQuestionsOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5+', label: '5+' },
  ];

  const addCustomQuestionType = () => {
    if (!customQuestionType.trim()) return;
    const current = getValues('questionTypes');
    setValue('questionTypes', [...current, customQuestionType.trim()]);
    setCustomQuestionType('');
  };

  const selectedQuestionTypes =
    useWatch({
      control,
      name: 'questionTypes',
    }) || [];

  const onSubmit = (data: FormData) => {
    console.log('Submit ▶️', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header + Upload */}
      <div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Book an Expert</h1>
          <hr className="border-t border-[2px] border-gray-200 w-32 mt-[4px]" />
        </div>
        <div className="flex justify-end">
          <Button variant="pill_outline" size="pill" className="py-2">
            Upload File
            <UploadIcon />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* 1 */}
        <div>
          <Label>Subjects</Label>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Select {...field} options={subjects} placeholder="Select Subject" />
            )}
          />
          <FieldError name="subject" errors={errors} />
        </div>
        <div>
          <Label>Topics</Label>
          <Controller
            name="topic"
            control={control}
            render={({ field }) => (
              <Select {...field} options={topics} placeholder="Select Topic" />
            )}
          />
          <FieldError name="topic" errors={errors} />
        </div>

        {/* 2 */}
        <div>
          <Label>Expertise Levels</Label>
          <Controller
            name="expertise"
            control={control}
            render={({ field }) => (
              <Select {...field} options={expertiseLevels} placeholder="Select Expertise Level" />
            )}
          />
          <FieldError name="expertise" errors={errors} />
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

        {/* 3 */}
        <div>
          <Label>Language Support</Label>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Select {...field} options={languages} placeholder="Select Language" />
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
                placeholder="Select skills"
                options={skillOptions.map((s) => ({ label: s, value: s }))}
                {...field}
              />
            )}
          />
          <FieldError name="skills" errors={errors} />
        </div>

        {/* 4 */}
        <div>
          <Label>No. of Questions</Label>
          <Controller
            name="numQuestions"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={numQuestionsOptions}
                placeholder="Select No. of Questions"
              />
            )}
          />
          <FieldError name="numQuestions" errors={errors} />
        </div>
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

        {/* 5 */}
        <div>
          <Label>University Name</Label>
          <Controller
            name="university"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter University Name" />}
          />
          <FieldError name="university" errors={errors} />
        </div>
        <div>
          <Label>Help Type</Label>
          <Controller
            name="helpType"
            control={control}
            render={({ field }) => (
              <Select {...field} options={helpTypeOptions} placeholder="Select type of help" />
            )}
          />
          <FieldError name="helpType" errors={errors} />
        </div>

        {/* 6 — Question Types */}
        <div>
          <Label>Question Type</Label>
          <div className="grid grid-rows-3 grid-flow-col gap-x-4 gap-y-4 mt-1">
            {questionTypeOptions.map((opt) => (
              <label key={opt} className="inline-flex items-center space-x-1">
                <Input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectedQuestionTypes.includes(opt)}
                  onChange={() => {
                    const cur = getValues('questionTypes');
                    setValue(
                      'questionTypes',
                      cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt]
                    );
                  }}
                />
                <span className="font-poppinsregular text-sm">{opt}</span>
              </label>
            ))}

            <div className="block inline-flex items-center space-x-1 max-h-6">
              <Input
                className="w-32"
                value={customQuestionType}
                onChange={(e) => setCustomQuestionType(e.target.value)}
                placeholder="Other"
              />
              <Button variant="pill_outline" size="pill" onClick={addCustomQuestionType}>
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* 7 — Help Mode */}
        <div>
          <Label>Help Mode</Label>
          <div className="grid grid-rows-3 grid-flow-col gap-x-4 gap-y-4 mt-1">
            {['Chat', 'Call', 'Whatsapp'].map((mode) => (
              <label key={mode} className="inline-flex items-center space-x-1">
                <Input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectedQuestionTypes.includes(mode)}
                  onChange={() => {
                    const cur = getValues('questionTypes');
                    setValue(
                      'questionTypes',
                      cur.includes(mode) ? cur.filter((x) => x !== mode) : [...cur, mode]
                    );
                  }}
                />
                <span className="font-poppinsregular text-sm">{mode}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label>Additional Services</Label>
          <Controller
            name="additionalServices"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Type if you need any additional services"
              />
            )}
          />
          <FieldError name="additionalServices" errors={errors} />
        </div>

        {/* 8 — Date & Duration */}
        <div>
          <Label>Date and Time Slot</Label>
          <Controller
            name="dateTime"
            control={control}
            render={({ field }) => (
              <DateTimeDurationInput {...field} durationField={{ name: 'duration', control }} />
            )}
          />
          <FieldError name="dateTime" errors={errors} />
        </div>

        {/* 9 — Requirements */}
        <div className="col-span-full">
          <Label>Specific Requirements or Instructions</Label>
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => <Textarea {...field} rows={4} placeholder="Write here..." />}
          />
          <FieldError name="requirements" errors={errors} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end space-x-4 mt-8">
        <Button variant="pill_outline" size="pill">
          Cancel
        </Button>
        <Button type="submit" variant="pill_solid" size="pill">
          Book Now
        </Button>
      </div>
    </form>
  );
}

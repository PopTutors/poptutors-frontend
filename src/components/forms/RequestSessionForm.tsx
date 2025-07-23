import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { MultiSelect } from "../ui/multi-select";
import Textarea from "../ui/textarea";
import { DateTimeDurationInput } from "../ui/DateTimeDurationInput";
import FieldError from "../ui/FieldError";

// Zod validation schema
const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  expertiseLevel: z.string().min(1, "Expertise level is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  language: z.string().min(1, "Language is required"),
  budget: z.string().min(1, "Budget is required"),
  universityName: z.string().min(1, "University name is required"),
  sessionAgenda: z.string().min(1, "Session agenda is required"),
  additionalServices: z.string().optional(),
  dateTime: z.date({ required_error: "Date and time is required" }),
  duration: z.string().min(1, "Duration is required"),
  requirements: z.string().optional(),
});

const RequestSessionForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "Computer Science",
      topic: "Case Studies",
      expertiseLevel: "",
      skills: ["Python", "React Js", "Node Js"],
      language: "",
      budget: "",
      universityName: "",
      sessionAgenda: "Subject tutoring",
      additionalServices: "",
      dateTime: new Date(),
      duration: "1 hour",
      requirements: "",
    },
  });

  const subjects = [
    { value: "Computer Science", label: "Computer Science" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Physics", label: "Physics" },
    { value: "Chemistry", label: "Chemistry" },
  ];

  const skillOptions = [
    "Python",
    "React Js",
    "Node Js",
    "JavaScript",
    "HTML",
    "CSS",
    "Angular",
    "Vue.js",
  ];

  const languages = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
  ];

  const agendaOptions = [
    "Subject tutoring",
    "Exam Preparation",
    "Project and Thesis",
    "Professional Certification Training",
    "Career Counselling",
    "Skill Building",
  ];

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  return (
    <>
      <div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Request Session
          </h1>
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
          {/* Subjects */}
          <div>
            <Label>Subjects</Label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select
                  options={subjects}
                  placeholder="Select Subject"
                  {...field}
                />
              )}
            />
            <FieldError name="subject" errors={errors} />
          </div>

          {/* Topics */}
          <div>
            <Label>Topics</Label>
            <Controller
              name="topic"
              control={control}
              render={({ field }) => (
                <Select
                  options={subjects}
                  placeholder="Select Topic"
                  {...field}
                />
              )}
            />
            <FieldError name="topic" errors={errors} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expertise Levels */}
          <div>
            <Label>Expertise Levels</Label>
            <Controller
              name="expertiseLevel"
              control={control}
              render={({ field }) => <Select options={subjects} {...field} />}
            />
            <FieldError name="expertiseLevel" errors={errors} />
          </div>

          {/* Skills */}
          <div>
            <Label>Skills</Label>
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={skillOptions.map((skill) => ({
                    label: skill,
                    value: skill,
                  }))}
                  placeholder="select skills"
                  {...field}
                />
              )}
            />
            <FieldError name="skills" errors={errors} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language */}
          <div>
            <Label>Language</Label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Select
                  options={languages}
                  placeholder="Select Language"
                  {...field}
                />
              )}
            />
            <FieldError name="language" errors={errors} />
          </div>

          {/* Budget */}
          <div>
            <Label>Budget</Label>
            <Controller
              name="budget"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="For budget the currency selection"
                />
              )}
            />
            <FieldError name="budget" errors={errors} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* University Name/Organization */}
          <div>
            <Label>University Name/Organization</Label>
            <Controller
              name="universityName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter University Name"
                />
              )}
            />
            <FieldError name="universityName" errors={errors} />
          </div>

          {/* Session Agenda */}
          <div>
            <Label>Session Agenda</Label>
            <Controller
              name="sessionAgenda"
              control={control}
              render={({ field }) => (
                <Select
                  options={agendaOptions.map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  placeholder="Select Session Agenda"
                  {...field}
                />
              )}
            />
            <FieldError name="sessionAgenda" errors={errors} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Additional Services */}
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
          {/* Date and Time Slot */}
          <div>
            <Label>Date and Time Slot</Label>
            <Controller
              name="dateTime"
              control={control}
              render={({ field }) => (
                <DateTimeDurationInput
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                  durationField={{
                    name: "duration",
                    control: control,
                  }}
                />
              )}
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
            render={({ field }) => (
              <Textarea {...field} rows={5} placeholder="Write here..." />
            )}
          />
          <FieldError name="requirements" errors={errors} />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="pill_outline" size="pill">
            Cancel
          </Button>
          <Button variant="pill_solid" size="pill">
            Book Now
          </Button>
        </div>
      </form>
    </>
  );
};

export default RequestSessionForm;

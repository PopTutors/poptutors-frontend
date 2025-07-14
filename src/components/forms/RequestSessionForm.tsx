import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment } from "react";
import { Listbox, Transition, Menu } from "@headlessui/react";
import { ChevronDown, Upload, Calendar, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
  dateTime: z.string().min(1, "Date and time is required"),
  duration: z.string().min(1, "Duration is required"),
  requirements: z.string().optional(),
});

const RequestSessionForm = () => {
  const [selectedSkills, setSelectedSkills] = useState([
    "Python",
    "React Js",
    "Node Js",
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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
      dateTime: "16 March 11 PM - 12 PM (GET), Cairo UTC +3",
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

  const topics = [
    { value: "Case Studies", label: "Case Studies" },
    { value: "Algorithms", label: "Algorithms" },
    { value: "Data Structures", label: "Data Structures" },
    { value: "Web Development", label: "Web Development" },
  ];

  const expertiseLevels = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
    { value: "Expert", label: "Expert" },
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

  const handleSkillToggle = (skill: any) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    setSelectedSkills(newSkills);
    setValue("skills", newSkills);
  };

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subjects */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjects
          </label>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Listbox value={field.value} onChange={field.onChange}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="block truncate text-gray-900">
                      {field.value}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {subjects.map((subject) => (
                        <Listbox.Option
                          key={subject.value}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-3 pr-9 ${
                              active
                                ? "bg-blue-50 text-blue-900"
                                : "text-gray-900"
                            }`
                          }
                          value={subject.value}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {subject.label}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                  <Check
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            )}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Topics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topics
          </label>
          <Controller
            name="topic"
            control={control}
            render={({ field }) => (
              <Listbox value={field.value} onChange={field.onChange}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="block truncate text-gray-900">
                      {field.value}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {topics.map((topic) => (
                        <Listbox.Option
                          key={topic.value}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-3 pr-9 ${
                              active
                                ? "bg-blue-50 text-blue-900"
                                : "text-gray-900"
                            }`
                          }
                          value={topic.value}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {topic.label}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                  <Check
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            )}
          />
          {errors.topic && (
            <p className="text-red-500 text-sm mt-1">{errors.topic.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expertise Levels */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expertise Levels
          </label>
          <Controller
            name="expertiseLevel"
            control={control}
            render={({ field }) => (
              <Listbox value={field.value} onChange={field.onChange}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="block truncate text-gray-400">
                      {field.value || "Select Expertise Levels"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {expertiseLevels.map((level) => (
                        <Listbox.Option
                          key={level.value}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-3 pr-9 ${
                              active
                                ? "bg-blue-50 text-blue-900"
                                : "text-gray-900"
                            }`
                          }
                          value={level.value}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {level.label}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                  <Check
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            )}
          />
          {errors.expertiseLevel && (
            <p className="text-red-500 text-sm mt-1">
              {errors.expertiseLevel.message}
            </p>
          )}
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills
          </label>
          <div className="relative">
            <div className="min-h-[42px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      type="button"
                      className="ml-1 text-blue-600 hover:text-blue-800"
                      onClick={() => handleSkillToggle(skill)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <Menu as="div" className="relative mt-1">
              <Menu.Button className="absolute right-3 top-[-35px] text-gray-400">
                <ChevronDown className="h-4 w-4" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute z-10 mt-1 w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {skillOptions.map((skill) => (
                    <Menu.Item key={skill}>
                      {({ active }) => (
                        <button
                          type="button"
                          className={`${
                            active
                              ? "bg-blue-50 text-blue-900"
                              : "text-gray-900"
                          } group flex w-full items-center px-3 py-2 text-sm`}
                          onClick={() => handleSkillToggle(skill)}
                        >
                          <span className="flex-1 text-left">{skill}</span>
                          {selectedSkills.includes(skill) && (
                            <Check className="h-4 w-4 text-blue-600" />
                          )}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          {errors.skills && (
            <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Listbox value={field.value} onChange={field.onChange}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="block truncate text-gray-400">
                      {field.value || "Select Language"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {languages.map((language) => (
                        <Listbox.Option
                          key={language.value}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-3 pr-9 ${
                              active
                                ? "bg-blue-50 text-blue-900"
                                : "text-gray-900"
                            }`
                          }
                          value={language.value}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {language.label}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                  <Check
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            )}
          />
          {errors.language && (
            <p className="text-red-500 text-sm mt-1">
              {errors.language.message}
            </p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget
          </label>
          <Controller
            name="budget"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="For budget the currency selection"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            )}
          />
          {errors.budget && (
            <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* University Name/Organization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            University Name/Organization
          </label>
          <Controller
            name="universityName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Enter University Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            )}
          />
          {errors.universityName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.universityName.message}
            </p>
          )}
        </div>

        {/* Session Agenda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Agenda
          </label>
          <Controller
            name="sessionAgenda"
            control={control}
            render={({ field }) => (
              <Listbox value={field.value} onChange={field.onChange}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="block truncate text-gray-900">
                      {field.value || "Select type of help you Session Agenda"}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown
                        className="h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {agendaOptions.map((agenda) => (
                        <Listbox.Option
                          key={agenda}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-3 pr-9 ${
                              active
                                ? "bg-blue-50 text-blue-900"
                                : "text-gray-900"
                            }`
                          }
                          value={agenda}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {agenda}
                              </span>
                              {selected && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                  <Check
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            )}
          />
          {errors.sessionAgenda && (
            <p className="text-red-500 text-sm mt-1">
              {errors.sessionAgenda.message}
            </p>
          )}
        </div>
      </div>

      {/* Additional Services */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Services
        </label>
        <Controller
          name="additionalServices"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={3}
              placeholder="Type if you need any additional services"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none"
            />
          )}
        />
      </div>

      {/* Date and Time Slot */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date and Time Slot
        </label>
        <div className="flex gap-4">
          <Controller
            name="dateTime"
            control={control}
            render={({ field }) => (
              <div className="flex-1 relative">
                <Input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-600"
                  readOnly
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            )}
          />
          <Controller
            name="duration"
            control={control}
            render={({ field }) => (
              <div className="w-24 relative">
                <Input
                  {...field}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                  readOnly
                />
              </div>
            )}
          />
        </div>
        {errors.dateTime && (
          <p className="text-red-500 text-sm mt-1">{errors.dateTime.message}</p>
        )}
      </div>

      {/* Specific Requirements or Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specific Requirements or Instructions
        </label>
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={4}
              placeholder="Write Here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none"
            />
          )}
        />
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline_rounded" className="px-6 py-2">
          Cancel
        </Button>
        <Button variant="outline_rounded_1" className="px-6 py-2">
          Book Now
        </Button>
      </div>
    </form>
  );
};

export default RequestSessionForm;

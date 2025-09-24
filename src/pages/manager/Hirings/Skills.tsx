const Skills = () => {
  const skills = [
    'Project Management',
    'Copywriting',
    'English',
    'Social Media Marketing',
    'Copy Editing',
  ];

  return (
    <div className="bg-[#fafafa] border border-[rgba(20, 20, 20, 0.1)] p-6 mb-6">
      <h2 className="text-[20px] font-bold text-[rgba(20, 20, 20, 1)]-600 mb-5">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="text-center text-[16px] bg-[#019ACB14] text-[#019ACB] px-2 py-1 w-auto h-34"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Skills;

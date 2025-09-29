import React from "react";

interface SkillsProps {
  skills?: string[];
}

const Skills: React.FC<SkillsProps> = ({ skills = [] }) => {
  return (
    <div className="bg-white p-6 mb-6 shadow-sm ">
      <h2 className="text-[20px] font-bold text-[#141414] mb-5">Skills</h2>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="font-medium text-[14px] bg-[#019ACB14] text-[#019ACB] px-3 py-2 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[14px] text-gray-500 italic">No skills added yet.</p>
      )}
    </div>
  );
};

export default Skills;

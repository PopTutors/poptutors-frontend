const EducationTab = () => {
  const educationData = [
    {
      id: 1,
      institution: 'T. John College, No.80/1, Gottigere post, bannergatta Road, Bangalore-83',
      degree: "Bachelor's degree, Computer Programming, Specific Applications",
      duration: 'Sep 2024 - Present',
    },
    {
      id: 2,
      institution: 'B.C.A, Computer Programming',
      degree: "Bachelor's degree, Computer Programming, Specific Applications",
      duration: 'Sep 2010 - 2013',
    },
  ];

  return (
    <div className="bg-[#fafafa] border border-[rgba(20, 20, 20, 0.1)] p-6 ">
      <h2 className="text-[24px] font-semibold text-[#141414] mb-6">Education</h2>
      <div className="space-y-6">
        {educationData.map((education) => (
          <div key={education.id} className="flex items-start gap-4">
            {/* Red circular avatar */}
            <div className="w-12 h-12 bg-[#FF9292] rounded-full flex-shrink-0"></div>

            <div className="flex-1">
              <h3 className="font-semibold text-[#141414] text-[22px] mb-1">
                {education.institution}
              </h3>
              <p className="text-[#141414] text-[16px] mb-2">{education.degree}</p>
              <p className="text-[#595959] text-[16px]">{education.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationTab;

const ExperienceTab = () => {
  const experiences = [
    {
      id: 1,
      title: 'Founding Designer',
      company: 'Swish',
      type: 'Full-time',
      duration: 'Sep 2024 - Present • 9 Months',
      location: 'Bengaluru, Karnataka, India • On-site',
    },
    {
      id: 2,
      title: 'Founding Designer',
      company: 'Swish',
      type: 'Full-time',
      duration: 'Sep 2024 - Present • 9 Months',
      location: 'Bengaluru, Karnataka, India • On-site',
    },
    {
      id: 3,
      title: 'Founding Designer',
      company: 'Swish',
      type: 'Full-time',
      duration: 'Sep 2024 - Present • 9 Months',
      location: 'Bengaluru, Karnataka, India • On-site',
    },
    {
      id: 4,
      title: 'Founding Designer',
      company: 'Swish',
      type: 'Full-time',
      duration: 'Sep 2024 - Present • 9 Months',
      location: 'Bengaluru, Karnataka, India • On-site',
    },
    {
      id: 5,
      title: 'Founding Designer',
      company: 'Swish',
      type: 'Full-time',
      duration: 'Sep 2024 - Present • 9 Months',
      location: 'Bengaluru, Karnataka, India • On-site',
    },
  ];

  return (
    <div className="bg-[#fafafa] border border-[rgba(20, 20, 20, 0.1)] p-6 ">
      <h2 className="text-[24px] font-semibold text-gray-900 mb-6">Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="flex gap-4">
            <div className="w-12 h-12 bg-[#FF9292] rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-[22px] font-semibold text-[#141414]">{exp.title}</h3>
                <span className="text-[#141414] text-[18px]">{exp.company}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600 text-[16px]">{exp.type}</span>
              </div>
              <p className="text-[#595959] text-[16px] mb-1">{exp.duration}</p>
              <p className="text-[#595959] text-[16px]">{exp.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceTab;

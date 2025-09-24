const CertificationsTab = () => {
  const certifications = [
    {
      id: 1,
      title: 'Conduct UX Research and Test Early Concepts',
      issuer: 'Google',
      issueDate: 'Issued Sep 2021',
      credentialId: 'B85DS9ACEVS',
    },
    {
      id: 2,
      title: 'Conduct UX Research and Test Early Concepts',
      issuer: 'Google',
      issueDate: 'Issued Sep 2021',
      credentialId: 'B85DS9ACEVS',
    },
    {
      id: 3,
      title: 'Conduct UX Research and Test Early Concepts',
      issuer: 'Google',
      issueDate: 'Issued Sep 2021',
      credentialId: 'B85DS9ACEVS',
    },
    {
      id: 4,
      title: 'Conduct UX Research and Test Early Concepts',
      issuer: 'Google',
      issueDate: 'Issued Sep 2021',
      credentialId: 'B85DS9ACEVS',
    },
  ];

  return (
    <div className="bg-[#fafafa] border border-[rgba(20, 20, 20, 0.1)] p-6">
      <h2 className="text-[24px] font-semibold text-gray-900 mb-6">Licenses & certifications</h2>
      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <div
            key={cert.id}
            className={`flex items-start gap-4 p-4 ${index !== certifications.length - 1 && 'border-b '}`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center">
              <div className="w-8 h-8 relative">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-[22px] font-semibold text-[#141414]-900 mb-1">{cert.title}</h3>
              <p className="text-[16px] text-gray-600 mb-2">{cert.issuer}</p>
              <div className="flex items-center gap-4 text-[16px] text-[#595959] mb-3">
                <span>{cert.issueDate}</span>
                <span>Credential ID: {cert.credentialId}</span>
              </div>
              <button className="px-4 py-2 text-[#019ACB] border border-[#019ACB] rounded-full text-[16px] hover:bg-blue-50 transition-colors">
                Show credential
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsTab;

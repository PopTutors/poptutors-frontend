import React, { useState } from "react";

interface ResumeTabProps {
  profile?: {
    latestResume?: string; // URL of latest resume
    resumes?: { fileUrl: string; uploadedAt: string }[];
  };
}

const ResumeTab: React.FC<ResumeTabProps> = ({ profile }) => {
  const [pdfFile, setPdfFile] = useState < File | null > (null);
  const [pdfUrl, setPdfUrl] = useState < string | null > (
    profile?.latestResume || null
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="bg-white p-6 mb-6 shadow-sm  min-h-[500px]">
      <h2 className="text-[24px] font-semibold text-[#141414] mb-6">Resume</h2>

      {!pdfUrl ? (
        <div
          className="h-96 border-2 border-dashed border-gray-300  flex flex-col items-center justify-center text-center p-8 hover:border-blue-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="w-16 h-16 mx-auto bg-blue-100  flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Upload Resume PDF
          </h3>
          <p className="text-gray-600 mb-6">
            Drag and drop your PDF file here or click to browse
          </p>
          <label className="bg-blue-600 text-white px-6 py-3  hover:bg-blue-700 transition-colors cursor-pointer">
            Choose PDF File
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="flex flex-col h-[600px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 ">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-medium text-gray-900">
                {pdfFile?.name || "Resume.pdf"}
              </span>
            </div>
            <button
              onClick={() => {
                setPdfFile(null);
                if (pdfUrl && pdfUrl.startsWith("blob:")) {
                  URL.revokeObjectURL(pdfUrl);
                }
                setPdfUrl(null);
              }}
              className="text-gray-500 hover:text-red-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* PDF Preview */}
          <div className="flex-1 border  overflow-hidden">
            <iframe src={pdfUrl} className="w-full h-full" title="Resume PDF" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeTab;

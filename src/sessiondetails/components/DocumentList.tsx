import React from 'react';
import { FaFileAlt } from 'react-icons/fa'; // Using react-icons for file icon

type Document = {
  name: string;
  link: string;
};

const documents: Document[] = [
  { name: 'Report.pdf', link: '#' },
  { name: 'Report.doc', link: '#' },
];

const DocumentList: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <h2 className="text-base font-poppinsregular text-[24px] text-gray-800 mb-4">Documents</h2>

      <div className="flex flex-wrap gap-2">
        {documents.map((doc, index) => (
          <a
            key={index}
            href={doc.link}
            className="flex items-center gap-2 bg-gray-100 text-sm px-3 py-2 rounded-md text-black hover:bg-gray-200 transition"
          >
            <FaFileAlt className="text-gray-600" />
            {doc.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;

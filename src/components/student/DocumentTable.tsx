import { Download } from 'lucide-react';
import { Button } from '../ui/button';

// Helper to format file size
const formatFileSize = (size: number | undefined): string => {
  if (!size) return '';
  if (size > 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  if (size > 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${size} B`;
};

// Helper to format date
const formatDate = (date: string | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  return isNaN(d.getTime()) ? date : d.toLocaleDateString();
};

interface Attachment {
  url: string;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  addedBy?: string;
  date?: string;
}

interface DocumentTableProps {
  attachments?: Attachment[];
}

const DocumentTable = ({ attachments = [] }: DocumentTableProps) => {
  console.log(attachments);
  // Fallback for legacy string array
  const isLegacyStringArray = attachments.length > 0 && typeof attachments[0] === 'string';
  const docs =
    attachments.length > 0
      ? attachments
      : ['https://example.com/doc1.pdf', 'https://example.com/doc2.pdf'];

  return (
    <section className="bg-white rounded-lg">
      <div>
        <div className="flex items-center justify-between p-5">
          <h4 className="text-[18px] font-poppinssemibold text-gray-900">Documents</h4>
          <Button variant="pill_outline" className="font-poppinssemibold text-sm py-1">
            Download Zip
          </Button>
        </div>
        <div className="border-b border-gray-200"></div>

        <div className="bg-white rounded-lg">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3 text-xs font-poppinssemibold text-black">
              <span className="flex-1">FILE NAME</span>
              <span className="w-16 sm:w-20 text-center hidden sm:block">TYPE</span>
              <span className="w-16 sm:w-20 text-center hidden sm:block">SIZE</span>
              <span className="w-16 sm:w-20 text-center hidden sm:block">ADDED BY</span>
              <span className="w-16 sm:w-20 text-center hidden sm:block">DATE</span>
              <span className="w-12 sm:w-16 text-center">ACTION</span>
            </div>
          </div>

          {docs.map((doc: Attachment | string, index: number) => {
            const isString = isLegacyStringArray || typeof doc === 'string';
            const fileName = isString
              ? (doc as string).split('/').pop() || 'Document'
              : (doc as Attachment).fileName || 'Document';
            const ext = fileName.split('.').pop()?.toLowerCase() || '';
            const isPdf = ext === 'pdf';
            const fileType = isString ? ext : (doc as Attachment).fileType || ext;
            const fileSize = isString ? '' : formatFileSize((doc as Attachment).fileSize);
            const url = isString ? (doc as string) : (doc as Attachment).url;
            const addedBy = isString ? 'Unknown' : (doc as Attachment).addedBy || 'Unknown';
            const date = isString ? '' : formatDate((doc as Attachment).date);

            return (
              <div
                key={index}
                className={`px-4 py-3 last:border-b-0 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs ${
                        isPdf ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                    >
                      {isPdf ? '📄' : '📝'}
                    </div>
                    <span className="text-xs font-poppinsregular text-black" title={fileName}>
                      {fileName}
                    </span>
                  </div>
                  <span className="w-16 sm:w-20 text-center text-xs font-poppinsregular text-black hidden sm:block">
                    <span>{fileType}</span>
                  </span>
                  <span className="w-16 sm:w-20 text-center text-xs font-poppinsregular text-black hidden sm:block">
                    <span>{fileSize}</span>
                  </span>
                  <span className="w-16 sm:w-20 text-center text-xs font-poppinsregular text-black hidden sm:block">
                    <span>{addedBy}</span>
                  </span>
                  <span className="w-16 sm:w-20 text-center text-xs font-poppinsregular text-black hidden sm:block">
                    <span>{date}</span>
                  </span>
                  <div className="w-12 sm:w-16 flex justify-center gap-1">
                    <a href={url} target="_blank" rel="noopener noreferrer" download>
                      <Button className="bg-transparent">
                        <Download strokeWidth={3} className="w-5 h-5 text-primary" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DocumentTable;

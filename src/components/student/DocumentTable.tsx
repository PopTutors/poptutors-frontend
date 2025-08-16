import { Download } from 'lucide-react';
import { Button } from '../ui/button';

const DocumentTable = ({ documents }: { documents: any }) => {
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
              <span className="w-16 sm:w-20 text-center hidden sm:block">ADDED BY</span>
              <span className="w-16 sm:w-20 text-center hidden sm:block">DATE</span>
              <span className="w-12 sm:w-16 text-center">ACTION</span>
            </div>
          </div>

          {(documents?.length > 0
            ? documents
            : ['https://example.com/doc1.pdf', 'https://example.com/doc2.pdf']
          ).map((docUrl: string, index: number) => {
            // Extract file name and extension
            const fileName = docUrl.split('/').pop() || 'Document';
            const ext = fileName.split('.').pop()?.toLowerCase() || '';
            const isPdf = ext === 'pdf';

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
                    <span className="text-xs font-poppinsregular text-black">{fileName}</span>
                  </div>
                  <span className="w-16 sm:w-20 text-center text-xs font-poppinsregular text-black hidden sm:block">
                    {/* Dummy "Added By" info */}
                    <span>John Doe</span>
                  </span>
                  <span className="w-16 sm:w-20 text-center text-xs font-poppinsregular text-black hidden sm:block">
                    {/* Dummy "Date" info */}
                    <span>2024-01-01</span>
                  </span>
                  <div className="w-12 sm:w-16 flex justify-center gap-1">
                    <a href={docUrl} target="_blank" rel="noopener noreferrer" download>
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

import { Download } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';

const DocumentTable = () => {
  return (
    <section className="bg-white rounded-lg">
      <div>
        <div className="flex items-center justify-between p-5">
          <h4 className="text-[18px] font-poppinssemibold text-gray-900">Documents</h4>
          <Button variant="pill_outline" className='font-poppinssemibold text-sm py-1'>
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

        {[
          { name: 'Assignment.doc', addedBy: 'Student', date: 'DD/MM/YYYY', type: 'doc' },
          { name: 'Question Paper.pdf', addedBy: 'Teacher', date: 'DD/MM/YYYY', type: 'pdf' },
          { name: 'Student Assignment.doc', addedBy: 'Student', date: 'DD/MM/YYYY', type: 'doc' },
          { name: 'Question Paper.pdf', addedBy: 'Teacher', date: 'DD/MM/YYYY', type: 'pdf' },
        ].map((doc, index) => (
          <div key={index} className={`px-4 py-3 last:border-b-0 ${index%2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <div
                  className={`w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs ${
                    doc.type === 'pdf' ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                >
                  {doc.type === 'pdf' ? '📄' : '📝'}
                </div>
                <span className="text-xs font-poppinsregular text-black">{doc.name}</span>
              </div>
              <span className="w-16 sm:w-20 text-center text-xs font-poppinsregular text-black hidden sm:block">
                {doc.addedBy}
              </span>
              <span className="w-16 sm:w-20 text-center text-xs font-poppinsregular text-black hidden sm:block">
                {doc.date}
              </span>
              <div className="w-12 sm:w-16 flex justify-center gap-1">
                <Button className='bg-transparent'>
                  <Download  strokeWidth={3} className="w-5 h-5 text-primary" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default DocumentTable;

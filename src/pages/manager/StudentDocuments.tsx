// StudentDocuments.tsx
import React from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import {
  Search,
  Filter,
  Upload,
  Eye,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { FileIcon, SizeIcon } from '../../assets/managers';

type DocumentItem = {
  id: number;
  name: string;
  size: string;
  date: string;
};

type Props = {
  documents?: DocumentItem[];
};

export default function StudentDocuments({ documents = defaultDocs }: Props) {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        <Card className="">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Student Documents
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 h-9 w-64 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 bg-white h-9 w-9 p-0"
                >
                  <Filter className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-gray-600 h-[60px] text-center text-[#141414]">
                      <th className="px-6 py-3 font-medium text-[16px] text-left w-[380px]">
                        File Name
                      </th>
                      <th className="px-6 py-3 font-medium text-[16px] w-[120px]">File Size</th>
                      <th className="px-6 py-3 font-medium text-[16px] w-[120px]">Date</th>
                      <th className="px-6 py-3 font-medium text-[16px] w-[100px]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {documents.map((doc) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-gray-50 h-[80px] text-[#141414] text-[16px] text-center"
                        style={{ fontSize: '16px', minHeight: '80px' }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-left align-middle">
                          <div className="flex items-center gap-3 h-full">
                            <span className="flex items-center justify-center w-[36px] h-[36px] bg-blue-50 rounded mr-2">
                              <img
                                src={FileIcon}
                                alt="fileicon"
                                className="object-contain w-[20px] h-[20px]"
                              />
                            </span>
                            <span className="font-medium break-all">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap align-middle text-blue-600 font-medium">
                          <div className="flex items-center justify-center h-full">
                            <span className="flex items-center justify-center w-[28px] h-[28px] bg-blue-50 rounded mr-2">
                              <img
                                src={SizeIcon}
                                alt="sizeicon"
                                className="object-contain w-[16px] h-[16px]"
                              />
                            </span>
                            {doc.size}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap align-middle text-gray-600">
                          <div className="flex items-center justify-center h-full">{doc.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap align-middle">
                          <div className="flex items-center gap-2 justify-center h-full">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 flex items-center justify-center hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2 justify-end px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">1-7</span> out of{' '}
                <span className="font-medium">512</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-gray-900 text-white hover:bg-gray-800"
                >
                  1
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  2
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  3
                </Button>
                <span className="px-2 text-gray-400">...</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  16
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* --------- default documents (keeps same demo data you provided) --------- */
const defaultDocs: DocumentItem[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  name: 'Detailed_Data_Analysis_Satisfaction_Survey.xlsx',
  size: '28.50 KB',
  date: '16/11/2022',
}));

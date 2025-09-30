// src/pages/manager/StudentDocuments.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Search,
  Filter,
  Upload,
  Eye,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FileIcon, SizeIcon } from "../../assets/managers";
import { useFetch } from "../../api"; // your hook
import { useGenericMutation } from "../../api/useGenericMutation"; // your mutation hook

type DocumentItem = {
  id: string;
  name: string;
  size?: string;
  date?: string;
  url: string;
  uploadedAt?: string | Date;
};

type Props = {
  jobId?: string; // optional if parent passes `documents`
  type?: "assignment" | "session" | "liveHelp" | string;
  teacherId?: string;
  documents?: DocumentItem[]; // optional pre-fetched list
  pageSize?: number;
};

export default function StudentDocuments({
  jobId,
  type = "assignment",
  teacherId,
  documents: initialDocuments,
  pageSize = 7,
}: Props) {
  const [localDocs, setLocalDocs] = useState < DocumentItem[] | null > (initialDocuments ?? null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState < string | null > (null);

  // If parent didn't supply documents, fetch from backend
  const shouldFetch = !initialDocuments && jobId;
  const fetchUrl = jobId
    ? `/api/manager-dashboard/job/${jobId}/documents?type=${encodeURIComponent(String(type))}${teacherId ? `&teacherId=${encodeURIComponent(teacherId)}` : ""
    }`
    : null;

  const { data, isLoading, error: fetchError, refetch } = useFetch(
    shouldFetch ? ["jobDocs", jobId, type, teacherId] : null,
    fetchUrl ?? "",
    !!shouldFetch,
    { requiresAuth: true }
  );

  // Mutation hook for upload/delete
  const { mutate } = useGenericMutation();

  // normalize fetched data
  useEffect(() => {
    if (initialDocuments) {
      setLocalDocs(initialDocuments);
      setError(null);
      return;
    }

    if (!shouldFetch) return;

    if (fetchError) {
      setError(typeof fetchError === "string" ? fetchError : "Failed to load documents");
      setLocalDocs([]);
      return;
    }

    if (!isLoading && data) {
      const docsArr = Array.isArray(data) ? data : data.items ?? data.documents ?? [];
      const normalized = (docsArr ?? []).map((d: any, i: number) => ({
        id: String(d.id ?? d._id ?? `doc-${i}`),
        name: d.name ?? d.fileName ?? (d.url ? d.url.split("/").pop() : `Document-${i + 1}`),
        size: d.fileSize ? formatBytes(d.fileSize) : d.size ?? undefined,
        date: d.uploadedAt ?? d.createdAt ?? d.date ?? undefined,
        uploadedAt: d.uploadedAt ?? d.createdAt ?? d.date ?? undefined,
        url: d.url ?? d.fileUrl ?? d.signedUrl ?? "",
      })) as DocumentItem[];

      setLocalDocs(normalized);
      setError(null);
    }
  }, [initialDocuments, data, isLoading, fetchError, shouldFetch, jobId, type, teacherId]);

  // client-side search + pagination
  const filteredDocs = useMemo(() => {
    if (!localDocs) return [];
    if (!search) return localDocs;
    return localDocs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
  }, [localDocs, search]);

  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const docsToShow = filteredDocs.slice((page - 1) * pageSize, page * pageSize);

  // helper to format bytes to KB/MB
  function formatBytes(bytes: number | string | undefined) {
    if (!bytes) return "";
    const b = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
    if (isNaN(b)) return "";
    if (b === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Open/preview document (new tab)
  const handleOpen = (doc: DocumentItem) => {
    if (!doc.url) return alert("No document URL available");
    window.open(doc.url, "_blank", "noopener,noreferrer");
  };

  // Download by triggering anchor (works for public and signed urls)
  const handleDownload = (doc: DocumentItem) => {
    if (!doc.url) return alert("No document URL available");
    const a = document.createElement("a");
    a.href = doc.url;
    a.download = doc.name;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // delete document API call
  async function handleDelete(docId: string) {
    if (!jobId) {
      // client-side only deletion if no backend binding
      setLocalDocs((prev) => prev?.filter((d) => d.id !== docId) ?? null);
      return;
    }

    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await mutate({
        endpoint: `/api/manager-dashboard/job/${jobId}/documents/${docId}`,
        method: "DELETE",
        data: undefined,
        requiresAuth: true,
        successMessage: "Document deleted",
        errorMessage: "Failed to delete document",
        invalidateKeys: shouldFetch ? [["jobDocs", jobId, type, teacherId]] : undefined,
      });
      // optimistic update
      setLocalDocs((prev) => prev?.filter((d) => d.id !== docId) ?? null);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete document");
    }
  }

  // upload handler (single or multiple)
  async function handleUpload(files: FileList | null) {
    if (!files || !files.length) return;
    if (!jobId) {
      alert("No job context provided. Upload is disabled.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f)); // backend: files[]
    formData.append("type", String(type));
    if (teacherId) formData.append("teacherId", teacherId);

    setUploading(true);
    try {
      // use generic mutate to POST formData; if your mutate expects JSON, adapt accordingly.
      // Here we call fetch directly to support multipart/form-data more easily.
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/manager-dashboard/job/${jobId}/documents`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // NOTE: do NOT set Content-Type here; browser sets it for multipart
        },
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }
      // backend should return created document(s)
      const payload = await res.json();
      const docsArr = Array.isArray(payload) ? payload : payload.items ?? payload.documents ?? payload;
      const normalized = (docsArr ?? []).map((d: any, i: number) => ({
        id: String(d.id ?? d._id ?? `doc-new-${i}`),
        name: d.name ?? d.fileName ?? d.url?.split("/").pop() ?? "file",
        size: d.fileSize ? formatBytes(d.fileSize) : undefined,
        date: d.uploadedAt ?? d.createdAt ?? new Date().toISOString(),
        url: d.url ?? d.fileUrl ?? d.signedUrl ?? "",
        uploadedAt: d.uploadedAt ?? d.createdAt ?? new Date().toISOString(),
      })) as DocumentItem[];

      // append to list
      setLocalDocs((prev) => {
        const next = [...(prev ?? []), ...normalized];
        // keep newest first
        return next;
      });

      // refresh fetch cache if used
      if (refetch) refetch();
    } catch (err: any) {
      console.error("Upload error", err);
      alert("Upload failed: " + (err?.message ?? ""));
    } finally {
      setUploading(false);
    }
  }

  // input ref for hidden file input
  const fileInputRef = React.useRef < HTMLInputElement | null > (null);
  const onUploadClick = () => fileInputRef.current?.click();

  const showingFrom = filteredDocs.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(filteredDocs.length, page * pageSize);

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        <Card className="">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Student Documents</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 h-9 w-64 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                <Button variant="outline" size="sm" className="border-gray-300 bg-white h-9 w-9 p-0" onClick={() => { if (refetch) refetch(); }}>
                  <Filter className="h-4 w-4 text-gray-600" />
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files)}
                />

                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 gap-2" onClick={onUploadClick}>
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Document"}
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
                      <th className="px-6 py-3 font-medium text-[16px] text-left w-[380px]">File Name</th>
                      <th className="px-6 py-3 font-medium text-[16px] w-[120px]">File Size</th>
                      <th className="px-6 py-3 font-medium text-[16px] w-[120px]">Date</th>
                      <th className="px-6 py-3 font-medium text-[16px] w-[100px]">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {/* Loading state */}
                    {isLoading && (
                      <tr>
                        <td colSpan={4} className="py-16 text-center text-gray-500">
                          Loading documents...
                        </td>
                      </tr>
                    )}

                    {/* Error */}
                    {!isLoading && error && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-red-500">
                          {error}
                        </td>
                      </tr>
                    )}

                    {/* No documents */}
                    {!isLoading && !localDocs?.length && !error && (
                      <tr>
                        <td colSpan={4} className="py-16 text-center text-gray-500">
                          No documents found for this job.
                        </td>
                      </tr>
                    )}

                    {/* Document rows */}
                    {!isLoading &&
                      (docsToShow.length ? docsToShow : []).map((doc) => (
                        <tr
                          key={doc.id}
                          className="hover:bg-gray-50 h-[80px] text-[#141414] text-[16px] text-center"
                          style={{ fontSize: "16px", minHeight: "80px" }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-left align-middle">
                            <div className="flex items-center gap-3 h-full">
                              <span className="flex items-center justify-center w-[36px] h-[36px] bg-blue-50 rounded mr-2">
                                <img src={FileIcon} alt="fileicon" className="object-contain w-[20px] h-[20px]" />
                              </span>
                              <span className="font-medium break-all">{doc.name}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap align-middle text-blue-600 font-medium">
                            <div className="flex items-center justify-center h-full">
                              <span className="flex items-center justify-center w-[28px] h-[28px] bg-blue-50 rounded mr-2">
                                <img src={SizeIcon} alt="sizeicon" className="object-contain w-[16px] h-[16px]" />
                              </span>
                              {doc.size ?? (doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "")}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap align-middle text-gray-600">
                            <div className="flex items-center justify-center h-full">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}</div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap align-middle">
                            <div className="flex items-center gap-2 justify-center h-full">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex items-center justify-center hover:bg-gray-100" onClick={() => handleOpen(doc)}>
                                <Eye className="h-4 w-4 text-gray-600" />
                              </Button>

                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex items-center justify-center hover:bg-gray-50" onClick={() => handleDownload(doc)}>
                                <FileText className="h-4 w-4 text-gray-600" />
                              </Button>

                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex items-center justify-center hover:bg-red-50" onClick={() => handleDelete(doc.id)}>
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
                Showing <span className="font-medium">{showingFrom}-{showingTo}</span> out of <span className="font-medium">{filteredDocs.length}</span>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* small page numbers (1..totalPages) - show a few */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // center current page when possible
                  let anchor = i + 1;
                  // If many pages, show a sliding window
                  if (totalPages > 5) {
                    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                    anchor = start + i;
                  }
                  return (
                    <Button
                      key={anchor}
                      variant={anchor === page ? undefined : "ghost"}
                      size="sm"
                      className={`h-8 w-8 p-0 ${anchor === page ? "bg-gray-900 text-white hover:bg-gray-800" : ""}`}
                      onClick={() => setPage(anchor)}
                    >
                      {anchor}
                    </Button>
                  );
                })}

                {totalPages > 5 && <span className="px-2 text-gray-400">...</span>}

                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
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

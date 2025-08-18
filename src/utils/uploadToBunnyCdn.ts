// utils/uploadToBunnyCdn.ts
export interface UploadConfig {
    file: File;
    storageZone?: string;
    accessKey?: string;
    region?: string;
    folderPath?: string;
}

export interface UploadResponse {
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
}

function normalizeFolderPath(folderPath?: string): string {
    if (!folderPath) return "";
    return folderPath.replace(/^\/+|\/+$/g, "") + "/";
}

export async function uploadToBunnyCDN({
    file,
    storageZone = "poptutors-test-dev",
    accessKey = "a0e4f928-ff1e-4494-85096e794c67-ad49-4627", // Use normal Password, NOT ReadOnly Password
    folderPath = "assignments",
}: UploadConfig): Promise<UploadResponse> {
    try {
        if (!file) throw new Error("No file provided for upload");
        console.log(file)
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error("File size exceeds 10MB limit");
        }

        // Normalize folder path
        const normalizedFolderPath = normalizeFolderPath(folderPath);

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `${timestamp}-${sanitizedFileName}`;

        const uploadUrl = `https://storage.bunnycdn.com/${storageZone}/${normalizedFolderPath}${fileName}`;

        console.log("Uploading to URL:", uploadUrl);

        const response = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                AccessKey: accessKey, // This must be the normal Password with write access
                // "Content-Type": "application/octet-stream",
            },
            body: file,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("BunnyCDN Error Response:", errorText);
            throw new Error(`BunnyCDN upload failed: ${response.status} ${response.statusText}`);
        }

        // Public URL
        const publicUrl = `https://testing-bunny-poppy.b-cdn.net/${normalizedFolderPath}${fileName}`;

        return {
            url: publicUrl,
            fileName: sanitizedFileName,
            fileSize: file.size,
            fileType: file.type,
        };
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
}

// Generic multiple file upload
export async function uploadMultipleFiles({
    files,
    storageZone = "poptutors-test-dev",
    accessKey = "YOUR_STORAGE_ZONE_NORMAL_PASSWORD_HERE", // Use normal Password with write access
    region = "ny",
    folderPath = "assignments",
}: {
    files: FileList | File[];
    storageZone?: string;
    accessKey?: string;
    region?: string;
    folderPath?: string;
}): Promise<UploadResponse[]> {
    const normalizedFolderPath = normalizeFolderPath(folderPath);
    const fileArray = Array.from(files);

    const uploadPromises = fileArray.map(file =>
        uploadToBunnyCDN({
            file,
            storageZone,
            accessKey,
            region,
            folderPath: normalizedFolderPath,
        })
    );

    return Promise.all(uploadPromises);
}

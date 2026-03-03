"use server";

import { uploadFileToR2 } from "@/actions/utils/r2_client";

export const uploadFile = async (formData: FormData) => {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            return { error: "No file provided" };
        }

        const filename = await uploadFileToR2(file);

        // This is a placeholder domain. In Cloudflare R2, you'd usually use a custom domain or a public bucket URL.
        // For now, returning the filename. You'll need to prepend your R2 public URL.
        return {
            success: "File uploaded successfully!",
            filename: filename
        };
    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Failed to upload file." };
    }
};

import { randomUUID } from "crypto";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const uploadFileToR2 = async (file: File): Promise<string> => {
    const { env } = getCloudflareContext();
    const r2Bucket = (env as CloudflareEnv)["portfolio-r2"];
    const filename = `${randomUUID()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();

    await r2Bucket.put(filename, arrayBuffer, {
        httpMetadata: {
            contentType: file.type,
            cacheControl: "public, max-age=3600, must-revalidate",
        },
    });

    // Return the filename/key that was used for upload
    return filename;
}

export const deleteFileFromR2 = async (imageUrl: string) => {
    const { env } = getCloudflareContext();
    const r2Bucket = (env as CloudflareEnv)["portfolio-r2"];

    // Extract the key from the URL
    // The key is typically the filename part after the domain/bucket path
    const url = new URL(imageUrl);
    // Remove leading slash and get the pathname
    const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;

    return await r2Bucket.delete(key);
}

export const updateFileInR2 = async (file: File, oldImageUrl: string) => {
    const { env } = getCloudflareContext();
    const r2Bucket = (env as CloudflareEnv)["portfolio-r2"];

    // Extract the key from the old URL to keep the same filename
    const url = new URL(oldImageUrl);
    const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;

    // Delete the old image
    await r2Bucket.delete(key);

    // Upload the new image with the same key
    const arrayBuffer = await file.arrayBuffer();

    return await r2Bucket.put(key, arrayBuffer, {
        httpMetadata: {
            contentType: file.type,
            cacheControl: "public, max-age=3600, must-revalidate",
        },
    });
}

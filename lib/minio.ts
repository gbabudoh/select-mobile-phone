import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const bucketName = process.env.MINIO_BUCKET || "select-mobile-phone";

/**
 * Ensures that the bucket exists. Creates it if it doesn't.
 */
export async function ensureBucket() {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
      // Set bucket policy to allow public read for product images if needed
      // For now, we'll keep it private and use pre-signed URLs
    }
  } catch (error) {
    console.error("Error ensuring Minio bucket existence:", error);
    throw error;
  }
}

/**
 * Uploads a file to the configured Minio bucket.
 */
export async function uploadFile(fileName: string, buffer: Buffer, metadata?: Record<string, string | number>) {
  try {
    await ensureBucket();
    return await minioClient.putObject(bucketName, fileName, buffer, buffer.length, metadata);
  } catch (error) {
    console.error("Error uploading file to Minio:", error);
    throw error;
  }
}

/**
 * Generates a pre-signed URL for downloading/viewing a file.
 */
export async function getDownloadUrl(fileName: string, expiry: number = 3600) {
  try {
    return await minioClient.presignedGetObject(bucketName, fileName, expiry);
  } catch (error) {
    console.error("Error generating pre-signed URL from Minio:", error);
    throw error;
  }
}

export default minioClient;

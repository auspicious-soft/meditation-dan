// app/actions/uploadCollectionImage.ts
"use server";
import { generateSignedUrlForCollectionImage } from "@/actions";
import sharp from "sharp";

export async function uploadCompressedCollectionImage(formData: FormData) {
  const imageFile = formData.get("image") as File;
  const collectionName = formData.get("collectionName") as string;

  if (!imageFile) throw new Error("No image file provided");

  const originalFileName = imageFile.name;
  const imageFileName = `${originalFileName.split(".")[0]}-compressed.${imageFile.type.split("/")[1]}`;
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

  const compressedBuffer = await sharp(imageBuffer)
    .resize({ width: 300 }) // Adjust based on your requirements (e.g., 250x200)
    .toFormat("jpeg", { quality: 80 }) // Adjust quality as needed
    .toBuffer();

  const { signedUrl, key } = await generateSignedUrlForCollectionImage(
    collectionName,
    new Date().toISOString(),
    imageFileName,
    "image/jpeg"
  );

  const response = await fetch(signedUrl, {
    method: "PUT",
    body: compressedBuffer,
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Encoding": "identity",
    },
  });

  if (!response.ok) throw new Error("Failed to upload compressed image to S3");

  return { key };
}
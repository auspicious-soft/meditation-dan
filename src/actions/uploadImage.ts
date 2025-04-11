// app/actions/uploadImage.ts
"use server";
import { generateSignedUrlForAudioImage } from "@/actions";
import sharp from "sharp";

export async function uploadCompressedImage(formData: FormData) {
  const imageFile = formData.get("image") as File;
  const songName = formData.get("songName") as string;

  if (!imageFile) throw new Error("No image file provided");

  const originalFileName = imageFile.name;
  const imageFileName = `${originalFileName.split(".")[0]}-compressed.${imageFile.type.split("/")[1]}`;
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

  const compressedBuffer = await sharp(imageBuffer)
    .resize({ width: 800 }) // Adjust width as needed
    .toFormat("jpeg", { quality: 80 }) // Adjust quality as needed
    .toBuffer();

  const { signedUrl, key } = await generateSignedUrlForAudioImage(
    songName,
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
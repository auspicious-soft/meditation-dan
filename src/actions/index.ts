"use server";
import { signIn, signOut } from "@/auth";
import { loginService, signupService } from "@/services/admin-services";
import { cookies } from "next/headers";
import { createS3Client } from "@/config/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand,  } from "@aws-sdk/client-s3";



// export const signupAction = async (payload:any) => {
//   console.log('payload:', payload);
// try {
//   const res: any = await signupService(payload);
//   const user = res?.data?.data?.user;
//   const userName =  user.firstName + " " + user.lastName;
//   if (res && res?.data?.success) {
//     await signIn("credentials", {
//       email: user.email, 
//       fullName: userName,
//       _id: user._id,
//       role: user?.role,
//       profilePic: user.image,
//       redirect: false,
//     });
//   }
//   return res?.data;
// } catch (error: any) {
//   return error?.response?.data;
// }
// };

// export const signupAction = async (payload: any) => {
//   console.log('payload:', payload); // { name, email, companyName, password }
//   try {
//     const res: any = await signupService(payload);
//     console.log('res: ', res);
//     const user = res?.data?.data?.user;
//     console.log('res: ', res);

//     const userName = user.name;

//     if (res && res?.data?.success) {
//       console.log('res: ', res);
//       await signIn("credentials", {
//         email: user.email,
//         // fullName: userName, 
//         _id: user._id,
//         role: user?.role,
//         profilePic: user.image,
//         redirect: false,
//       });
//     }
//     return res?.data;
//   } catch (error: any) {
//     console.error('Signup action error:', error);
//     return error?.response?.data;
//   }
// };

export const signupAction = async (payload: any) => {
  console.log('1. Payload received in signupAction:', payload);

  try {
    const res: any = await signupService(payload);

    const user = res?.data?.data?.user;

    const userName = user?.firstName ? user.firstName + " " + user.lastName : user?.companyName; 

    if (res && res?.data?.success) {
      

    } else {
      console.log('9. Success condition NOT met, res.data:', res?.data);
    }

    return res?.data;
  } catch (error: any) {
    console.error('Signup action error:', error);
    return error?.response?.data;
  }
};





export const loginAction = async (payload: any) => {
  try {
    const res: any = await loginService(payload);
    const user = res?.data?.data?.user;
    const userName = user?.role==="admin" ? user.firstName + " " + user.lastName : user.companyName; 
    if (res && res?.data?.success) {
      await signIn("credentials", {
        email: user.email, 
        fullName: userName,
        _id: user._id,
        role: user?.role,
        profilePic: user.profilePic,
        redirect: false,
      });
    }
    return res?.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};



export const logoutAction = async () => {
  try {
    await signOut();
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const getTokenCustom = async () => {
  const cookiesOfNextAuth = await cookies();
 
  return cookiesOfNextAuth?.get(process.env.JWT_SALT as string)?.value;
};

export const generateSignedUrlToUploadOn = async (fileName: string, fileType: string) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `events/${fileName}`,
    ContentType: fileType,
    acl: "public-read",
  };
  try {
    const command = new PutObjectCommand(uploadParams);
    const signedUrl = await getSignedUrl(await createS3Client(), command);
    // const signedUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
    return { signedUrl, key: uploadParams.Key };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};
export const generateSignedUrlForAudios = async (songName:string,collectionName:string, fileName: string, fileType: string) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${songName}/${collectionName}/audio/${fileName}`,
    ContentType: fileType,
    acl: "public-read",
  };
  try {
    const command = new PutObjectCommand(uploadParams);
    const signedUrl = await getSignedUrl(await createS3Client(), command);
    return { signedUrl, key: uploadParams.Key };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};
export const generateSignedUrlForAudioImage = async (songName:string, collectionName:string,fileName: string, fileType: string) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${songName}/${collectionName}/image/${fileName}`,
    ContentType: fileType,
    acl: "public-read",
  };
  try {
    const command = new PutObjectCommand(uploadParams);
    const signedUrl = await getSignedUrl(await createS3Client(), command);
    return { signedUrl, key: uploadParams.Key };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};
export const generateSignedUrlForCollectionImage = async (collectionName:string,time:any, fileName: string, fileType: string) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${collectionName}/${time}/image/${fileName}`,
    ContentType: fileType,
    acl: "public-read",
  };
  try {
    const command = new PutObjectCommand(uploadParams);
    const signedUrl = await getSignedUrl(await createS3Client(), command);
    return { signedUrl, key: uploadParams.Key };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};
export const generateSignedUrlForAdminProfile = async (adminId:string, fileName: string, fileType: string) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${adminId}/image/${fileName}`,
    ContentType: fileType,
    acl: "public-read",
  };
  try {
    const command = new PutObjectCommand(uploadParams);
    const signedUrl = await getSignedUrl(await createS3Client(), command);
    return { signedUrl, key: uploadParams.Key };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};
export const getImageUrl = async (imageKey: string) => {
  const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageKey,
  }
  try {
      const command = new GetObjectCommand(params)
      const url = await getSignedUrl(await createS3Client(), command
          // , { expiresIn: 3600 }
      )
      return url;
  } catch (error) {
      throw error
  }
}

export const getImageUrlOfS3 = async(subPath: string): Promise<string> => {
  const path = `${process.env.NEXT_PUBLIC_AWS_BUCKET_PATH}${subPath}`
  return path
}


export const deleteFileFromS3 = async (imageKey: string) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageKey,
  };
  try {
    const s3Client = await createS3Client();
    const command = new DeleteObjectCommand(params);
    const response = await s3Client.send(command);
    return response;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};



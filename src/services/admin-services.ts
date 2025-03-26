import { axiosInstance, getAxiosInstance } from "@/config/axios";

export const loginService = async (payload: any) => {
 const res = await axiosInstance.post(`/login`, { email: payload.email, password: payload.password });
 console.log("res: ", res);
 return res;
};
export const forgotPasswordService = async (payload: any) => await axiosInstance.post(`/forgot-password`, payload);
export const sendOtpService = async (payload: any) => await axiosInstance.post(`/verify-otp`, payload);
export const resetUserPassword = async (payload: any) => await axiosInstance.patch(`/new-password-otp-verified`, payload);

// import { axiosInstance } from "@/config/axios";

// export const loginService = async (payload: any) => await axiosInstance.post(`/login`, { username: payload.username, password: payload.password });
// export const forgotPasswordService = async (payload: any) => await axiosInstance.post(`/forgot-password`, payload)
// export const sendOtpService = async (payload: any) => await axiosInstance.post(`/verify-otp`, payload)
// export const resetUserPassword = async (payload: any) => await axiosInstance.patch(`/new-password-otp-verified`, payload)

// export const getDashboardStats = async (route: string) => {
//     const axiosInstance = await getAxiosInstance()
//     return axiosInstance.get(route)
// }
// //----------User Page--------------------------
// export const getAllUsers = async (route: string) => {
//     const axiosInstance = await getAxiosInstance()
//     return axiosInstance.get(route)
// }
// export const getSingleUsers = async (route: string) => {
//     const axiosInstance = await getAxiosInstance()
//     return axiosInstance.get(route)
// }
// export const addNewUser = async (route: string, payload: any) => {
//     const axiosInstance= await getAxiosInstance()
//     return axiosInstance.post(route, payload)
// }
// export const updateSingleUser = async (route: string, payload: any) => { 
//     const axiosInstance= await getAxiosInstance()
//     return axiosInstance.put(route, payload)
// }
// export const getSingleUserOrders = async (route: string) => {
//     const axiosInstance = await getAxiosInstance()
//     return axiosInstance.get(route)
// }

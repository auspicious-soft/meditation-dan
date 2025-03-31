// import { axiosInstance } from "@/config/axios";

import { axiosInstance, getAxiosInstance } from "@/config/axios"

export const loginService = async (payload: any) => await axiosInstance.post(`/login`, { email: payload.email, password: payload.password });
export const signupService = async (payload: any) => await axiosInstance.post(`/company/signup`, payload);
export const forgotPasswordService = async (payload: any) => await axiosInstance.post(`/forgot-password`, payload)
export const sendOtpService = async (otp: any) => await axiosInstance.post(`/verify-otp`, otp)
export const resetUserPassword = async (payload: any) => await axiosInstance.patch(`/new-password-otp-verified`, payload)

export const uploadAudioStats = async (route: string , payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route, payload)
}
export const uploadCollectionStats = async (route: string , payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route, payload)
}
export const getlevelsStats = async (route: string ,params: any = {}) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route,{ params })
}
export const getBestForStats = async (route: string ,params: any = {}) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route,{ params })
}
export const getUserDetailStats = async (route: string ,params: any = {}) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route,{ params })
}
export const getCompanyDetailStats = async (route: string ,params: any = {}) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route,{ params })
}
export const getSingleCompanydetailStats = async (route: string ) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route)
}
export const addNewCompanyStats = async (route: string,payload: any ) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.post(route,payload)
}
export const getAllCollectionStats = async (route: string,params: any = {} ) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route,{ params })
}
export const getAllAudiosStats = async (route: string,params: any = {} ) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route,{ params })
}
export const deleteAudio = async (route: string,params: any = {} ) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.delete(route,{ params })
}
export const getAudioDataById = async (route: string,params: any = {} ) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route,{ params })
}
export const getCollectionById = async (route: string,params: any = {} ) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.get(route,{ params })
}
export const updateCollectionStats = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance();
    return axiosInstance.put(route, payload); // Returns Promise resolving to { data, status, ... }
  };
export const deleteCollectionByID = async (route: string,params: any = {} ) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.delete(route,{ params })
}
export const updateAudioStats = async (route: string, payload: any) => {
    const axiosInstance = await getAxiosInstance()
    return axiosInstance.put(route,payload)
}
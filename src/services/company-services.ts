// import { axiosInstance } from "@/config/axios";

import { axiosInstance, getAxiosInstance, getCompanyAxiosInstance } from "@/config/axios"


export const getCompanyDetails = async (route: string ,params: any = {}) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.get(route)
}

export const markAllNotificationsRead = async (route: string ,params: any = {}) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.put(route)
}
export const updateCompanyDetails = async (route: string ,payload: any = {}) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.put(route,payload)
}
export const getCompanyDashboard = async (route: string ,params: any = {}) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.get(route)
}
export const getAllUsers = async (route: string ) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.get(route)
}
export const getAllPendingJoinRequests= async (route: string,params: any = {} ) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.get(route,params)
}
export const getApproveOrDeclinePendingJoinRequest= async (route: string ) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.put(route)
}
export const getUserDetailStats = async (route: string ,params: any = {}) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.get(route)
}
export const deleteUser = async (route: string ,params: any = {}) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.delete(route)
}
export const deactivateUserAccount = async (route: string ,params: any = {}) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.patch(route)
}
export const createUserAccount = async (route: string ,payload: any) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.post(route,payload)
}
export const updateUserAccount = async (route: string ,payload: any) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.put(route,payload)
}

//subscription
export const getAllSubcriptionPlans = async (route: string ,params: any = {}) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.get(route,params)
}
export const getAllTransactionsPlans = async (route: string ,params: any = {}) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.get(route)
}
export const getUserInfo = async (route: string ,params: any = {}) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.get(route)
}
export const buyPlan = async (route: string ,payload: any ) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.post(route,payload)
}
export const cancelSubscription = async (route: string  ) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.post(route)
}

//Notification
export const getCompanyNotifications = async (route: string ,params: any = {}) => {
    const axiosInstance = await getCompanyAxiosInstance()
    return axiosInstance.get(route)
}
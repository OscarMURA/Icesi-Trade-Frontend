import axios from './axiosConfig';
import { User as AdminUser } from '../types/userTypes';
import { RoleDto } from '../types/userTypes';

const BASE_URL = '/api';
const token = localStorage.getItem('token');

export const getAllUsers = async (): Promise<AdminUser[]> => {
    const res = await axios.get(`${BASE_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const deleteUser = async (id: number): Promise<string> => {
    const res = await axios.delete(`${BASE_URL}/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const getAllRoles = async (): Promise<RoleDto[]> => {
    const res = await axios.get(`${BASE_URL}/roles`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const getUserRoles = async (userId: number): Promise<RoleDto[]> => {
    const res = await axios.get(`${BASE_URL}/users/${userId}/roles`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const updateUserRoles = async (userId: number, roleIds: number[]): Promise<string> => {
    const res = await axios.post(`${BASE_URL}/users/${userId}/roles`, roleIds, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

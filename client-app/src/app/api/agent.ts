import axios, { AxiosResponse } from 'axios';
import { IActivity, IActivitiesEnvelope } from '../models/activity';
import Activity from '../models/classes/Activity';
import { history } from '../../';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/interfaces/IUser';
import { IProfile, IPhoto } from '../models/profile';
import { IProfileAboutFormValues } from '../models/interfaces/IProfile';

axios.defaults.baseURL = "http://localhost:5000/api";

//for each request being sent, send token in auth header
//if error, send error 
axios.interceptors.request.use((config) =>
{
    const token = window.localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
}, (error) => (Promise.reject(error)));

//handle on response error
axios.interceptors.response.use(undefined, error =>
{
    if (error.message === 'Network Error' && !error.response)
    {
        toast.error('Network Error');
    }

    const { status, data, config } = error.response;

    if (status === 404)
    {
        history.push('/NotFound');
    }
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id'))
    {
        history.push('/NotFound');
    }

    if (status === 500)
    {
        toast.error('Server Error - check the terminal for more info!');
    }

    throw error.response;
})

const responseBody = (response: AxiosResponse) => response.data;

const sleep = (ms: number) =>
{
    return (response: AxiosResponse) =>
        new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));
}


const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    delete: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
    postForm: (url: string, file: Blob) =>
    {
        let formData = new FormData();
        formData.append('File', file); //key needs to match form file name prop
        return axios.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(responseBody);
    }
}


const ActivityService = {
    list: (limit?: number, offset?: number): Promise<IActivitiesEnvelope> => requests.get(`/activities?limit=${limit}&offset=${offset ? offset * limit! : 0}`),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', new Activity(activity)),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, new Activity(activity)),
    delete: (id: string) => requests.delete(`/activities/${id}`),
    attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
    unattend: (id: string) => requests.delete(`/activities/${id}/attend`),
}

const UserService = {
    current: (): Promise<IUser> => requests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/login`, user),
    register: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/register`, user)
}

const ProfileService = {
    get: (username: string): Promise<IProfile> => requests.get(`/profiles/${username}`),
    uploadPhoto: (photo: Blob): Promise<IPhoto> => requests.postForm(`/photos`, photo),
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
    updateProfile: (profile: IProfileAboutFormValues) => requests.put(`/profiles`, profile),
    follow: (username: string) => requests.post(`/profiles/${username}/follow`, {}),
    unfollow: (username: string) => requests.delete(`/profiles/${username}/follow`),
    listFollowings: (username: string, predicate: string) => requests.get(`/profiles/${username}/follow?predicate=${predicate}`)
}

export
{
    ActivityService,
    UserService,
    ProfileService
}

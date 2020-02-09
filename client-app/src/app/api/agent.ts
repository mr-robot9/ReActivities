import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';
import Activity from '../models/classes/Activity';
import { history } from '../../';
import { toast } from 'react-toastify';

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(undefined, error =>
{
    if (error.message === 'Network Error' && !error.response){
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

    throw error;
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
    delete: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody)
}


const ActivityService = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', new Activity(activity)),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, new Activity(activity)),
    delete: (id: string) => requests.delete(`/activities/${id}`)
}

export default ActivityService;
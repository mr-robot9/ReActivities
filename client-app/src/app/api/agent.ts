import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';
import Activity from '../models/classes/Activity';


axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}


const ActivityService ={
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', new Activity(activity)),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, new Activity(activity)),
    delete: (id: string) => requests.delete(`/activities/${id}`)
}

export default ActivityService;
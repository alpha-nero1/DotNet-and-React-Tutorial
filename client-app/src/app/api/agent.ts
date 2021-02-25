import axios, { AxiosResponse } from 'axios';
import { Activity } from '../../types/activity';

// I am against the implementation of this file, I would use a class.

const sleep = (delay: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(res => sleep(1000).then(() => res));

const responseBody = <T> (res: AxiosResponse) => res.data;

const requests = {
  get: <T> (url: string) => axios.get<T>(url).then(responseBody),
  post: <T> (url: string, body: any) => axios.post<T>(url, body).then(responseBody),
  put: <T> (url: string, body: any) => axios.put<T>(url, body).then(responseBody),
  del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
  list: () => requests.get<Activity[]>('/activities') as Promise<Activity[]>,
  details: (id: string) => requests.get<Activity>(`/activities/${id}`) as Promise<Activity>,
  create: (activity: Activity) => requests.post('/activities', activity),
  update: (activity: Activity) => requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
}

const agent = {
  Activities
}

export default agent;
import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { History } from '../..';
import { Activity } from '../../types/activity';
import { ServerError } from '../../types/server-error';
import { store } from '../stores/store';

// I am against the implementation of this file, I would use a class.

const sleep = (delay: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(
  res => sleep(1000).then(() => res), 
  (err: AxiosError) => {
    const { data, status, config } = err.response!;
    switch (status) {
      case 400:
        if (typeof data === 'string') toast.error(data);
        if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
          History.push('/not-found');
        }
        if (data.errors) {
          const stateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) stateErrors.push(data.errors[key])
          }
          throw stateErrors.flat();
        }
        break;
      case 401:
        toast.error('Unauthorised');
        break;
      case 404:
        History.push('/not-found');
        break;
      case 500:
        store.commonStore.setServerError(new ServerError(data));
        History.push('/server-error');
        break;
    }
    return Promise.reject(err);
  }
);

const responseBody = (res: AxiosResponse) => res.data;

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
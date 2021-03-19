import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { History } from '../..';
import { Activity, ActivityFormValues } from '../../types/activity';
import { PaginatedResult } from '../../types/pagination';
import { Photo, Profile } from '../../types/profile';
import { ServerError } from '../../types/server-error';
import { UserActivity } from '../../types/user-activity';
import { User, UserFormValues } from '../../types/user.model';
import { store } from '../stores/store';

// I am against the implementation of this file, I would use a class.

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  config => {
    const token = store.commonStore.token;
    // Easily add token to auth header if it is present (user is authenticated!).
    if (token && token.length) config.headers.Authorization = `Bearer ${token}`;
    return config;
  }
)

axios.interceptors.response.use(
  res => {
    const pagination = res.headers['pagination'];
    if (pagination) {
      res.data = new PaginatedResult(res.data, JSON.parse(pagination));
      return res as AxiosResponse<PaginatedResult<any>>;
    }
    return res;
  }, 
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

// Base requests object.
const requests = {
  get: <T> (url: string) => axios.get<T>(url).then(responseBody),
  post: <T> (url: string, body: any) => axios.post<T>(url, body).then(responseBody),
  put: <T> (url: string, body: any) => axios.put<T>(url, body).then(responseBody),
  del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

// Account requests.
const Account = {
  current: () => requests.get<User>('/account').then(usr => new User(usr)),
  login: (user: UserFormValues) => requests.post<User>('/account/login', user),
  register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
    // Upload the photo to our API which handles upload to 3rd party...
    let formData = new FormData();
    formData.append('File', file);
    return axios.post<Photo>('photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.del(`/photos/${id}`),
  updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
  listFollowings: (username: string, predicate: string) => requests.get<Profile[]>(`/following/${username}?predicate=${predicate}`),
  listActivities: (username: string, predicate: string = '') => (
    requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
  )
}

// Activities requests.
const Activities = {
  list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', { params }).then(responseBody) as Promise<PaginatedResult<Activity[]>>,
  details: (id: string) => requests.get<Activity>(`/activities/${id}`) as Promise<Activity>,
  create: (activity: ActivityFormValues) => requests.post('/activities', activity),
  update: (activity: ActivityFormValues) => requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const agent = {
  Activities,
  Account,
  Profiles
}

export default agent;
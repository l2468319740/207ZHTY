import axios from "axios";
import type { AxiosRequestConfig, Method } from "axios";

/** Axios 实例，baseURL 由 Vite proxy 转发至后端 */
const service = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

service.interceptors.request.use((config) => {
  return config;
});

// 响应拦截：200 时直接返回 response.data，上层无需 .data
service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response.data;
    }
    return response;
  },
  (error) => Promise.reject(error),
);

function request<T>(config: AxiosRequestConfig): Promise<T> {
  return service.request<unknown, T>(config);
}

/** 按 HTTP method 生成对应的请求函数，GET/DELETE 将 payload 作为 params，其余作为 data */
function createRequestMethod(method: Method) {
  return function <T>(
    url: string,
    payload?: unknown,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method,
      ...config,
    };

    if (method === "GET" || method === "DELETE") {
      requestConfig.params = payload;
    } else {
      requestConfig.data = payload;
    }

    return request<T>(requestConfig);
  };
}

export const get = createRequestMethod("GET");
export const post = createRequestMethod("POST");
export const put = createRequestMethod("PUT");
export const patch = createRequestMethod("PATCH");
export const del = createRequestMethod("DELETE");

export { service };

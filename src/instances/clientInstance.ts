import axios, { Axios } from "axios";
import jwtDecode from "jwt-decode";
import { Decoded } from "./axiosInstance";

export class CLientInstance {
  private axiosClientInstance: Axios;
  constructor(authInstance: Axios, baseURL: string) {
    const instance = axios.create({
      baseURL,
      withCredentials: false,
    });

    let cfg: any;

    instance.interceptors.response.use(
      function (response: any) {
        const { access_token, refresh_token } = response.data;

        if (!!access_token) {
          localStorage.setItem("APP_ACCESS_TOKEN", access_token);
        }

        if (!!refresh_token) {
          localStorage.setItem("APP_REFRESH_TOKEN", refresh_token);
        }

        return response.data;
      },

      async function (error: any) {
        //TODO: interceptor to logout user when response status is 401
        return Promise.reject(error);
      }
    );

    instance.interceptors.request.use(
      async function (config: any) {
        const access_token = localStorage.getItem("APP_ACCESS_TOKEN");
        const refresh_token = localStorage.getItem("APP_REFRESH_TOKEN");

        if (!config?.url.includes("refresh-token")) {
          cfg = config;
        }

        let decoded: Decoded | undefined;

        if (!!access_token) {
          decoded = jwtDecode(access_token);
        }

        console.log(decoded);

        if (
          !!access_token &&
          !!refresh_token &&
          !(
            Math.floor(Date.now() / 1000) >
            parseInt(decoded?.exp ?? `${Math.floor(Date.now() / 1000)}`) - 60
          )
        ) {
          config.headers.Authorization = `Bearer ${access_token}`;
          return config;
        } else if (!!access_token && !!refresh_token) {
          await authInstance
            .post("/v1/auth/refresh-token", {
              access_token,
              refresh_token,
            })
            .then(async (res) => {
              const acc_token = localStorage.getItem("APP_ACCESS_TOKEN");
              config.headers.Authorization = `Bearer ${acc_token}`;
            });
          return config;
        }
        return config;
      },
      function (error: any) {
        return Promise.reject(error);
      }
    );

    this.axiosClientInstance = instance;
  }

  public get client(): Axios {
    return this.axiosClientInstance;
  }
}

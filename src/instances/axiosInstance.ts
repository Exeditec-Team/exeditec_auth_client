import axios, { Axios } from "axios";
import jwtDecode from "jwt-decode";
import { AdminClass } from "../repository/Admin";
import { Auth } from "../repository/Auth";
import { MFAClass } from "../repository/MFA";
import { User } from "../repository/User";
import { CLientInstance } from "./clientInstance";

export type Decoded = {
  exp: string | undefined;
  roles: Array<string> | undefined;
};

export class AuthApiClient {
  private axiosInstance: any;

  refreshToken = async () => {
    const access_token = localStorage.getItem("APP_ACCESS_TOKEN");
    const refresh_token = localStorage.getItem("APP_REFRESH_TOKEN");

    let decoded: Decoded | undefined;

    if (!!access_token) {
      jwtDecode(access_token);
    }

    if (
      !!refresh_token &&
      !!access_token &&
      Math.floor(Date.now() / 1000) >
        parseInt(decoded?.exp ?? `${Math.floor(Date.now() / 1000)}`) - 60
    ) {
      return await this.axiosInstance.post("/v1/auth/refresh-token", {
        access_token,
        refresh_token,
      });
    }
  };

  constructor(baseURL: string) {
    const axiosInstance = axios.create({
      baseURL,
      withCredentials: false,
    });

    let cfg: any;

    axiosInstance.interceptors.response.use(
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
        if (error.message === "JWT Expired") {
          const access_token = localStorage.getItem("APP_ACCESS_TOKEN");
          const refresh_token = localStorage.getItem("APP_REFRESH_TOKEN");

          if (!!refresh_token && !!access_token) {
            await axiosInstance
              .post("/v1/auth/refresh-token", {
                access_token,
                refresh_token,
              })
              .then(async (res) => {
                const acc_token = localStorage.getItem("APP_ACCESS_TOKEN");
                cfg.headers.Authorization = `Bearer ${acc_token}`;
                return await axios({ ...cfg });
              });
          }
        }
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.request.use(
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

        if (
          (!!config?.url && config?.url.includes("reset-password")) ||
          (!!config?.url && config?.url.includes("auth")) ||
          (!!config?.url &&
            config?.url.includes("refresh-token") &&
            !!access_token &&
            !!refresh_token &&
            !!(
              Math.floor(Date.now() / 1000) >
              parseInt(decoded?.exp ?? `${Math.floor(Date.now() / 1000)}`) - 60
            ))
        ) {
          return config;
        } else if (
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
          await axiosInstance
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

    this.axiosInstance = axiosInstance;
  }

  public get User(): User {
    return new User(this.axiosInstance);
  }

  public get Auth(): Auth {
    return new Auth(this.axiosInstance);
  }

  public get MFA(): MFAClass {
    return new MFAClass(this.axiosInstance);
  }

  public get Admin(): AdminClass | undefined {
    const access_token = localStorage.getItem("APP_ACCESS_TOKEN") || "";

    let decoded: Decoded | undefined;

    if (!!access_token) {
      jwtDecode(access_token);
    }

    if (decoded?.roles?.includes("ADMIN")) {
      return new AdminClass(this.axiosInstance);
    }
  }
  public client(baseURL: string): Axios {
    return new CLientInstance(this.axiosInstance, baseURL).client;
  }
}

export default {
  AuthApiClient,
};

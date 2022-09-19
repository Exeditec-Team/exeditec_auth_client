import { Axios } from "axios";

export class Auth {
  private axiosInstance: Axios;

  constructor(axiosInstance: Axios) {
    this.axiosInstance = axiosInstance;
  }

  register = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    return await this.axiosInstance.post("/v1/auth/register", {
      email,
      password,
    });
  };

  login = async ({ email, password }: { email: string; password: string }) => {
    return await this.axiosInstance
      .post("/v1/auth/login", {
        email,
        password,
      })
      .then(({ data }) => data)
      .catch((e) => {
        console.log(e);
      });
  };

  confirmAccount = async ({ token }: { token: string }) =>
    await this.axiosInstance.get("/v1/auth/confirm", {
      params: {
        token,
      },
    });

  resetPassword = async ({ email }: { email: string }) =>
    await this.axiosInstance.post("/v1/reset-password/request", {
      email,
    });

  verifyResetPassword = async ({ token }: { token: string }) =>
    await this.axiosInstance.get("/v1/reset-password/verify", {
      params: {
        token,
      },
    });

  confirmResetPassword = async ({
    token,
    password,
  }: {
    token: string;
    password: string;
  }) =>
    await this.axiosInstance.post(
      "/v1/reset-password/reset",
      { password },
      {
        params: {
          token,
        },
      }
    );
}

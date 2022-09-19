import { Axios } from "axios";

export class User {
  private axiosInstance: Axios;

  constructor(axiosInstance: Axios) {
    this.axiosInstance = axiosInstance;
  }

  readProfile = async () => {
    return await this.axiosInstance.get("/v1/profile");
  };

  readRefreshTokens = async () => {
    return await this.axiosInstance.get("/v1/profile/refresh-token");
  };

  cancelRefreshTokens = async (id: string) => {
    return await this.axiosInstance.get(`/v1/profile/refresh-token/${id}`);
  };

  createProfile = async (
    {
      firstName,
      lastName,
      phone,
    }: {
      firstName: string;
      lastName: string;
      phone: string;
    },
    custom: object | undefined
  ) => {
    return await this.axiosInstance.post("/v1/profile", {
      firstName,
      lastName,
      phone,
      ...custom,
    });
  };

  updateProfile = async (
    {
      firstName,
      lastName,
      phone,
    }: {
      firstName: string;
      lastName: string;
      phone: string;
    },
    custom: object | undefined
  ) => {
    return await this.axiosInstance.patch("/v1/profile", {
      firstName,
      lastName,
      phone,
      ...custom,
    });
  };

  changePassword = async ({
    oldPassword,
    password,
  }: {
    oldPassword: string;
    password: string;
  }) => {
    return await this.axiosInstance.patch("/v1/profile/change-password", {
      oldPassword,
      password,
    });
  };
}

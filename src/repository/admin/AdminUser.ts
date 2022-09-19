import { Axios } from "axios";

export class AdminUser {
  private axiosInstance: Axios;

  constructor(axiosInstance: Axios) {
    this.axiosInstance = axiosInstance;
  }

  allUsers = async () => {
    return await this.axiosInstance.get("/v1/user");
  };

  populateUsers = async () => {
    return await this.axiosInstance.get("/v1/user/populate");
  };

  readUser = async (id: string) => {
    return await this.axiosInstance.get(`/v1/user/${id}`);
  };

  createUser = async ({
    email,
    password,
    role,
  }: {
    email: string;
    password: string;
    role: object;
  }) => {
    return await this.axiosInstance.post("/v1/user", {
      email,
      password,
      role,
    });
  };

  updateUser = async (
    id: string,
    {
      email,
      isActive,
      role,
    }: {
      email: string;
      isActive: boolean;
      role: object;
    }
  ) => {
    return await this.axiosInstance.put(`/v1/user/${id}`, {
      email,
      isActive,
      role,
    });
  };

  deleteUser = async (id: string) => {
    return await this.axiosInstance.delete(`/v1/user/${id}`);
  };
}

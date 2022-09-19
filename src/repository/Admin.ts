import { Axios } from "axios";
import { AdminUser } from "./admin/AdminUser";
import { RoleClass } from "./admin/Role";

export class AdminClass {
  private axiosInstance: Axios;

  constructor(axiosInstance: Axios) {
    this.axiosInstance = axiosInstance;
  }

  public get Role(): RoleClass {
    return new RoleClass(this.axiosInstance);
  }

  public get User(): AdminUser {
    return new AdminUser(this.axiosInstance);
  }

  cleanUsersDB = async () => {
    return await this.axiosInstance
      .get("/v1/admin/clean-db")
      .then(({ data }) => data);
  };
}

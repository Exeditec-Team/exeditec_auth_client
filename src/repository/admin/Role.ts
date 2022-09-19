import { Axios } from "axios";

export class RoleClass {
  private axiosInstance: Axios;

  constructor(axiosInstance: Axios) {
    this.axiosInstance = axiosInstance;
  }
  
  allRoles = async () => {
    return await this.axiosInstance.get("/v1/role");
  };

  createRole = async ({
    name,
    isActive,
  }: {
    name: string;
    isActive: boolean;
  }) => {
    return await this.axiosInstance.post("/v1/role", {
      name,
      isActive,
    });
  };

  roleById = async ({ id }: { id: string }) => {
    return await this.axiosInstance.get(`/v1/role/${id}`);
  };

  editRole = async (
    id: string,
    {
      name,
      isActive,
    }: {
      name: string;
      isActive: boolean;
    }
  ) => {
    return await this.axiosInstance.put(`/v1/role/${id}`, {
      name,
      isActive,
    });
  };

  deleteRole = async ({ id }: { id: string }) => {
    return await this.axiosInstance.delete(`/v1/role/${id}`);
  };
}

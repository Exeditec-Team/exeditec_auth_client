import { Axios } from "axios";

export class MFAClass {
  private axiosInstance: Axios;

  constructor(axiosInstance: Axios) {
    this.axiosInstance = axiosInstance;
  }
  read2fa = async () => {
    return await this.axiosInstance.get("/v1/2fa/activate");
  };

  activate2fa = async ({ token }: { token: string }) => {
    return await this.axiosInstance.post("/v1/2fa/confirm", { token });
  };

  deactivate2fa = async ({ token }: { token: string }) => {
    return await this.axiosInstance.post("/v1/2fa/deactivate", { token });
  };

  auth2fa = async ({ token }: { token: string }) => {
    return await this.axiosInstance.post("/v1/2fa/authenticate", { token });
  };
}

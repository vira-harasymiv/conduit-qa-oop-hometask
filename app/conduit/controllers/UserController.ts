import { APIRequestContext } from "@playwright/test";
import { BaseController } from "./BaseController";

export class UserController extends BaseController {
  endpoint = "/api/user";
  endpointCreateUser = "/api/users";

  async updateUser(
    user?: {
      user?: {
        bio?: string;
        email?: string | any;
        image?: string;
        username?: string | any;
        password?: string | any;
      };
    },
    options?: {
      headers?: { Authorization?: string };
      failOnStatusCode?: boolean;
    },
  ) {
    const response = await this.request.put(this.endpoint, {
      data: user,
      headers: options?.headers,
      failOnStatusCode: options?.failOnStatusCode,
    });
    return response;
  }

  async createUser(
    user?: {
      user?: {
        email?: string | any;
        username?: string | any;
        password?: string | any;
      };
    },
    options?: { failOnStatusCode?: boolean },
  ) {
    const response = await this.request.post(this.endpointCreateUser, {
      data: user,
      failOnStatusCode: options?.failOnStatusCode,
    });
    return response;
  }

  async getCurrentUser(options?: {
    headers?: { Authorization?: string };
    failOnStatusCode?: boolean;
  }) {
    const response = await this.request.get(this.endpoint, {
      headers: options?.headers,
      failOnStatusCode: options?.failOnStatusCode,
    });
    return response;
  }
}

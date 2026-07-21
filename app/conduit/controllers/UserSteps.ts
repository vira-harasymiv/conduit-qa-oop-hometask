import { ApiController } from "./ApiController";
import { step } from "../utils/stepsDecorator";
import { APIRequestContext } from "@playwright/test";

export class UserSteps {
  api: ApiController;
  randomString = "article" + Math.floor(Math.random() * 1_000);
  email = this.randomString + "@gmail.com";
  password = process.env.CONDUIT_PASSWORD || "12345";
  username = this.randomString;
  constructor(request: APIRequestContext) {
    this.api = new ApiController(request);
  }

  @step
  async createUser() {
    const createUser = await this.api.userController.createUser(
      {
        user: {
          email: this.email,
          password: this.password,
          username: this.username,
        },
      },
      { failOnStatusCode: true },
    );
    return createUser;
  }

  @step
  async createAndGetUser() {
    const createUser = await this.api.userController.createUser(
      {
        user: {
          email: this.email,
          password: this.password,
          username: this.username,
        },
      },
      { failOnStatusCode: true },
    );
    const jsonCreate = await createUser.json();
    const token = jsonCreate.user.token;

    const getCreatedUser = await this.api.userController.getCurrentUser({
      headers: { Authorization: `Token ${token}` },
      failOnStatusCode: true,
    });

    return { createUser, getCreatedUser };
  }
}

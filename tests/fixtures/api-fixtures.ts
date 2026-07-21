import { test as base } from "./fixtures";
import { ArticleController } from "../../app/conduit/controllers/ArticleController";
import { UserController } from "../../app/conduit/controllers/UserController";
import { ArticleSteps } from "../../app/conduit/controllers/ArticleSteps";
import { UserSteps } from "../../app/conduit/controllers/UserSteps";
export { expect } from "@playwright/test";

type Fixtures = {
  articleController: ArticleController;
  userController: UserController;
  articleSteps: ArticleSteps;
  userSteps: UserSteps;
};

export const test = base.extend<Fixtures>({
  articleController: async ({ request }, use) => {
    await use(new ArticleController(request));
  },

  userController: async ({ request }, use) => {
    await use(new UserController(request));
  },

  articleSteps: async ({ request }, use) => {
    await use(new ArticleSteps(request));
  },

  userSteps: async ({ request }, use) => {
    await use(new UserSteps(request));
  },
});

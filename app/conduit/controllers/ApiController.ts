import { ArticleController } from "./ArticleController";
import { UserController } from "./UserController";
import { APIRequestContext } from "@playwright/test";

export class ApiController {
  articleController: ArticleController;
  userController: UserController;
  constructor(request: APIRequestContext) {
    this.articleController = new ArticleController(request);
    this.userController = new UserController(request);
  }
}

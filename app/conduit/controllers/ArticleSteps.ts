import { ApiController } from "./ApiController";
import { step } from "../utils/stepsDecorator";
import { APIRequestContext } from "@playwright/test";

export class ArticleSteps {
  api: ApiController;
  randomString = "article" + Math.floor(Math.random() * 1_000);

  constructor(request: APIRequestContext) {
    this.api = new ApiController(request);
  }

  @step
  async createArticle() {
    const createArticle = await this.api.articleController.createArticle(
      {
        author: {},
        title: this.randomString,
        description: "desc here",
        body: "body",
        tagList: ["qa", "test"],
      },
      { failOnStatusCode: true },
    );
    return createArticle;
  }

  @step
  async createArticleOnlyWithTitle() {
    const response = await this.api.articleController.createArticle(
      {
        title: this.randomString,
      },
      { failOnStatusCode: true },
    );
    return response;
  }
}

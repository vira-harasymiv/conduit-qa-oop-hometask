import { BaseController } from "./BaseController";

export class ArticleController extends BaseController {
  articleEndpoint = "/api/articles";

  async getArticles(
    params?: {
      offset?: number | any;
      limit?: number | any;
      tag?: string | any;
      author?: string | any;
      favorited?: boolean | any;
    },
    options?: { failOnStatusCode?: boolean | undefined },
  ) {
    const response = await this.request.get(this.articleEndpoint, {
      params: params,
      failOnStatusCode: options?.failOnStatusCode,
    });
    return response;
  }

  async getAllArticles() {
    const response = await this.request.get(this.articleEndpoint, {
      failOnStatusCode: true,
    });
    return response;
  }

  async createArticle(
    article: {
      author?: object;
      title?: string;
      description?: string;
      body?: string;
      tagList?: Array<string>;
    },
    options?: { failOnStatusCode?: boolean | undefined },
  ) {
    const response = await this.request.post("/api/articles", {
      data: {
        article: article,
      },
      failOnStatusCode: options?.failOnStatusCode,
    });
    return response;
  }
}

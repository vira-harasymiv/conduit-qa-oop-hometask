import { expect, test } from "../../fixtures/api-fixtures";
import {
  checkMandatoryHeaders,
  expectOKStatusCode,
} from "../../../app/conduit/utils/expect-helpers";
import { TAG } from "../tags";

test.describe(
  "Positive Scenarios: Create Article",
  { tag: [TAG.articles, TAG.regression, TAG.smoke] },
  () => {
    test("Verify the ability to create a new article with author, title, description, body, and tags", async ({
      articleSteps,
    }) => {
      const response = await articleSteps.createArticle();
      await checkMandatoryHeaders(response);
      await expectOKStatusCode(response);
    });

    test("Verify the ability to create a new article only with title", async ({
      articleSteps,
    }) => {
      const response = await articleSteps.createArticleOnlyWithTitle();
      await checkMandatoryHeaders(response);
      await expectOKStatusCode(response);
    });

    test("Verify that articles with duplicate titles get unique slugs", async ({
      articleController,
      randomString,
    }) => {
      //!ARRANGE
      const payload = {
        title: randomString,
      };

      const firstResponse =
        await test.step("1. Create a new article using only title and tags", async () => {
          return await articleController.createArticle(payload, {
            failOnStatusCode: true,
          });
        });

      const secondResponse =
        await test.step("2. Create a new article using the same title and tags as in STEP 1", async () => {
          return await articleController.createArticle(payload, {
            failOnStatusCode: true,
          });
        });

      await test.step("3. Verify that article slugs are different for articles with the same tags and titles", async () => {
        const slug1 = (await firstResponse.json())["article"]["slug"];
        const slug2 = (await secondResponse.json())["article"]["slug"];
        expect(slug1).not.toBe(slug2);
      });
    });
  },
);

test.describe(
  "Negative Scenarios - Create Article",
  { tag: [TAG.articles, TAG.negative, TAG.regression] },
  () => {
    test("Verify that article can not be created without title (400 status code) (KNOWN ISSUE)", async ({
      articleController,
    }) => {
      const response =
        await test.step("1. Create a new article without title", async () => {
          return await articleController.createArticle(
            {
              author: {},
              description: "desc here",
              body: "body",
              tagList: ["qa", "test"],
            },
            { failOnStatusCode: false },
          );
        });

      await checkMandatoryHeaders(response);

      await test.step("2. Verify that Status Code is 400 Bad Request", async () => {
        expect.soft(response.status()).toBe(400);
      });
    });
  },
);

test.describe(
  "Negative Scenario: create article without authorization",
  { tag: [TAG.negative, TAG.negative, TAG.regression] },
  async () => {
    test.use({ isAuthorized: false });
    test("Verify that non-authorized user can not create a new article (401 error)", async ({
      articleController,
      randomString,
    }) => {
      const response =
        await test.step("1. Try to create a new article without authorization", async () => {
          return await articleController.createArticle(
            {
              author: {},
              title: randomString,
              description: "desc here",
              body: "body",
              tagList: ["qa", "test"],
            },
            { failOnStatusCode: false },
          );
        });

      await checkMandatoryHeaders(response);

      await test.step("2. Verify if the Status Code is 401 Unauthorized", async () => {
        expect.soft(response.status()).toBe(401);
      });
    });
  },
);

import { expect, test } from "../../fixtures/api-fixtures";
import {
  checkMandatoryHeaders,
  expectOKStatusCode,
} from "../../../app/conduit/utils/expect-helpers";
import { TAG } from "../tags";
import {
  testDataForOffsetAndLimit,
  testDataForTagAndAuthor,
  testDataForFavorited,
} from "./testData/testData";

test.describe(
  "Positive Scenarios: GET article list",
  { tag: [TAG.articles, TAG.regression] },
  () => {
    let articlesCount: number;
    let offSetArticle: any;
    let firstArticle: any;
    const offset = 2;
    const limit = 10;
    test.beforeEach(async ({ articleController }) => {
      const responseGetAllArticles = await articleController.getAllArticles();
      const allArticlesJson = await responseGetAllArticles.json();

      articlesCount =
        await test.step("1. Find the number of articles", async () => {
          return allArticlesJson["articlesCount"];
        });

      offSetArticle =
        await test.step(`2. Find article with ID = ${offset}`, async () => {
          return allArticlesJson["articles"][offset];
        });

      firstArticle = await test.step("3. Find the first article", async () => {
        return allArticlesJson["articles"][0];
      });
    });

    test(`Verify taking articles by offset and limit (offset: ${offset} < limit: ${limit})`, async ({
      articleController,
    }) => {
      //!ACT
      const response =
        await test.step(`4. Take all articles when offset is ${offset} and limit is ${limit}`, async () => {
          const responseGet = await articleController.getArticles(
            { offset: offset, limit: limit },
            { failOnStatusCode: true },
          );
          return responseGet;
        });

      const json = await response.json();
      //!ASSERT
      await test.step("5.Verify if the array length is equal to the limit parameter", async () => {
        expect.soft(json["articles"].length).toBe(limit);
      });

      await test.step("6.Verify if the first parameter is equal to the offset parameter", async () => {
        const responseGet = await articleController.getAllArticles();
        const jsonGet = await responseGet.json();
        expect
          .soft(json["articles"][0])
          .toMatchObject(jsonGet["articles"][offset]);
      });
      //! FALSE-NEGATIVE: it should be clarified
      // await test.step("6.Verify if the first parameter is equal to the offset parameter", async () => {
      //   expect.soft(json["articles"][0]).toMatchObject(offSetArticle);
      // });

      await checkMandatoryHeaders(response);
      await expectOKStatusCode(response);
    });

    test("Verify taking articles by offset and limit (offset: ${offsetLargerThanLimit}  > limit: ${limit})", async ({
      articleController,
    }) => {
      //!ACT
      const response =
        await test.step(`4. Take all articles when offset is larger than the article length`, async () => {
          const response = await articleController.getArticles(
            { offset: articlesCount + 2, limit: articlesCount },
            { failOnStatusCode: true },
          );
          return response;
        });

      //!ASSERT
      await test.step("5.Verify if the article array is empty", async () => {
        const json = await response.json();
        expect.soft(json["articles"].length).toBe(0);
      });
      await checkMandatoryHeaders(response);
      await expectOKStatusCode(response);
    });

    test("Verify taking articles by offset and limit (skip: any valid value & limit: 0)", async ({
      articleController,
    }) => {
      //!ACT
      const response =
        await test.step(`4. Take all articles when skip is any valid value and limit is 0`, async () => {
          const response = await articleController.getArticles(
            { offset: offset, limit: 0 },
            { failOnStatusCode: true },
          );
          return response;
        });

      //!ASSERT
      await test.step("5.Verify if the article array is NOT empty", async () => {
        const json = await response.json();
        expect.soft(json["articles"].length).toBeGreaterThan(1);
      });
      await checkMandatoryHeaders(response);
      await expectOKStatusCode(response);
    });

    test(`Verify taking articles when limit is larger than the articles number`, async ({
      articleController,
    }) => {
      //!ACT
      const response =
        await test.step("4. Take articles when the limit is larger than the articles number", async () => {
          const response = await articleController.getArticles(
            { limit: articlesCount + 1 },
            { failOnStatusCode: true },
          );
          return response;
        });

      //!ASSERT
      await test.step("5.Verify if all articles are shown", async () => {
        const json = await response.json();
        expect.soft(json["articles"].length).toBe(articlesCount);
      });

      await checkMandatoryHeaders(response);
      await expectOKStatusCode(response);
    });

    test("Verify taking articles when limit is 0", async ({
      articleController,
    }) => {
      //!ACT
      const response =
        await test.step("4. Take articles when the limit is 0", async () => {
          const response = await articleController.getArticles(
            { limit: 0 },
            { failOnStatusCode: true },
          );
          return response;
        });

      //!ASSERT
      await test.step("5.Verify if all articles are shown", async () => {
        const json = await response.json();
        expect.soft(json["articles"].length).toBe(articlesCount);
      });

      await checkMandatoryHeaders(response);
      await expectOKStatusCode(response);
    });

    test("Verify taking only the first article (offset = 0 & limit = 1)", async ({
      articleController,
    }) => {
      //!ACT
      const response =
        await test.step("4. Take articles when the limit is 1", async () => {
          const response = await articleController.getArticles(
            { offset: 0, limit: 1 },
            { failOnStatusCode: true },
          );
          return response;
        });

      const json = await response.json();

      //!ASSERT
      await test.step("5.Verify if only 1 article is shown", async () => {
        expect.soft(json["articles"].length).toBe(1);
      });

      await test.step("6. Verify if the first article is shown", async () => {
        expect.soft(json["articles"][0]).toMatchObject(firstArticle);
      });

      await checkMandatoryHeaders(response);
      await expectOKStatusCode(response);
    });

    test("Verify taking articles by non-existing tag", async ({
      articleController,
      randomString,
    }) => {
      const response =
        await test.step("4. Take all articles by non-existing tag", async () => {
          return await articleController.getArticles(
            {
              tag: "Non-existing tag" + randomString,
            },
            { failOnStatusCode: true },
          );
        });

      await test.step("5.Verify if the article array is empty", async () => {
        const json = await response.json();
        expect.soft(json["articles"].length).toBe(0);
      });

      await checkMandatoryHeaders(response);

      await expectOKStatusCode(response);
    });

    //!KNOWN ISSUE
    test("Verify taking articles by non-existing author - KNOWN iSSUE", async ({
      articleController,
      randomString,
    }) => {
      const response =
        await test.step("4. Take all articles by non-existing author", async () => {
          return await articleController.getArticles(
            {
              author: "Non-existing author" + randomString,
            },
            { failOnStatusCode: true },
          );
        });

      await test.step("5.Verify if the article array is empty", async () => {
        const json = await response.json();
        expect.soft(json["articles"].length).toBe(0);
      });

      await checkMandatoryHeaders(response);

      await expectOKStatusCode(response);
    });
  },
);

test("Verify taking articles without parameters", async ({
  articleController,
}) => {
  const response = await test.step("1. Get all articles", async () => {
    return await articleController.getAllArticles();
  });
  await test.step("Verify if the default value is 20", async () => {
    expect.soft((await response.json())["articles"].length).toBe(20);
  });
  await checkMandatoryHeaders(response);
  await expectOKStatusCode(response);
});

test.describe(
  "Negative Scenarios: GET article list using invalid data types",
  { tag: [TAG.articles, TAG.regression, TAG.negative] },
  () => {
    for (const { id, dataType, data } of testDataForOffsetAndLimit) {
      test(`${id} Verify taking all articles when offset is ${dataType}`, async ({
        articleController,
      }) => {
        const response = await articleController.getArticles(
          { offset: data },
          { failOnStatusCode: true },
        );
        await checkMandatoryHeaders(response);
        await expectOKStatusCode(response);
      });
    }

    for (const { id, dataType, data } of testDataForOffsetAndLimit) {
      test(`${id} Verify taking all articles when limit is ${dataType}`, async ({
        articleController,
      }) => {
        const response = await articleController.getArticles(
          { limit: data },
          { failOnStatusCode: true },
        );
        await checkMandatoryHeaders(response);
        await expectOKStatusCode(response);
      });
    }

    for (const { id, dataType, data } of testDataForTagAndAuthor) {
      test(`${id} Verify taking all articles when tag is ${dataType}`, async ({
        articleController,
      }) => {
        const response = await articleController.getArticles(
          { tag: data },
          { failOnStatusCode: true },
        );
        await checkMandatoryHeaders(response);
        await expectOKStatusCode(response);
      });
    }

    for (const { id, dataType, data } of testDataForTagAndAuthor) {
      test(`${id} Verify taking all articles when author is ${dataType}`, async ({
        articleController,
      }) => {
        const response = await articleController.getArticles(
          { author: data },
          { failOnStatusCode: true },
        );
        await checkMandatoryHeaders(response);
        await expectOKStatusCode(response);
      });
    }

    for (const { id, dataType, data } of testDataForFavorited) {
      test(`${id} Verify taking all articles when favorited is ${dataType}`, async ({
        articleController,
      }) => {
        const response = await articleController.getArticles(
          { favorited: data },
          { failOnStatusCode: true },
        );
        await checkMandatoryHeaders(response);
        await expectOKStatusCode(response);
      });
    }
  },
);

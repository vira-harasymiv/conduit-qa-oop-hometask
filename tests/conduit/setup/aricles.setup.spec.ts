import { expect, test } from "../../fixtures/api-fixtures";
import { articles } from "./articles";
import {
  checkMandatoryHeaders,
  expectOKStatusCode,
  checkCreatedArticle,
} from "../../../app/conduit/utils/expect-helpers";

for (const { title, description, body, tagList } of articles) {
  test(`create article ${title}`, async ({ articleController }) => {
    //!ACT
    const response = await test.step("1. Create 3 articles", async () => {
      return await articleController.createArticle(
        {
          title: title,
          description: description,
          body: body,
          tagList: tagList,
        },
        { failOnStatusCode: true },
      );
    });

    //!ASSERT
    await test.step("2. Verify headers", async () => {
      await checkMandatoryHeaders(response);
    });

    await test.step("3. Verify the Status Code", async () => {
      await expectOKStatusCode(response);
    });

    await test.step("4. Verify the JSON body", async () => {
      await checkCreatedArticle(response, title, description, body, tagList);
    });
  });
}

import { expect, test } from "../../fixtures/api-fixtures";
import {
  checkMandatoryHeaders,
  expectOKStatusCode,
} from "../../../app/conduit/utils/expect-helpers";
import { TAG } from "../tags";
import {
  testDataForInvalidEmail,
  testDataForInvalidPassword,
  testDataForInvalidName,
} from "./testData/testData";

test.describe(
  "Positive Scenario: Create a new user",
  { tag: [TAG.users, TAG.smoke, TAG.regression] },
  () => {
    test.use({ isAuthorized: false });
    //!ACT
    test("Verify the ability to create a new user", async ({ userSteps }) => {
      const { createUser, getCreatedUser } = await userSteps.createAndGetUser();

      //!ASSERT
      await test.step("Verify if the user has been created", async () => {
        const jsonCreateUser = await createUser.json();
        const jsonGetCurrentUser = await getCreatedUser.json();
        expect
          .soft(jsonCreateUser["user"]["username"])
          .toBe(jsonGetCurrentUser["user"]["username"]);
        expect
          .soft(jsonCreateUser["user"]["email"])
          .toBe(jsonGetCurrentUser["user"]["email"]);
        //! FALSE NEGATIVE RESULT
        //   expect.soft(jsonCreateUser).toMatchObject(jsonGetCurrentUser);
      });
      await checkMandatoryHeaders(createUser);
      await expectOKStatusCode(createUser);
    });
  },
);

test.describe(
  "NEGATIVE Scenarios: Create a new user",
  { tag: [TAG.users, TAG.negative, TAG.regression] },
  () => {
    test.use({ isAuthorized: false });
    //!ARRANGE
    const randomNumber = Math.floor(Math.random() * 1_000);
    const email = "user" + randomNumber + "@gmail.com";
    const payload = {
      email: email,
      password: "12345",
      username: "user" + randomNumber,
    };

    test("Create users with the same email - it should be error", async ({
      userController,
    }) => {
      const firstResponse =
        await test.step("1. Create a new user", async () => {
          return await userController.createUser(
            {
              user: payload,
            },
            { failOnStatusCode: true },
          );
        });

      const secondResponse =
        await test.step("2. Create a new user with the same email as in STEP 1", async () => {
          return await userController.createUser(
            {
              user: payload,
            },
            { failOnStatusCode: false },
          );
        });

      //!ASSERT
      await test.step("3. Verify if the status code is 422", async () => {
        expect.soft(secondResponse.status()).toBe(422);
      });
      await checkMandatoryHeaders(secondResponse);
    });

    for (const { id, dataType, data } of testDataForInvalidEmail) {
      test(`${id} Create a new user with email = ${dataType}`, async ({
        userController,
        randomString,
      }) => {
        const response = await userController.createUser(
          {
            user: {
              email: data,
              password: "12345",
              username: `user${randomString}`,
            },
          },
          { failOnStatusCode: false },
        );
        expect.soft(response.status()).toBe(422);
        await checkMandatoryHeaders(response);
      });
    }

    for (const { id, dataType, data } of testDataForInvalidPassword) {
      test(`${id} Create a new user with password = ${dataType}`, async ({
        userController,
        randomString,
      }) => {
        const response = await userController.createUser(
          {
            user: {
              email: `user${randomString}@gmail.com`,
              password: data,
              username: `user${randomString}`,
            },
          },
          { failOnStatusCode: false },
        );
        expect.soft(response.status()).toBe(422);
        await checkMandatoryHeaders(response);
      });
    }

    for (const { id, dataType, data } of testDataForInvalidName) {
      test(`${id} Create a new user with name = ${dataType}`, async ({
        userController,
        randomString,
      }) => {
        const response = await userController.createUser(
          {
            user: {
              email: `user${randomString}@gmail.com`,
              password: "12345",
              username: data,
            },
          },
          { failOnStatusCode: false },
        );
        expect.soft(response.status()).toBe(422);
        await checkMandatoryHeaders(response);
      });
    }
  },
);

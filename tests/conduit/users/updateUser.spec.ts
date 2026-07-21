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
  "Positive Scenario: Update User",
  { tag: [TAG.users, TAG.smoke, TAG.regression] },
  () => {
    test.use({ isAuthorized: false });
    const randomNumber = Math.floor(Math.random() * 1_0000);
    const email = "test" + randomNumber + "@gmail.com";
    const password = process.env.CONDUIT_PASSWORD || "12345";
    const username = "user" + randomNumber;
    let token: string;
    test.beforeEach(async ({ userController }) => {
      const responseCreateUser =
        await test.step("1. Create a new user", async () => {
          return userController.createUser(
            {
              user: {
                email: email,
                password: password,
                username: username,
              },
            },
            { failOnStatusCode: true },
          );
        });
      const jsonCreate = await responseCreateUser.json();
      token = jsonCreate["user"]["token"];
    });

    test("Verify the ability to update the user's image", async ({
      userController,
      randomString,
    }) => {
      const bio = "bio" + randomString;
      const image = "https://www.google.com/imgres?q=cat";
      const response =
        await test.step("2. Update image of the created user", async () => {
          return userController.updateUser(
            {
              user: {
                bio: bio,
                image: image,
                email: email,
                password: password,
                username: username,
              },
            },
            {
              headers: { Authorization: `Token ${token}` },
              failOnStatusCode: true,
            },
          );
        });
      await test.step("3. Verify the updated user", async () => {
        const json = await response.json();
        expect.soft(json["user"]["bio"]).toBe(bio);
        expect.soft(json["user"]["image"]).toBe(image);
        expect.soft(json["user"]["email"]).toBe(email);
        expect.soft(json["user"]["username"]).toBe(username);
      });
      await checkMandatoryHeaders(response);
      await expectOKStatusCode(response);
    });
  },
);

test.describe(
  "Negative Scenario: Update User without Authorization",
  { tag: [TAG.users, TAG.negative, TAG.regression] },
  () => {
    test.use({ isAuthorized: false });
    test("Verify that non-authorized user can not update settings (401 ERROR)", async ({
      userController,
      randomString,
    }) => {
      const response = await userController.updateUser(
        {
          user: {
            bio: "bio" + randomString,
            image: "https://www.google.com/imgres?q=cat",
            email: randomString + "@gmail.com",
            password: "password123",
            username: randomString,
          },
        },
        { failOnStatusCode: false },
      );
      expect.soft(response.status()).toBe(401);
      await checkMandatoryHeaders(response);
    });
  },
);

test.describe(
  "Negative Scenarios: Update User with using invalid data types",
  { tag: [TAG.users, TAG.negative, TAG.regression] },
  () => {
    for (const { id, dataType, data } of testDataForInvalidEmail) {
      test(`Verify that a user can not update an email with invalid type = ${dataType}`, async ({
        userController,
        randomString,
      }) => {
        const response = await userController.updateUser(
          {
            user: {
              bio: "bio" + randomString,
              image: "https://www.google.com/imgres?q=cat",
              email: data,
              password: "password123",
              username: randomString,
            },
          },
          { failOnStatusCode: false },
        );
        expect.soft(response.status()).toBe(422);
        await checkMandatoryHeaders(response);
      });
    }

    for (const { id, dataType, data } of testDataForInvalidPassword) {
      test(`Verify that a user can not update password to ${dataType}`, async ({
        userController,
        randomString,
      }) => {
        const response = await userController.updateUser(
          {
            user: {
              bio: "bio" + randomString,
              image: "https://www.google.com/imgres?q=cat",
              email: randomString + "@gmail.com",
              password: data,
              username: randomString,
            },
          },
          { failOnStatusCode: false },
        );
        expect.soft(response.status()).toBe(422);
        await checkMandatoryHeaders(response);
      });
    }

    for (const { id, dataType, data } of testDataForInvalidName) {
      test(`Verify that a user can not update name to ${dataType}`, async ({
        userController,
        randomString,
      }) => {
        const response = await userController.updateUser(
          {
            user: {
              bio: "bio" + randomString,
              image: "https://www.google.com/imgres?q=cat",
              email: randomString + "@gmail.com",
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

import {
  APIRequestContext,
  test as base,
  expect,
  request as APIrequest,
} from "@playwright/test";
import { promises } from "fs";
import { faker } from "@faker-js/faker";

type Fixtures = {
  isAuthorized: boolean;
  nonAuthRequest: APIRequestContext;
  randomString: string;
};

export const test = base.extend<Fixtures>({
  isAuthorized: true,
  request: async ({ request, isAuthorized }, use) => {
    if (isAuthorized === true) {
      const token = await getToken(request);
      const req = await APIrequest.newContext({
        extraHTTPHeaders: {
          Authorization: `Token ${token}`,
        },
      });
      await use(req);
    } else {
      await use(request);
    }
  },
  randomString: async ({}, use) => {
    const random = Math.floor(Math.random() * 1_000_000);
    const title = faker.lorem.word({ length: 5 }) + random;
    await use(random + title);
  },
});

async function isTokenValid(request: APIRequestContext, token: string) {
  const response = await request.get("/api/user", {
    headers: {
      Authorization: `Token ${token}`,
    },
    failOnStatusCode: false,
  });
}

async function getToken(request: APIRequestContext) {
  let token: string;
  try {
    token = await promises.readFile(".token", { encoding: "utf-8" });
    const isValid = isTokenValid(request, token);
    expect(isValid).toBeTruthy();
  } catch (error) {
    const response = await request.post("/api/users/login", {
      data: {
        user: {
          email: process.env.CONDUIT_EMAIL,
          password: process.env.CONDUIT_PASSWORD,
        },
      },
      failOnStatusCode: true,
    });
    const json = await response.json();
    token = json.user.token;
    await promises.writeFile(".token", token);
  }
  return token;
}

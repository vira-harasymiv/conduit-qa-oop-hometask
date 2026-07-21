import { APIResponse, expect, test } from "@playwright/test";

export async function checkMandatoryHeaders(response: APIResponse) {
  await test.step("Verify headers", async () => {
    const headers = response.headers();
    expect.soft(headers["connection"]).toBe("keep-alive");
    expect.soft(headers["content-type"]).toContain("application/json");
    expect.soft(headers["access-control-allow-origin"]).toBe("*");
  });
}

export async function expectOKStatusCode(response: APIResponse) {
  await test.step("Verify if the Status Code is 200 OK", async () => {
    expect.soft(response).toBeOK();
    expect.soft(response.status()).toBe(200);
    expect.soft(response.statusText()).toBe("OK");
  });
}

export async function checkCreatedArticle(
  response: APIResponse,
  title: string,
  description: string,
  body: string,
  tagList: Array<String>,
) {
  const json = await response.json();
  expect.soft(json.article.title).toBe(title);
  expect.soft(json.article.description).toBe(description);
  expect.soft(json.article.body).toBe(body);
  expect.soft(json.article.tagList).toEqual(tagList);
}

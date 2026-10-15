const { test, expect } = require("playwright/test");

test("Login and Buy a product", async ({ page }) => {
  test.setTimeout(180000);

  // Login
  await page.goto("https://www.flipkart.com/");
  await page
    .getByRole("spinbutton", { name: "Phone Number" })
    .fill("9319919691");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(25000); // enter OTP manually
  await page.getByRole("button", { name: "Verify" }).click();
  await page.waitForTimeout(1000);

  // Search
  const searchBox = page.getByRole("textbox", {
    name: "Search for Products, Brands",
  });
  await searchBox.fill("Watch under 300");
  await searchBox.press("Enter");

  await page.waitForTimeout(3000);
  const firstProduct = page.locator('a[href*="/p/"]').first();
  await expect(firstProduct).toBeVisible();
  const newPagePromise = page.context().waitForEvent("page");
  await firstProduct.click();

  const productPage = await newPagePromise;
  await productPage.waitForLoadState("domcontentloaded");
  await productPage.waitForTimeout(2000);

  await productPage
    .locator(
      ".css-g5y9jx > div:nth-child(2) > ._1psv1zeb9 > div > div > div:nth-child(2)",
    )
    .click();

  await productPage.waitForTimeout(4000);
  await productPage.getByText("Continue").first().click();

  await productPage.waitForTimeout(1000);
  await productPage.getByRole("button", { name: "Place Order" }).click();
  await productPage.getByRole("button", { name: "Confirm order" }).click();
  await expect(
    productPage.getByText("Thanks for shopping with us!"),
  ).toBeVisible();
});

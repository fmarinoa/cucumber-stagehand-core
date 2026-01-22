import { Given, When } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { URL_BASE } from "@/index";

Given("navego a la tienda", async function (this: CustomWorld) {
  await this.page.goto(URL_BASE);
});

When(
  "agrego el producto {string} al carrito",
  async function (this: CustomWorld, productName: string) {
    await this.page.locator(`//h3[text()='${productName}']`).first().click();
    await this.page.locator("#add").click();
    console.time("Checkout");
    await new Promise((resolve) => setTimeout(resolve, 3_000));
    console.timeEnd("Checkout");
  },
);

When("me dirijo a la pantalla de checkout", async function (this: CustomWorld) {
  await this.page.locator("//a[@class='checkout']").click();
});

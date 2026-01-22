import { After, AfterStep, Before, Status } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { BrowserSession } from "@/core/BrowserSession";

let session: BrowserSession;

Before(async function (this: CustomWorld) {
  session = await BrowserSession.create();

  this.stagehand = session.stagehand;
  this.page = session.page;
});

AfterStep(async function (this: CustomWorld, { result }) {
  if (result.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ type: "png" });
    this.attach(screenshot, "image/png");
  }
});

After(async function () {
  if (session) await session.close();
});

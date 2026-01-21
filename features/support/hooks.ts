import { After, AfterStep, Before, Status } from "@cucumber/cucumber";
import { CustomWorld } from "./world";
import { createStagehand } from "@/repositories";

Before(async function (this: CustomWorld) {
  const stagehand = createStagehand();
  await stagehand.init();

  const [page] = stagehand.context.pages();
  this.stagehand = stagehand;
  this.page = page;
});

AfterStep(async function ({ result }) {
  if (result.status === Status.FAILED) {
    this.attach(await this.page.screenshot({ type: "png" }), "image/png");
  }
});

After(async function (this: CustomWorld) {
  if (this.stagehand) {
    await this.stagehand.close();
  }
});

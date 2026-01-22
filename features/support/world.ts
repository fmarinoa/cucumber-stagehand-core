import { Stagehand } from "@browserbasehq/stagehand";
import {
  setWorldConstructor,
  setDefaultTimeout,
  World,
} from "@cucumber/cucumber";
import { Page } from "playwright-core";

export class CustomWorld extends World {
  stagehand!: Stagehand;
  page!: Page;

  constructor(options: any) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60 * 1000);

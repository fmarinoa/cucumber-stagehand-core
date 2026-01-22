import { Stagehand, V3Options, AvailableModel } from "@browserbasehq/stagehand";
import { GEMINI_MODEL } from "..";

const config: V3Options = {
  env: "LOCAL",
  model: GEMINI_MODEL as AvailableModel,
  localBrowserLaunchOptions: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  },
};

export const createStagehand = () => new Stagehand(config);

import { Stagehand } from "@browserbasehq/stagehand";
import { Browser, chromium, Page, BrowserContext } from "playwright-core";
import { createStagehand } from "@/repositories";

export class BrowserSession {
  private _stagehand: Stagehand;
  private _browser: Browser;
  private _context: BrowserContext;
  private _page: Page;

  private constructor(
    stagehand: Stagehand,
    browser: Browser,
    context: BrowserContext,
    page: Page,
  ) {
    this._stagehand = stagehand;
    this._browser = browser;
    this._context = context;
    this._page = page;
  }

  get stagehand() {
    return this._stagehand;
  }

  get page() {
    return this._page;
  }

  static async create(): Promise<BrowserSession> {
    const stagehand = createStagehand();
    await stagehand.init();

    const browser = await chromium.connectOverCDP({
      wsEndpoint: stagehand.connectURL(),
    });

    const context = browser.contexts()[0];
    const page = context.pages()[0];

    return new BrowserSession(stagehand, browser, context, page);
  }

  async close() {
    if (this._browser) await this._browser.close();

    if (this._stagehand) await this._stagehand.close();
  }
}

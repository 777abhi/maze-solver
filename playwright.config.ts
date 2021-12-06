//playwright.config.ts
import { PlaywrightTestConfig } from "@playwright/test";
const config: PlaywrightTestConfig = {
  timeout: 12 * 10000, // 2 minutes
  //reporter:'html',
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        baseURL: 'http://localhost:5002',
        headless: false,
        //video:'on',
        //trace:'on',
        launchOptions: {
          //slowMo:2000
        },
      },
    },
  ],
};
export default config;
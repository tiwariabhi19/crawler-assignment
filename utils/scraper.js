const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const urlPatterns = require("./urlPatterns");

exports.crawlDomains = async (domains, settings) => {
  const results = {};

  for (const domain of domains) {
    results[domain] = await crawlSingleDomain(domain, settings);
  }

  return results;
};

const crawlSingleDomain = async (domain, settings) => {
  const productUrls = new Set();

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://${domain}`, {
      waitUntil: "networkidle2",
      timeout: settings.timeout,
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    $("a").each((_, element) => {
      const href = $(element).attr("href");
      if (urlPatterns.some((pattern) => pattern.test(href))) {
        productUrls.add(
          href.startsWith("http") ? href : `https://${domain}${href}`
        );
      }
    });

    await browser.close();
  } catch (error) {
    console.error(`Error crawling domain ${domain}:`, error);
  }

  return Array.from(productUrls);
};

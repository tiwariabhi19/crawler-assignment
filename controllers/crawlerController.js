const scraper = require("../utils/scraper");
const settings = require("../config/settings");

exports.crawlDomains = async (req, res) => {
  const { domains } = req.body;

  if (!Array.isArray(domains) || domains.length === 0) {
    return res.status(400).json({ error: "Invalid or missing domains array." });
  }

  try {
    const results = await scraper.crawlDomains(domains, settings);
    return res.status(200).json({ success: true, results });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error occurred while crawling domains." });
  }
};

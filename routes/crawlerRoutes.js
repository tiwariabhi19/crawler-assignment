const express = require("express");
const { crawlDomains } = require("../controllers/crawlerController");

const router = express.Router();

router.post("/crawl", crawlDomains);

module.exports = router;

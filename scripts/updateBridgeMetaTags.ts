/* eslint-disable no-console */
/* eslint-disable quotes */
/*
  Problem: Since the build was done in SPA mode, the meta tags are same for all pages (taken from nuxt.config.ts)
  Solution: This script is used to replace meta tags for Bridge pages after the build was done
*/
import { load } from "cheerio";
import { readFile, writeFile } from "fs";

import { bridge as bridgeMeta } from "../data/meta";

const filePaths = ["./dist/index.html", "./dist/bridge/index.html", "./dist/bridge/withdraw/index.html"];

filePaths.forEach((filePath) => {
  readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    const $ = load(data);

    $("title").text(bridgeMeta.title);
    $('meta[name="apple-mobile-web-app-title"]').attr("content", bridgeMeta.title);
    $('meta[property="og:title"]').attr("content", bridgeMeta.title);
    $('meta[property="og:site_name"]').attr("content", bridgeMeta.title);
    $('meta[name="description"]').attr("content", bridgeMeta.description);
    $('meta[property="og:description"]').attr("content", bridgeMeta.description);
    $('meta[property="og:image:alt"]').attr("content", bridgeMeta.previewImg.alt);
    $('meta[property="og:image"]').attr("content", bridgeMeta.previewImg.src);

    writeFile(filePath, $.html(), "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
});

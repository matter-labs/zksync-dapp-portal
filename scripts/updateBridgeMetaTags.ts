/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
const cheerio = require("cheerio");
const fs = require("fs");

const filePaths = ["./dist/bridge/index.html", "./dist/bridge/withdraw/index.html"];

filePaths.forEach((filePath) => {
  fs.readFile(filePath, "utf8", function (err: any, data: any) {
    if (err) {
      return console.log(err);
    }
    const $ = cheerio.load(data);
    const meta = {
      title: "zkSync Era Bridge | Transfer funds between zkSync Era Network and Ethereum Mainnet",
      description:
        "With the zkSync Era Bridge you can easily transfer funds between Ethereum Mainnet and zkSync Era Network. Enjoy faster, cheaper and more efficient transactions with the future proof zkEVM scaling Ethereum's security and values.",
      previewImg: {
        src: "https://portal.zksync.io/preview-bridge.jpg",
        alt: "zkSync Bridge",
      },
    };

    // Replace <title> tag
    $("title").text(meta.title);

    // Replace meta tags
    $('meta[name="apple-mobile-web-app-title"]').attr("content", meta.title);
    $('meta[property="og:title"]').attr("content", meta.title);
    $('meta[property="og:site_name"]').attr("content", meta.title);
    $('meta[name="description"]').attr("content", meta.description);
    $('meta[property="og:description"]').attr("content", meta.description);
    $('meta[property="og:image:alt"]').attr("content", meta.previewImg.alt);
    $('meta[property="og:image"]').attr("content", meta.previewImg.alt);

    // Write the changes to the file
    fs.writeFile(filePath, $.html(), "utf8", function (err: any) {
      if (err) return console.log(err);
    });
  });
});

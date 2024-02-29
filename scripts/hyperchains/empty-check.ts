/* eslint-disable no-console */
import { readFileSync } from "fs";
import { join as pathJoin } from "path";

const configPath = pathJoin(__dirname, "../../hyperchains/config.json");
const chains = JSON.parse(readFileSync(configPath).toString());
if (!chains.length) {
  console.error("No networks found in hyperchains config file");
  console.error("refer to the instructions in /hyperchains/README.md");
  process.exit(1);
}

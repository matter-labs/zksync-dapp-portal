/* 
  This file will look for hyperchain coniguration files on the zksync-era repo and move them to the hyperchains folder
  for further processing
*/
import * as enquirer from "enquirer";
import { constants, copyFileSync, existsSync, readdirSync } from "fs";

import { hyperchainsPath, processHyperchainFiles } from "./generateHyperchainsConfig";

const getAvailableEnvsFromFiles = (rootPath: string): string[] => {
  const envs = new Set<string>();

  if (existsSync(`${rootPath}/etc/env`)) {
    readdirSync(`${rootPath}/etc/env`).forEach((file) => {
      if (!file.startsWith(".") && (file.endsWith(".env") || file.endsWith(".toml"))) {
        envs.add(file.replace(/\..*$/, ""));
      }
    });
    return Array.from(envs);
  }

  console.log("No env files available for provided path");
};

const migrateHyperchainInfo = async () => {
  console.log("Starting Hyperchain configuration setup");

  const args = process.argv;

  const rootPath = args[2];

  if (!rootPath) {
    console.log("Please provide the path to your zksync-era repo");
    return;
  }

  const envs: string[] = getAvailableEnvsFromFiles(rootPath);

  const envQuestions = [
    {
      message: "Which environment do you want to use?",
      name: "env",
      type: "select",
      choices: [...envs].sort(),
    },
  ];

  const envResults: { env: string } = await enquirer.prompt(envQuestions);

  copyFileSync(
    `${rootPath}/etc/env/${envResults.env}.env`,
    `${hyperchainsPath}/${envResults.env}.env`,
    constants.COPYFILE_FICLONE
  );
  try {
    copyFileSync(
      `${rootPath}/etc/tokens/${envResults.env}.json`,
      `${hyperchainsPath}/${envResults.env}.json`,
      constants.COPYFILE_FICLONE
    );
  } catch (e) {
    // No token file was created for this hyperchain
  }

  processHyperchainFiles();
};

migrateHyperchainInfo();

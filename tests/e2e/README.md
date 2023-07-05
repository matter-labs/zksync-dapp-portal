# The test solution for Portal v2 E2E testing

Based on Playwright.io/TypeScript/BDD

## Recommended E2E pre-test setup

Before the execution of the end-2-end tests there needs to install dependencies:

```bash
npm install
```

Make sure you have .env.local in your env: tests\e2e\src\support\.env.local

```
Create this file and use your wallets and private keys in this file for local debugging
```


After the above script would be finished, the "postinstall" script starts to download and extract appropriate version 
of MetaMask Chrome extension into the 'tests/e2e/src/support/extension' directory

## How to run E2E tests

--
all tests:
```bash
npx cucumber-js
```
or

```bash
npm run test:e2e
```

--
tests by specified tags (eg, @deposit): 
```bash
npx cucumber-js --tags @deposit   
```
## Variables

process.env.TARGET_ENV:
  set up the target URL environment for the test run. Default value is stage https://staging-portal.zksync.dev/
process.env.METAMASK_VERSION
  set up the version of using MetaMask Chrome Extension for reaching appropriate path "tests/e2e/src/support/extension/metamask-chrome-"+process.env.METAMASK_VERSION

## Reports
Reports are configured in Cucumber.mjs file and results after test runs might be gotten by the next one approaches: 

Cucumber reports:

- uncomment lines in cucumber.mjs file
   // "json:tests/e2e/reports/cucumber-report.json",
   // "html:tests/e2e/reports/report.html",

- run the script below
```bash
npm run test:report
```
Allure reports: 

It's working on CI/CD. The results are collected in allure-results folder. Every test run generate appropriate test result data in JSON format. 

## Tags 
Tags allow to separate the current feature scope to appropriate suits, eg:


@regression
@loginPage (includes @artifacts and @redirection)
@transactions (includes @deposit, @withdraw, @transfer)

--optional tags:
@nonAuthorized - logout from MM extension
@cancelLogin - authorized MM extension and click cancel during MM connection to the Portal
@incognito - run browser without extension

Tags should be pasted above the "Feature" or "Scenario" key-word. In some cases, it could be specified before the exact Scenario.

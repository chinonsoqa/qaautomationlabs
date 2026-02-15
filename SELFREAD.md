# Setting Up Allure Reports with GitHub Pages for Cypress

A step-by-step guide documenting how Allure reporting was integrated into this Cypress project and deployed to GitHub Pages via CI/CD.

## Table of Contents

1. [Overview](#1-overview)
2. [Install Allure Dependencies](#2-install-allure-dependencies)
3. [Configure Cypress for Allure](#3-configure-cypress-for-allure)
4. [Import Allure Commands in Support File](#4-import-allure-commands-in-support-file)
5. [Run Tests and Verify Allure Results](#5-run-tests-and-verify-allure-results)
6. [View Allure Reports Locally](#6-view-allure-reports-locally)
7. [Configure the CI Workflow](#7-configure-the-ci-workflow)
8. [Enable GitHub Pages in Repository Settings](#8-enable-github-pages-in-repository-settings)
9. [How It All Works Together](#9-how-it-all-works-together)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Overview

**Problem:** Allure generates interactive HTML reports, but they cannot be opened directly from the filesystem (`file://` protocol). The report uses AJAX to load JSON data, and browsers block these requests due to CORS security policies. Downloading the artifact from CI and double-clicking `index.html` results in a blank page or 404 errors.

**Solution:** Deploy the Allure report to GitHub Pages after every CI run. The report is served over HTTPS at a permanent URL, accessible to anyone with the link.

**Final result:** After every CI run, the latest Allure report is live at:
```
https://<username>.github.io/<repository>/
```

For this project: `https://chinonsoqa.github.io/qaautomationlabs/`

---

## 2. Install Allure Dependencies

From the project root, install the Allure Cypress integration and CLI:

```bash
npm install --save-dev allure-cypress allure-commandline
```

This installs:
- **allure-cypress** (`^2.15.1`) - The Cypress plugin that generates Allure result JSON files during test execution.
- **allure-commandline** (`^2.36.0`) - The CLI tool that converts raw JSON results into the HTML report. Requires Java to run.

The `allure-js-commons` package is also needed as a peer dependency:

```bash
npm install allure-js-commons
```

**Verify in `package.json`:**

```json
{
  "dependencies": {
    "allure-js-commons": "^2.15.1"
  },
  "devDependencies": {
    "allure-cypress": "^2.15.1",
    "allure-commandline": "^2.36.0"
  }
}
```

---

## 3. Configure Cypress for Allure

Edit `cypress.config.js` to register the Allure reporter plugin:

```js
const { defineConfig } = require("cypress");
const { allureCypress } = require("allure-cypress/reporter");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      allureCypress(on, {
        resultsDir: "allure-results",
      });
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.js',
    video: true
  }
});
```

**Key points:**
- Import `allureCypress` from `allure-cypress/reporter`.
- Call `allureCypress(on, { resultsDir: "allure-results" })` inside `setupNodeEvents`.
- The `resultsDir` option specifies where raw result JSON files are written. Defaults to `allure-results` in the project root.
- You must `return config` at the end of `setupNodeEvents`.

---

## 4. Import Allure Commands in Support File

Edit `cypress/support/e2e.js` to import Allure's custom Cypress commands:

```js
import "allure-cypress/commands";
```

This enables Allure-specific commands in your tests (e.g., attaching screenshots, adding labels). Without this import, Allure will still generate basic results, but advanced features like manual attachments will not work.

**Full `cypress/support/e2e.js`:**

```js
import './commands'
import "allure-cypress/commands";

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('Script error')) return false;
  if (err.message.includes('owlCarousel is not a function')) return false;
  return true;
});
```

---

## 5. Run Tests and Verify Allure Results

Run your tests:

```bash
npx cypress run
```

After the run completes, verify that the `allure-results/` directory was created and contains JSON files:

```
allure-results/
  <uuid>-result.json       # One per test case
  <uuid>-attachment.png     # Screenshots (if any)
  <uuid>-attachment.mp4     # Videos (if any)
```

Each `-result.json` file contains the test name, status (passed/failed/broken), duration, labels, and error details.

---

## 6. View Allure Reports Locally

**Important:** Allure CLI requires Java (JDK 8+) to be installed on your machine.

### Option A: Generate and open (two steps)

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

### Option B: Serve directly (one step)

```bash
npx allure serve allure-results
```

This generates a temporary report and opens it in your browser via a local HTTP server. This is the quickest way to view results locally.

### Why you cannot just open the HTML file

If you double-click `allure-report/index.html`, you will see:
- A blank page with "Loading..." that never finishes, or
- A "404 [object Object]" error on sub-pages like Categories

This happens because the browser blocks AJAX requests over the `file://` protocol. The report **must** be served over HTTP/HTTPS.

### Useful npm scripts (added to `package.json`)

```json
{
  "scripts": {
    "test:allure": "npx cypress run",
    "generate:allure": "allure generate allure-results --clean -o allure-report",
    "open:allure": "allure open allure-report",
    "report": "npm run test:allure && npm run generate:allure && npm run open:allure"
  }
}
```

Run `npm run report` to execute tests, generate the report, and open it in one command.

---

## 7. Configure the CI Workflow

This is the core of the GitHub Pages deployment. The workflow file is at `.github/workflows/ci.yml`.

### 7.1 Add write permissions

The workflow needs permission to push to the `gh-pages` branch:

```yaml
permissions:
  contents: write
```

Place this at the top level of the workflow (outside `jobs`).

### 7.2 Create the allure-results directory

In the setup step, ensure the output folder exists:

```yaml
- name: Create output folders
  run: |
    mkdir -p allure-results
```

### 7.3 Set up Java

Allure CLI requires Java. Add this step after tests run (with `if: always()` so it runs even if tests fail):

```yaml
- name: Setup Java for Allure
  if: always()
  uses: actions/setup-java@v4
  with:
    distribution: temurin
    java-version: 17
```

### 7.4 Install Allure CLI in CI

```yaml
- name: Install Allure CLI
  if: always()
  run: npm install -g allure-commandline
```

### 7.5 Fetch previous history (for trend charts)

Allure can display trend charts (pass/fail over time) if it has access to history from previous runs. The history is stored on the `gh-pages` branch alongside the report. Before generating a new report, fetch the old history and place it inside `allure-results/`:

```yaml
- name: Fetch Allure history from gh-pages
  if: always()
  run: |
    git fetch origin gh-pages --depth=1 || true
    if git rev-parse --verify origin/gh-pages > /dev/null 2>&1; then
      git checkout origin/gh-pages -- history/ 2>/dev/null && mv history allure-results/history || echo "No previous history found."
    else
      echo "gh-pages branch does not exist yet. Skipping history fetch."
    fi
```

**How this works:**
- On the first run, `gh-pages` doesn't exist yet, so the step is safely skipped.
- On subsequent runs, it pulls the `history/` folder from the previous report and injects it into `allure-results/history`.
- When `allure generate` runs, it reads this history and includes trend data in the new report.
- The generated report also outputs a new `history/` folder inside `allure-report/`, which gets deployed to `gh-pages` for the next run.

### 7.6 Generate the Allure report

```yaml
- name: Generate Allure report
  if: always()
  run: |
    if ls allure-results/*.json 1> /dev/null 2>&1; then
      echo "Allure results found. Generating report..."
      allure generate allure-results --clean -o allure-report
    else
      echo "No Allure results found. Skipping report generation."
    fi
```

### 7.7 Deploy to GitHub Pages

Use the `peaceiris/actions-gh-pages` action to push the report to the `gh-pages` branch:

```yaml
- name: Deploy Allure report to GitHub Pages
  if: always()
  uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: allure-report
    publish_branch: gh-pages
    keep_files: false
```

**Parameters explained:**
- `github_token` - The built-in `GITHUB_TOKEN` secret. No manual secret creation needed.
- `publish_dir` - The local directory containing the generated report.
- `publish_branch` - The branch that GitHub Pages will serve from. Created automatically if it doesn't exist.
- `keep_files: false` - Replaces the entire branch content with the new report each time.

### 7.8 Complete CI steps for Allure (in order)

Here are all the Allure-related steps together for reference:

```yaml
# --- After Cypress tests run ---

- name: Setup Java for Allure
  if: always()
  uses: actions/setup-java@v4
  with:
    distribution: temurin
    java-version: 17

- name: Install Allure CLI
  if: always()
  run: npm install -g allure-commandline

- name: Fetch Allure history from gh-pages
  if: always()
  run: |
    git fetch origin gh-pages --depth=1 || true
    if git rev-parse --verify origin/gh-pages > /dev/null 2>&1; then
      git checkout origin/gh-pages -- history/ 2>/dev/null && mv history allure-results/history || echo "No previous history found."
    else
      echo "gh-pages branch does not exist yet. Skipping history fetch."
    fi

- name: Generate Allure report
  if: always()
  run: |
    if ls allure-results/*.json 1> /dev/null 2>&1; then
      echo "Allure results found. Generating report..."
      allure generate allure-results --clean -o allure-report
    else
      echo "No Allure results found. Skipping report generation."
    fi

# --- After uploading artifacts ---

- name: Deploy Allure report to GitHub Pages
  if: always()
  uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: allure-report
    publish_branch: gh-pages
    keep_files: false
```

---

## 8. Enable GitHub Pages in Repository Settings

After the first CI run creates the `gh-pages` branch, you must enable GitHub Pages in your repository:

1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Pages** (in the left sidebar under "Code and automation").
3. Under **Source**, select **Deploy from a branch**.
4. Under **Branch**, select `gh-pages` and `/ (root)`.
5. Click **Save**.

GitHub will take a few minutes to publish the site. Once ready, the report will be available at:

```
https://<username>.github.io/<repository>/
```

You only need to do this once. All subsequent CI runs will automatically update the report.

---

## 9. How It All Works Together

Here is the end-to-end flow:

```
1. Push code to github-actions branch (or cron/manual trigger)
         |
2. GitHub Actions runs Cypress tests
         |
3. allure-cypress plugin writes JSON results to allure-results/
         |
4. CI fetches previous history from gh-pages branch
         |
5. CI runs: allure generate allure-results --clean -o allure-report
         |
6. peaceiris/actions-gh-pages pushes allure-report/ to gh-pages branch
         |
7. GitHub Pages serves the report at https://<user>.github.io/<repo>/
         |
8. Email notification is sent with the report link
```

**On every CI run:**
- The `allure-results/` directory is populated fresh by Cypress.
- The previous run's `history/` folder is fetched from `gh-pages` and injected into `allure-results/`.
- `allure generate` reads both the new results and the old history, producing a complete report with trend charts.
- The report is deployed, replacing the previous version on GitHub Pages.
- The report's `history/` folder is preserved on `gh-pages` for the next run.

---

## 10. Troubleshooting

### Report shows "Loading..." or "404 [object Object]"

You are opening `index.html` directly via `file://`. Allure reports must be served over HTTP. Use `allure open` or `allure serve`, or view the GitHub Pages URL.

### Report is generated but shows 0 tests

- Verify `allure-results/` contains `-result.json` files.
- Ensure `allure generate` is pointing to the correct directory.
- In CI, check that `allure-results/` is created before tests run (`mkdir -p allure-results`).

### "JAVA_HOME is not set" error

Allure CLI requires Java. Install Java locally or ensure the CI workflow includes `actions/setup-java@v4`.

### gh-pages branch exists but GitHub Pages shows the README

- Go to **Settings > Pages** and verify the source is set to `gh-pages` / `/ (root)`.
- Wait a few minutes for GitHub to build the site.
- Hard refresh the page (Ctrl+Shift+R).

### Trend charts are empty

Trend data requires history from previous runs. The first run will have no trends. After two or more runs, the "Fetch Allure history from gh-pages" step pulls the history forward, and trends will appear.

### Deploy step fails with permission error

Ensure the workflow has `permissions: contents: write` at the top level. The `GITHUB_TOKEN` needs write access to push to the `gh-pages` branch.

---

## References

- [Allure Cypress Documentation](https://allurereport.org/docs/cypress/)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [actions/setup-java](https://github.com/actions/setup-java)

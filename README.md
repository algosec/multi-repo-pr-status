# Multi-repo PR Status

![CI/CD](https://github.com/algosec/multi-repo-pr-status/actions/workflows/CICD.yml/badge.svg)

Ever worked on a multi-repo projects and got dizzy (:woozy_face:) looking for PRs from different repositories that are related to the same logical change?

This project purpose is to solve this by aggregating pull-requests status for multi-repo projects with easy filters and bulk operations.\
Pull-requests are aggregated by `source branch -> destination branch`.

:star: Open the [application](https://algosec.github.io/multi-repo-pr-status) and start using it now - just provide the credentials to BitBucket :star:

# Development
This project is a **client-side** only application written with **React** that fetches the pull-requests information from the popular GIT host providers.  

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000/multi-repo-pr-status](http://localhost:3000/multi-repo-pr-status) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

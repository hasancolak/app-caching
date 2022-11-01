# Instructions

## Background

Assume a website is hosted on a number of servers. When a user loads the website, the request is equally likely to be served by one of these servers. For this task let's focus on the HTML response that these servers deliver.

We have identified a performance issue with the stack.

- The HTML pages all contain links to the same JavaScript and CSS files that are versioned to make them cacheable forever (i.e. if one file changes, it is linked in the HTML with a new version).
- To version the JS and CSS each server appends the timestamp of the deployment as a version.
- Because these servers are not deployed in the same second, they end up linking different JS and CSS URLs even though these files have the same content.

The performance issue is;

- A user loads the page for the first time and gets the response from server A. Before rendering the page, the browser has to load the JS and CSS linked in that response and place them in the cache.
- When navigating to the next page, the user gets a response from server B. Instead of using the already cached JS and CSS files, the browser has to load new ones before it can render the page because the response from server B linked to different URLs (with the same content).

For the avoidance of doubt:

- There is more than one page on the website, so the servers are serving multiple HTML files
- All HTML files from the same server are linking the same JS and CSS files and versions
- Since the version string on the JS and CSS files is the deployment timestamp, JS and CSS in the same HTML always have the same version string.

### The Problem

Assume we want to deploy a cache for those HTML pages in front of those servers and would like to solve the performance issue that we have identified.

Our cache works like this:

- If we receive a request from a user and do not have the HTML in our cache (cache miss), we will request it from the original servers. This request will hit one of the servers, we do not know which and we cannot target a specific one.
- If there is a deployment on the original server we assume that our cache gets purged afterwards, so we start with an empty cache and thus we will load the new content because we have cache misses.
- We are only implementing the caching solution, we cannot change the logic on those servers.

## Available Scripts

### `npm install`

To install npm packages

### `npm start`

Runs the app.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

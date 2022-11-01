const axios = require("axios");
const NodeCache = require("node-cache");
const express = require("express");
const app = express();

// Create cache instance for infinity usage with 0 param
const cache = new NodeCache({ stdTTL: 0 });

// Application servers
const servers = ["http://localhost:3001", "http://localhost:3002"];

//
/**
 * @function versionReplacement is replacement function for version of files
 * @param {*} str
 * @returns string
 */
const versionReplacement = (str) => {
  var pattern = /(\?v=)(\d*){13}/gi;
  return str.replaceAll(pattern, "?v=" + Date.now());
};

/**
 * @function preprocessHTML regex the html string
 * @param {*} htmlAsString
 * @returns replaced versions of asetts path
 */
function preprocessHTML(htmlAsString) {
  return versionReplacement(htmlAsString);
}

/**
 * @function verifyCache is a function controling the requested page is in the cache or not
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const verifyCache = (req, res, next) => {
  try {
    const key = "__path__" + req.url;
    if (cache.has(key)) {
      return res.send(cache.get(key));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * @function handler is a request handler  function
 * @param {*} req
 * @param {*} res
 */
const handler = async (req, res) => {
  // Destructure following properties from request object
  const { method, url, headers, body } = req;

  // Select the current server to forward the request
  const cur = Math.random() < 0.5 ? 0 : 1;
  const server = servers[cur];

  try {
    // Requesting to underlying application server
    const response = await axios({
      url: `${server}${url}`,
      method: method,
      headers: headers,
      data: body,
    });

    // Send back the response data
    // from application server to client
    const html = preprocessHTML(response.data);

    // Cache the html for next request
    cache.set("__path__" + req.url, html);

    res.set("content-type", "text/html");
    res.set("Cache-Control", "public, max-age=31536000");
    res.send(html);
  } catch (err) {
    // Send back the error message
    res.status(500).send(err);
  }
};

// Request for the page types
app.get("/", verifyCache, handler);

// Request for js and css file types.
app.get("*.js|*.css", async (req, res) => {
  const cur = Math.random() < 0.5 ? 0 : 1;
  const { data } = await axios({
    url: servers[cur] + req.url,
    responseType: "stream",
  });
  res.set("Cache-Control", "public, max-age=31536000");
  data.pipe(res);
});

// Create and listen app using specified port.
app.listen(3000, (err) => {
  err
    ? console.log("Failed to listen on PORT 3000")
    : console.log("Load Balancer and Cache Server " + "listening on PORT 3000");
});

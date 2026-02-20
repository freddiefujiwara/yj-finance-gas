/**
 * Handles GET requests to the web app.
 * Fetches the HTML content of a given URL.
 *
 * @param {Object} e The event object from GAS.
 * @param {Object} e.parameter Query parameters.
 * @param {string} e.parameter.u The target URL to fetch.
 * @returns {GoogleAppsScript.Content.TextOutput} JSON response.
 */
function doGet(e) {
  const result = {
    url: null,
    content: null,
    error: null
  };

  try {
    // 1. Get URL from query parameter 'u'
    const url = e && e.parameter && e.parameter.u;
    if (!url) {
      throw new Error('Missing required parameter: u');
    }
    result.url = url;

    // 2. Validate URL format
    if (!/^https?:\/\/.+/.test(url)) {
      throw new Error('Invalid URL format. Must start with http:// or https://');
    }

    // 3. Fetch data from the provided URL
    const fetchResponse = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true
    });

    // 4. Check response status
    const responseCode = fetchResponse.getResponseCode();
    if (responseCode !== 200) {
      throw new Error('Target URL returned HTTP ' + responseCode);
    }

    // 5. Set the content
    result.content = fetchResponse.getContentText();
  } catch (error) {
    // 6. Handle errors
    result.error = error.toString();
  }

  // 7. Return structured JSON response
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// Export for testing in Node.js environment
if (typeof exports !== 'undefined') {
  exports.doGet = doGet;
}

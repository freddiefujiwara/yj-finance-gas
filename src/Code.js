/**
 * Handles GET requests to the web app.
 * Fetches the HTML content of a Yahoo Finance JP quote page for a given symbol.
 *
 * @param {Object} e The event object from GAS.
 * @param {Object} e.parameter Query parameters.
 * @param {string} e.parameter.s The ticker symbol.
 * @returns {GoogleAppsScript.Content.TextOutput} JSON response.
 */
function doGet(e) {
  const result = {
    symbol: null,
    content: null,
    error: null
  };

  try {
    // 1. Get symbol from query parameter 's'
    const symbol = e && e.parameter && e.parameter.s;
    if (!symbol) {
      throw new Error('Missing required parameter: s');
    }
    result.symbol = symbol;

    // 2. Fetch data from Yahoo Finance JP
    const url = 'https://finance.yahoo.co.jp/quote/' + encodeURIComponent(symbol);
    const fetchResponse = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true
    });

    // 3. Check response status
    const responseCode = fetchResponse.getResponseCode();
    if (responseCode !== 200) {
      throw new Error('Yahoo Finance returned HTTP ' + responseCode);
    }

    // 4. Set the content
    result.content = fetchResponse.getContentText();
  } catch (error) {
    // 5. Handle errors
    result.error = error.toString();
  }

  // 6. Return structured JSON response
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// Export for testing in Node.js environment
if (typeof exports !== 'undefined') {
  exports.doGet = doGet;
}

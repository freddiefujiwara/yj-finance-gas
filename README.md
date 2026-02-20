# Yahoo Finance JP Fetcher API (GAS)

This is a Google Apps Script (GAS) web application that fetches the HTML content of a ticker symbol's page from Yahoo Finance Japan.

## Features

- Fetches HTML content from `https://finance.yahoo.co.jp/quote/{{SYMBOL}}`.
- Returns a structured JSON response.
- Handles missing parameters, network errors, and non-200 HTTP status codes.

## Usage

Once deployed as a Web App, you can access it via a GET request:

`GET https://script.google.com/macros/s/AKfycbx6iFGnB5EaSVedN5mk8F1L0iO9orwZZiOz_2m6wIRzHA1XsU555ib0Ex2LMCR1nLOvhw/exec?s=4755.T`

### Query Parameters

- `s` (required): The ticker symbol (e.g., `4755.T` for Rakuten).

### Response Format

#### Success (200 OK)

```json
{
  "symbol": "4755.T",
  "content": "<html>...</html>",
  "error": null
}
```

#### Error

```json
{
  "symbol": null,
  "content": null,
  "error": "Error: Missing required parameter: s"
}
```

## Development

### Prerequisites

- Node.js
- npm

### Setup

```bash
npm install
```

### Testing

Run tests using Vitest:

```bash
npm test
```

## Code Explanation

- `doGet(e)`: The entry point for GET requests.
- `UrlFetchApp`: Used to fetch external data from Yahoo Finance.
- `ContentService`: Used to return the response as a JSON string with the correct MIME type.
- Error handling: Uses `try...catch` to capture any issues and return them in the `error` field of the response.

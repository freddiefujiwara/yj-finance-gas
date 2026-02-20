# General Purpose URL Fetcher API (GAS)

This is a Google Apps Script (GAS) web application that fetches the content of any provided URL.

## Features

- Fetches content from any HTTP/HTTPS URL.
- Returns a structured JSON response.
- Validates URL format and handles fetch errors.

## Usage

Once deployed as a Web App, you can access it via a GET request:

`GET https://script.google.com/macros/s/AKfycbx6iFGnB5EaSVedN5mk8F1L0iO9orwZZiOz_2m6wIRzHA1XsU555ib0Ex2LMCR1nLOvhw/exec?u=https://example.com`

### Query Parameters

- `u` (required): The target URL to fetch (must start with `http://` or `https://`).

### Response Format

#### Success (200 OK)

```json
{
  "url": "https://example.com",
  "content": "<html>...</html>",
  "error": null
}
```

#### Error

```json
{
  "url": null,
  "content": null,
  "error": "Error: Missing required parameter: u"
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
- URL Validation: Ensures the `u` parameter is present and correctly formatted.
- `UrlFetchApp`: Used to fetch external data.
- `ContentService`: Used to return the response as a JSON string with the correct MIME type.

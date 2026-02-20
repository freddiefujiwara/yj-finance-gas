import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Code from '../src/Code.js';

describe('Code.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clean up globals
    delete global.UrlFetchApp;
    delete global.ContentService;
  });

  describe('doGet', () => {
    it('should return 200 and content when valid URL is provided', () => {
      const targetUrl = 'https://example.com';
      // Mock UrlFetchApp
      const mockFetchResponse = {
        getResponseCode: vi.fn().mockReturnValue(200),
        getContentText: vi.fn().mockReturnValue('<html><body>Example</body></html>')
      };
      global.UrlFetchApp = {
        fetch: vi.fn().mockReturnValue(mockFetchResponse)
      };

      // Mock ContentService
      const mockTextOutput = {
        setMimeType: vi.fn().mockReturnThis()
      };
      global.ContentService = {
        createTextOutput: vi.fn().mockReturnValue(mockTextOutput),
        MimeType: { JSON: 'application/json' }
      };

      const e = {
        parameter: { u: targetUrl }
      };

      Code.doGet(e);

      expect(global.UrlFetchApp.fetch).toHaveBeenCalledWith(
        targetUrl,
        { muteHttpExceptions: true }
      );

      const jsonResponse = JSON.parse(global.ContentService.createTextOutput.mock.calls[0][0]);
      expect(jsonResponse.url).toBe(targetUrl);
      expect(jsonResponse.content).toBe('<html><body>Example</body></html>');
      expect(jsonResponse.error).toBeNull();
    });

    it('should return error when u parameter is missing', () => {
      global.ContentService = {
        createTextOutput: vi.fn().mockReturnValue({ setMimeType: vi.fn() }),
        MimeType: { JSON: 'application/json' }
      };

      const e = { parameter: {} };
      Code.doGet(e);

      const jsonResponse = JSON.parse(global.ContentService.createTextOutput.mock.calls[0][0]);
      expect(jsonResponse.error).toContain('Error: Missing required parameter: u');
    });

    it('should return error when URL format is invalid', () => {
      global.ContentService = {
        createTextOutput: vi.fn().mockReturnValue({ setMimeType: vi.fn() }),
        MimeType: { JSON: 'application/json' }
      };

      const e = { parameter: { u: 'ftp://invalid.com' } };
      Code.doGet(e);

      const jsonResponse = JSON.parse(global.ContentService.createTextOutput.mock.calls[0][0]);
      expect(jsonResponse.error).toContain('Error: Invalid URL format');
    });

    it('should return error when target URL returns non-200 status', () => {
      const targetUrl = 'https://example.com/404';
      global.UrlFetchApp = {
        fetch: vi.fn().mockReturnValue({
          getResponseCode: vi.fn().mockReturnValue(404),
          getContentText: vi.fn().mockReturnValue('Not Found')
        })
      };
      global.ContentService = {
        createTextOutput: vi.fn().mockReturnValue({ setMimeType: vi.fn() }),
        MimeType: { JSON: 'application/json' }
      };

      const e = { parameter: { u: targetUrl } };
      Code.doGet(e);

      const jsonResponse = JSON.parse(global.ContentService.createTextOutput.mock.calls[0][0]);
      expect(jsonResponse.error).toContain('Error: Target URL returned HTTP 404');
    });

    it('should catch unexpected exceptions', () => {
      global.UrlFetchApp = {
        fetch: vi.fn().mockImplementation(() => {
          throw new Error('Network failure');
        })
      };
      global.ContentService = {
        createTextOutput: vi.fn().mockReturnValue({ setMimeType: vi.fn() }),
        MimeType: { JSON: 'application/json' }
      };

      const e = { parameter: { u: 'https://example.com' } };
      Code.doGet(e);

      const jsonResponse = JSON.parse(global.ContentService.createTextOutput.mock.calls[0][0]);
      expect(jsonResponse.error).toContain('Error: Network failure');
    });

    it('should handle undefined event object', () => {
      global.ContentService = {
        createTextOutput: vi.fn().mockReturnValue({ setMimeType: vi.fn() }),
        MimeType: { JSON: 'application/json' }
      };

      Code.doGet(undefined);

      const jsonResponse = JSON.parse(global.ContentService.createTextOutput.mock.calls[0][0]);
      expect(jsonResponse.error).toContain('Error: Missing required parameter: u');
    });
  });
});

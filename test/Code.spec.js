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
    it('should return 200 and content when valid symbol is provided', () => {
      // Mock UrlFetchApp
      const mockFetchResponse = {
        getResponseCode: vi.fn().mockReturnValue(200),
        getContentText: vi.fn().mockReturnValue('<html><body>Yahoo Finance Data</body></html>')
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
        parameter: { s: '4755.T' }
      };

      const result = Code.doGet(e);

      expect(global.UrlFetchApp.fetch).toHaveBeenCalledWith(
        'https://finance.yahoo.co.jp/quote/4755.T',
        { muteHttpExceptions: true }
      );
      expect(global.ContentService.createTextOutput).toHaveBeenCalled();

      const jsonResponse = JSON.parse(global.ContentService.createTextOutput.mock.calls[0][0]);
      expect(jsonResponse.symbol).toBe('4755.T');
      expect(jsonResponse.content).toBe('<html><body>Yahoo Finance Data</body></html>');
      expect(jsonResponse.error).toBeNull();
      expect(mockTextOutput.setMimeType).toHaveBeenCalledWith('application/json');
    });

    it('should return error when symbol is missing', () => {
      // Mock ContentService
      const mockTextOutput = {
        setMimeType: vi.fn().mockReturnThis()
      };
      global.ContentService = {
        createTextOutput: vi.fn().mockReturnValue(mockTextOutput),
        MimeType: { JSON: 'application/json' }
      };

      const e = { parameter: {} };
      Code.doGet(e);

      const jsonResponse = JSON.parse(global.ContentService.createTextOutput.mock.calls[0][0]);
      expect(jsonResponse.error).toContain('Error: Missing required parameter: s');
    });

    it('should return error when Yahoo Finance returns non-200 status', () => {
      // Mock UrlFetchApp
      const mockFetchResponse = {
        getResponseCode: vi.fn().mockReturnValue(404),
        getContentText: vi.fn().mockReturnValue('Not Found')
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

      const e = { parameter: { s: 'INVALID' } };
      Code.doGet(e);

      const jsonResponse = JSON.parse(global.ContentService.createTextOutput.mock.calls[0][0]);
      expect(jsonResponse.error).toContain('Error: Yahoo Finance returned HTTP 404');
    });

    it('should catch unexpected exceptions', () => {
      // Mock UrlFetchApp to throw
      global.UrlFetchApp = {
        fetch: vi.fn().mockImplementation(() => {
          throw new Error('Network failure');
        })
      };

      // Mock ContentService
      const mockTextOutput = {
        setMimeType: vi.fn().mockReturnThis()
      };
      global.ContentService = {
        createTextOutput: vi.fn().mockReturnValue(mockTextOutput),
        MimeType: { JSON: 'application/json' }
      };

      const e = { parameter: { s: '4755.T' } };
      Code.doGet(e);

      const jsonResponse = JSON.parse(global.ContentService.createTextOutput.mock.calls[0][0]);
      expect(jsonResponse.error).toContain('Error: Network failure');
    });

    it('should handle case when e is undefined', () => {
       // Mock ContentService
       const mockTextOutput = {
         setMimeType: vi.fn().mockReturnThis()
       };
       global.ContentService = {
         createTextOutput: vi.fn().mockReturnValue(mockTextOutput),
         MimeType: { JSON: 'application/json' }
       };

       Code.doGet(undefined);

       const jsonResponse = JSON.parse(global.ContentService.createTextOutput.mock.calls[0][0]);
       expect(jsonResponse.error).toContain('Error: Missing required parameter: s');
    });
  });
});

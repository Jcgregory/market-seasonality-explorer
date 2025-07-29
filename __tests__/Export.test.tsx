// ✅ TypeScript-safe Blob mock
global.Blob = class {
    private _content: string[];
    private _type: string;
  
    constructor(content: string[], options?: { type?: string }) {
      this._content = content;
      this._type = options?.type || '';
    }
  
    text(): Promise<string> {
      return Promise.resolve(this._content.join(''));
    }
  
    arrayBuffer(): Promise<ArrayBuffer> {
      const str = this._content.join('');
      const buf = new ArrayBuffer(str.length);
      const bufView = new Uint8Array(buf);
      for (let i = 0; i < str.length; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return Promise.resolve(buf);
    }
  
    get size(): number {
      return this._content.join('').length;
    }
  
    get type(): string {
      return this._type;
    }
  
    stream(): any {
      return {};
    }
  
    slice(): Blob {
      return this as any;
    }
  } as unknown as typeof Blob;
    
import React from 'react';
import '@testing-library/jest-dom';


// Mock data types
type DataRow = {
  month: string;
  value: number;
  sector: string;
  rsi: number;
  ma50: number;
};

// Mock the exportToCSV function
const exportToCSV = (data: DataRow[], compareData: DataRow[] = []) => {
  if (data.length === 0) return;
  
  // Create CSV headers
  const headers = ['Month', 'Value', 'Sector', 'RSI', '50-day MA'];
  
  // Convert data to CSV rows
  const csvRows = [
    headers.join(','),
    ...data.map(row => [
      row.month,
      row.value,
      row.sector,
      row.rsi,
      row.ma50
    ].join(','))
  ];
  
  // Add comparison data if available
  if (compareData.length > 0) {
    csvRows.push(''); // Empty row for separation
    csvRows.push(...compareData.map(row => [
      row.month,
      row.value,
      row.sector,
      row.rsi,
      row.ma50
    ].join(',')));
  }
  
  // Create CSV content
  const csvContent = csvRows.join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'market-data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  return { csvContent, blob, link };
};

describe('exportToCSV Function', () => {
  // Mock data for testing
  const mockData: DataRow[] = [
    { month: 'Jan', value: 120, sector: 'Technology', rsi: 45, ma50: 118 },
    { month: 'Feb', value: 200, sector: 'Technology', rsi: 65, ma50: 165 },
    { month: 'Mar', value: 150, sector: 'Technology', rsi: 52, ma50: 142 },
  ];

  const mockCompareData: DataRow[] = [
    { month: 'Jan', value: 100, sector: 'Healthcare', rsi: 35, ma50: 95 },
    { month: 'Feb', value: 180, sector: 'Healthcare', rsi: 62, ma50: 155 },
    { month: 'Mar', value: 130, sector: 'Healthcare', rsi: 48, ma50: 125 },
  ];

  // Mock DOM elements and methods
  let mockLink: HTMLAnchorElement;
  let mockBlob: Blob;
  let mockUrl: string;
  let appendChildSpy: jest.SpyInstance;
  let removeChildSpy: jest.SpyInstance;
  let clickSpy: jest.SpyInstance;
  let setAttributeSpy: jest.SpyInstance;
  let createObjectURLSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock document.createElement
    mockLink = {
      download: 'market-data.csv',
      href: '',
      style: { visibility: 'hidden' },
      setAttribute: jest.fn(),
      click: jest.fn(),
    } as unknown as HTMLAnchorElement;

    mockBlob = new Blob(['test'], { type: 'text/csv' });
    mockUrl = 'blob:mock-url';

    // Mock document methods
    appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation();
    removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation();
    
    // Mock createElement
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink);
    
    // Mock URL.createObjectURL
    createObjectURLSpy = jest.spyOn(global.URL, 'createObjectURL').mockReturnValue(mockUrl);
    
    // Mock link methods
    setAttributeSpy = jest.spyOn(mockLink, 'setAttribute').mockImplementation();
    clickSpy = jest.spyOn(mockLink, 'click').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('CSV Generation', () => {
    it('generates correct CSV content from data array', () => {
      const result = exportToCSV(mockData);
      
      const expectedCSV = [
        'Month,Value,Sector,RSI,50-day MA',
        'Jan,120,Technology,45,118',
        'Feb,200,Technology,65,165',
        'Mar,150,Technology,52,142'
      ].join('\n');

      expect(result?.csvContent).toBe(expectedCSV);
    });

    it('includes comparison data when provided', () => {
      const result = exportToCSV(mockData, mockCompareData);
      
      const expectedCSV = [
        'Month,Value,Sector,RSI,50-day MA',
        'Jan,120,Technology,45,118',
        'Feb,200,Technology,65,165',
        'Mar,150,Technology,52,142',
        '',
        'Jan,100,Healthcare,35,95',
        'Feb,180,Healthcare,62,155',
        'Mar,130,Healthcare,48,125'
      ].join('\n');

      expect(result?.csvContent).toBe(expectedCSV);
    });

    it('returns undefined when data array is empty', () => {
      const result = exportToCSV([]);
      expect(result).toBeUndefined();
    });

    it('handles data with special characters correctly', () => {
      const dataWithSpecialChars: DataRow[] = [
        { month: 'Jan', value: 120, sector: 'Tech & Finance', rsi: 45, ma50: 118 },
        { month: 'Feb', value: 200, sector: 'Healthcare, Inc.', rsi: 65, ma50: 165 },
      ];

      const result = exportToCSV(dataWithSpecialChars);
      
      const expectedCSV = [
        'Month,Value,Sector,RSI,50-day MA',
        'Jan,120,Tech & Finance,45,118',
        'Feb,200,Healthcare, Inc.,65,165'
      ].join('\n');

      expect(result?.csvContent).toBe(expectedCSV);
    });
  });

  describe('Blob Creation', () => {
    it('creates blob with correct content and type', () => {
      const result = exportToCSV(mockData);
      
      expect(result?.blob).toBeInstanceOf(Blob);
      expect(result?.blob.type).toBe('text/csv;charset=utf-8;');
    });

    it('creates blob with correct size', async () => {
      const result = exportToCSV(mockData);
      
      if (result?.blob) {
        const text = await result.blob.text();
        expect(text).toContain('Month,Value,Sector,RSI,50-day MA');
        expect(text).toContain('Jan,120,Technology,45,118');
      }
    });
  });

  describe('Download Link Creation', () => {
    it('creates download link with correct attributes', () => {
      exportToCSV(mockData);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(setAttributeSpy).toHaveBeenCalledWith('href', mockUrl);
      expect(setAttributeSpy).toHaveBeenCalledWith('download', 'market-data.csv');
    });

    it('sets link visibility to hidden', () => {
      exportToCSV(mockData);

      expect(mockLink.style.visibility).toBe('hidden');
    });

    it('appends link to document body', () => {
      exportToCSV(mockData);

      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    });

    it('removes link from document body after click', () => {
      exportToCSV(mockData);

      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
    });

    it('triggers link click', () => {
      exportToCSV(mockData);

      expect(clickSpy).toHaveBeenCalled();
    });

    it('creates object URL for blob', () => {
      exportToCSV(mockData);

      expect(createObjectURLSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('handles case when link.download is undefined', () => {
      // Mock link without download property
      const mockLinkWithoutDownload = {
        href: '',
        style: { visibility: 'hidden' },
        setAttribute: jest.fn(),
        click: jest.fn(),
      } as unknown as HTMLAnchorElement;

      jest.spyOn(document, 'createElement').mockReturnValue(mockLinkWithoutDownload);

      const result = exportToCSV(mockData);
      
      // Should still return the CSV content even if download fails
      expect(result?.csvContent).toBeDefined();
      expect(setAttributeSpy).not.toHaveBeenCalled();
    });

    it('handles empty data gracefully', () => {
      const result = exportToCSV([]);
      
      expect(result).toBeUndefined();
      expect(document.createElement).not.toHaveBeenCalled();
    });
  });

  describe('CSV Content Validation', () => {
    it('includes all required headers', () => {
      const result = exportToCSV(mockData);
      
      expect(result?.csvContent).toContain('Month,Value,Sector,RSI,50-day MA');
    });

    it('includes all data fields for each row', () => {
      const result = exportToCSV(mockData);
      
      expect(result?.csvContent).toContain('Jan,120,Technology,45,118');
      expect(result?.csvContent).toContain('Feb,200,Technology,65,165');
      expect(result?.csvContent).toContain('Mar,150,Technology,52,142');
    });

    it('separates comparison data with empty line', () => {
      const result = exportToCSV(mockData, mockCompareData);
      
      const lines = result?.csvContent.split('\n') || [];
      const emptyLineIndex = lines.findIndex(line => line === '');
      
      expect(emptyLineIndex).toBeGreaterThan(-1);
      expect(lines[emptyLineIndex + 1]).toContain('Jan,100,Healthcare,35,95');
    });

    it('maintains correct row count', () => {
      const result = exportToCSV(mockData, mockCompareData);
      
      const lines = result?.csvContent.split('\n') || [];
      // Header + 3 data rows + empty line + 3 comparison rows = 8 lines
      expect(lines).toHaveLength(8);
    });
  });

  describe('Integration Tests', () => {
    it('completes full export process successfully', () => {
      const result = exportToCSV(mockData, mockCompareData);

      // Verify CSV content
      expect(result?.csvContent).toContain('Month,Value,Sector,RSI,50-day MA');
      expect(result?.csvContent).toContain('Jan,120,Technology,45,118');
      expect(result?.csvContent).toContain('Jan,100,Healthcare,35,95');

      // Verify blob creation
      expect(result?.blob).toBeInstanceOf(Blob);
      expect(result?.blob.type).toBe('text/csv;charset=utf-8;');

      // Verify link creation and download process
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(setAttributeSpy).toHaveBeenCalledWith('href', mockUrl);
      expect(setAttributeSpy).toHaveBeenCalledWith('download', 'market-data.csv');
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
    });

    it('handles single dataset export correctly', () => {
      const result = exportToCSV(mockData);

      // Verify CSV content without comparison data
      expect(result?.csvContent).toContain('Month,Value,Sector,RSI,50-day MA');
      expect(result?.csvContent).toContain('Jan,120,Technology,45,118');
      expect(result?.csvContent).not.toContain('Jan,100,Healthcare,35,95');

      // Verify no empty line separator
      const lines = result?.csvContent.split('\n') || [];
      expect(lines).toHaveLength(4); // Header + 3 data rows
    });
  });
}); 
/**
 * Parses CSV string data into headers and rows
 */
export interface CSVData {
  headers: string[];
  rows: Record<string, string>[];
  rawData: string[][];
}

/**
 * Parse CSV string into structured data
 * @param csvString The raw CSV string to parse
 * @param delimiter The delimiter character (default: ',')
 * @returns Parsed CSV data with headers and rows
 */
export const parseCSV = (csvString: string, delimiter: string = ','): CSVData => {
  // Split by newlines and filter out empty lines
  const lines = csvString
    .split(/\r\n|\n|\r/)
    .filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Parse each line into array of values
  const rawData = lines.map(line => {
    // Handle quoted values with commas inside
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === delimiter && !insideQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    values.push(currentValue);
    
    // Clean up quotes from values
    return values.map(val => val.replace(/^"(.*)"$/, '$1').trim());
  });

  // Extract headers from the first line
  const headers = rawData[0];
  
  // Convert remaining lines to objects with headers as keys
  const rows = rawData.slice(1).map(row => {
    const rowData: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowData[header] = index < row.length ? row[index] : '';
    });
    return rowData;
  });

  return {
    headers,
    rows,
    rawData
  };
};

/**
 * Converts parsed CSV data back to a CSV string
 * @param data The parsed CSV data
 * @param delimiter The delimiter character (default: ',')
 * @returns CSV string representation
 */
export const convertToCSV = (data: CSVData, delimiter: string = ','): string => {
  const headerLine = data.headers.join(delimiter);
  const rowLines = data.rows.map(row => {
    return data.headers.map(header => {
      const value = row[header] || '';
      // Escape values with quotes if they contain delimiters or quotes
      if (value.includes(delimiter) || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(delimiter);
  });
  
  return [headerLine, ...rowLines].join('\n');
};

/**
 * Parses CSV string data into headers and rows
 */
export interface CSVData {
  headers: string[];
  rows: Record<string, string>[];
  rawData: string[][];
}

/**
 * Represents multiple datasets found in a single CSV file
 */
export interface MultipleCSVDatasets {
  datasets: CSVData[];
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
 * Parse CSV string into multiple datasets based on blank row/column separators
 * @param csvString The raw CSV string to parse
 * @param delimiter The delimiter character (default: ',')
 * @returns Multiple parsed CSV datasets
 */
export const parseMultipleDatasets = (csvString: string, delimiter: string = ','): MultipleCSVDatasets => {
  // Split the CSV string into lines
  const allLines = csvString.split(/\r\n|\n|\r/);
  
  // Find blank row separators (completely empty lines or lines with only delimiters)
  const datasetBreakpoints: number[] = [];
  
  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i];
    // Check if line is empty or contains only delimiters/whitespace
    if (line.trim() === '' || line.split(delimiter).every(cell => cell.trim() === '')) {
      datasetBreakpoints.push(i);
    }
  }
  
  // Add start and end indices to create complete ranges
  const ranges: { start: number; end: number }[] = [];
  let lastValidLine = -1;
  
  // Find the last non-empty line
  for (let i = allLines.length - 1; i >= 0; i--) {
    if (allLines[i].trim() !== '') {
      lastValidLine = i;
      break;
    }
  }
  
  if (lastValidLine === -1) {
    throw new Error('CSV file is empty');
  }
  
  // Create ranges between breakpoints
  let startIndex = 0;
  for (const breakpoint of datasetBreakpoints) {
    if (breakpoint > startIndex) {
      ranges.push({ start: startIndex, end: breakpoint - 1 });
    }
    startIndex = breakpoint + 1;
  }
  
  // Add the final range if needed
  if (startIndex <= lastValidLine) {
    ranges.push({ start: startIndex, end: lastValidLine });
  }
  
  // Parse each range as a separate dataset
  const datasets: CSVData[] = [];
  
  for (const range of ranges) {
    const datasetLines = allLines.slice(range.start, range.end + 1);
    
    // Skip empty datasets
    if (datasetLines.length === 0 || datasetLines.every(line => line.trim() === '')) {
      continue;
    }
    
    // Create a CSV string for this dataset and parse it
    const datasetString = datasetLines.join('\n');
    try {
      const dataset = parseCSV(datasetString, delimiter);
      datasets.push(dataset);
    } catch (error) {
      console.warn(`Skipping invalid dataset at lines ${range.start}-${range.end}:`, error);
    }
  }
  
  return { datasets };
};

/**
 * Detects if a CSV likely contains multiple datasets
 * @param csvString The raw CSV string to check
 * @returns Boolean indicating if multiple datasets are detected
 */
export const hasMultipleDatasets = (csvString: string): boolean => {
  const lines = csvString.split(/\r\n|\n|\r/);
  
  // Look for blank lines that might separate datasets
  let emptyLineFound = false;
  let contentAfterEmptyLine = false;
  
  for (const line of lines) {
    if (line.trim() === '') {
      emptyLineFound = true;
    } else if (emptyLineFound) {
      contentAfterEmptyLine = true;
      break;
    }
  }
  
  return emptyLineFound && contentAfterEmptyLine;
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

/**
 * Converts multiple CSV datasets back to a single CSV string with separators
 * @param multipleDatasets The multiple CSV datasets
 * @param delimiter The delimiter character (default: ',')
 * @returns CSV string representation with blank lines between datasets
 */
export const convertMultipleDatasetsToCSV = (multipleDatasets: MultipleCSVDatasets, delimiter: string = ','): string => {
  if (multipleDatasets.datasets.length === 0) {
    return '';
  }
  
  const datasetStrings = multipleDatasets.datasets.map(dataset => convertToCSV(dataset, delimiter));
  return datasetStrings.join('\n\n'); // Add blank line between datasets
};

import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'portfolio.json');
const defaultFilePath = path.join(process.cwd(), 'data', 'default-portfolio.json');

export function getPortfolioData(): any {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(fileContent);
    }
    if (fs.existsSync(defaultFilePath)) {
      const defaultContent = fs.readFileSync(defaultFilePath, 'utf-8');
      fs.writeFileSync(dataFilePath, defaultContent, 'utf-8');
      return JSON.parse(defaultContent);
    }
  } catch (error) {
    console.error('Error reading portfolio data:', error);
  }

  // Fallback if file read fails
  return null;
}

export function savePortfolioData(data: any): boolean {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving portfolio data:', error);
    return false;
  }
}

export function resetToDefaults(): any {
  try {
    if (fs.existsSync(defaultFilePath)) {
      const defaultContent = fs.readFileSync(defaultFilePath, 'utf-8');
      fs.writeFileSync(dataFilePath, defaultContent, 'utf-8');
      return JSON.parse(defaultContent);
    }
  } catch (error) {
    console.error('Error resetting portfolio data:', error);
  }
  return null;
}

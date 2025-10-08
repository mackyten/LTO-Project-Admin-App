import jsPDF from "jspdf";
import type { ViolationModel } from "../models/violation_model";

interface ReportData {
  trackingNumber?: string;
  createdAt?: Date | { toDate(): Date } | string;
  status?: string;
  fullname?: string;
  phoneNumber?: string;
  address?: string;
  licenseNumber?: string;
  plateNumber?: string;
  violations?: ViolationModel[];
  evidencePhoto?: string;
  licensePhoto?: string;
  platePhoto?: string;
}

export class PDFGenerator {
  private pdf: jsPDF;
  private pageWidth: number;
  private margin: number;
  private contentWidth: number;
  private yPosition: number;

  constructor() {
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'legal', // US Legal size: 8.5" x 14" (216mm x 356mm)
    });
    
    this.pageWidth = 216; // US Legal width
    this.margin = 20;
    this.contentWidth = this.pageWidth - 2 * this.margin;
    this.yPosition = this.margin;
  }

  private addText(
    text: string, 
    x: number, 
    y: number, 
    options: {
      fontSize?: number;
      bold?: boolean;
      align?: 'left' | 'center' | 'right';
    } = {}
  ): void {
    const fontSize = options.fontSize || 10;
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', options.bold ? 'bold' : 'normal');
    this.pdf.text(text, x, y, { align: options.align || 'left' });
  }

  private drawTable(x: number, y: number, width: number, rows: Array<{
    cells: Array<{ text: string; width: number; bold?: boolean }>;
    height: number;
  }>): number {
    let currentY = y;
    
    rows.forEach(row => {
      let currentX = x;
      
      if (row.cells.some(cell => cell.bold)) {
        this.pdf.setFillColor(240, 240, 240);
        this.pdf.rect(x, currentY, width, row.height, 'F');
      }
      
      row.cells.forEach(cell => {
        this.pdf.rect(currentX, currentY, cell.width, row.height);
        this.addText(
          cell.text, 
          currentX + 2, 
          currentY + (row.height / 2) + 1.5, 
          { bold: cell.bold, fontSize: cell.bold ? 11 : 10 }
        );
        currentX += cell.width;
      });
      
      currentY += row.height;
    });
    
    return currentY;
  }

  public async generateReport(data: ReportData): Promise<void> {
    try {
      this.addText('VIOLATION REPORT', this.pageWidth / 2, this.yPosition + 8, {
        fontSize: 16,
        bold: true,
        align: 'center'
      });
      
      this.addText('AUTOFINE', this.pageWidth / 2, this.yPosition + 16, {
        fontSize: 12,
        align: 'center'
      });
      
      this.yPosition += 30;

      this.yPosition = this.drawTable(this.margin, this.yPosition, this.contentWidth, [
        {
          cells: [{ text: 'REPORT OVERVIEW', width: this.contentWidth, bold: true }],
          height: 8
        },
        {
          cells: [
            { text: 'TRACKING NUMBER', width: this.contentWidth / 3, bold: true },
            { text: 'DATE CREATED', width: this.contentWidth / 3, bold: true },
            { text: 'STATUS', width: this.contentWidth / 3, bold: true }
          ],
          height: 8
        },
        {
          cells: [
            { text: data.trackingNumber || 'N/A', width: this.contentWidth / 3 },
            { text: this.formatDate(data.createdAt), width: this.contentWidth / 3 },
            { text: (data.status || 'N/A').toUpperCase(), width: this.contentWidth / 3 }
          ],
          height: 10
        }
      ]);

      this.yPosition += 10;

      this.yPosition = this.drawTable(this.margin, this.yPosition, this.contentWidth, [
        {
          cells: [{ text: 'PERSONAL INFORMATION', width: this.contentWidth, bold: true }],
          height: 8
        },
        {
          cells: [
            { text: 'FULL NAME', width: this.contentWidth / 3, bold: true },
            { text: 'PHONE NUMBER', width: this.contentWidth / 3, bold: true },
            { text: 'ADDRESS', width: this.contentWidth / 3, bold: true }
          ],
          height: 8
        },
        {
          cells: [
            { text: data.fullname || 'N/A', width: this.contentWidth / 3 },
            { text: data.phoneNumber || 'N/A', width: this.contentWidth / 3 },
            { text: data.address || 'N/A', width: this.contentWidth / 3 }
          ],
          height: 10
        }
      ]);

      this.yPosition += 10;

      this.yPosition = this.drawTable(this.margin, this.yPosition, this.contentWidth, [
        {
          cells: [{ text: 'LICENSE AND PLATE INFORMATION', width: this.contentWidth, bold: true }],
          height: 8
        },
        {
          cells: [
            { text: 'LICENSE NUMBER', width: this.contentWidth / 2, bold: true },
            { text: 'PLATE NUMBER', width: this.contentWidth / 2, bold: true }
          ],
          height: 8
        },
        {
          cells: [
            { text: data.licenseNumber || 'N/A', width: this.contentWidth / 2 },
            { text: data.plateNumber || 'N/A', width: this.contentWidth / 2 }
          ],
          height: 10
        }
      ]);

      this.yPosition += 10;

      const violationRows = [
        {
          cells: [{ text: 'VIOLATIONS', width: this.contentWidth, bold: true }],
          height: 8
        },
        {
          cells: [
            { text: 'DETAIL', width: this.contentWidth * 0.5, bold: true },
            { text: 'REPETITION', width: this.contentWidth * 0.25, bold: true },
            { text: 'AMOUNT', width: this.contentWidth * 0.25, bold: true }
          ],
          height: 8
        }
      ];

      if (data.violations && data.violations.length > 0) {
        data.violations.forEach(violation => {
          violationRows.push({
            cells: [
              { text: violation.violationName || 'N/A', width: this.contentWidth * 0.5, bold: false },
              { text: this.formatRepetition(violation.repetition), width: this.contentWidth * 0.25, bold: false },
              { text: this.formatCurrency(violation.price), width: this.contentWidth * 0.25, bold: false }
            ],
            height: 10
          });
        });
      } else {
        violationRows.push({
          cells: [
            { text: 'N/A', width: this.contentWidth * 0.5, bold: false },
            { text: '1ST', width: this.contentWidth * 0.25, bold: false },
            { text: this.formatCurrency(0), width: this.contentWidth * 0.25, bold: false }
          ],
          height: 10
        });
      }

      this.yPosition = this.drawTable(this.margin, this.yPosition, this.contentWidth, violationRows);
      this.yPosition += 10;

      this.yPosition = this.drawTable(this.margin, this.yPosition, this.contentWidth, [
        {
          cells: [{ text: 'IMAGES', width: this.contentWidth, bold: true }],
          height: 8
        },
        {
          cells: [
            { text: 'LICENSE', width: this.contentWidth / 2, bold: true },
            { text: 'PLATE', width: this.contentWidth / 2, bold: true }
          ],
          height: 8
        }
      ]);

      const imageBoxHeight = 40;
      const imageBoxWidth = (this.contentWidth / 2) - 2;
      
      // Load and display license image
      if (data.licensePhoto) {
        const licenseImageData = await this.loadImageFromUrl(data.licensePhoto);
        if (licenseImageData) {
          this.addImageToPDF(licenseImageData, this.margin + 2, this.yPosition + 2, imageBoxWidth, imageBoxHeight);
        } else {
          this.pdf.rect(this.margin + 2, this.yPosition + 2, imageBoxWidth, imageBoxHeight);
          this.addText('License image not available', this.margin + 5, this.yPosition + imageBoxHeight/2, { fontSize: 8 });
        }
      } else {
        this.pdf.rect(this.margin + 2, this.yPosition + 2, imageBoxWidth, imageBoxHeight);
        this.addText('No license image', this.margin + 5, this.yPosition + imageBoxHeight/2, { fontSize: 8 });
      }
      
      // Load and display plate image
      if (data.platePhoto) {
        const plateImageData = await this.loadImageFromUrl(data.platePhoto);
        if (plateImageData) {
          this.addImageToPDF(plateImageData, this.margin + this.contentWidth / 2 + 2, this.yPosition + 2, imageBoxWidth, imageBoxHeight);
        } else {
          this.pdf.rect(this.margin + this.contentWidth / 2 + 2, this.yPosition + 2, imageBoxWidth, imageBoxHeight);
          this.addText('Plate image not available', this.margin + this.contentWidth / 2 + 5, this.yPosition + imageBoxHeight/2, { fontSize: 8 });
        }
      } else {
        this.pdf.rect(this.margin + this.contentWidth / 2 + 2, this.yPosition + 2, imageBoxWidth, imageBoxHeight);
        this.addText('No plate image', this.margin + this.contentWidth / 2 + 5, this.yPosition + imageBoxHeight/2, { fontSize: 8 });
      }
      
      this.yPosition += imageBoxHeight + 5;

      this.yPosition = this.drawTable(this.margin, this.yPosition, this.contentWidth, [
        {
          cells: [{ text: 'EVIDENCE', width: this.contentWidth, bold: true }],
          height: 8
        }
      ]);

      // Load and display evidence image
      if (data.evidencePhoto) {
        const evidenceImageData = await this.loadImageFromUrl(data.evidencePhoto);
        if (evidenceImageData) {
          this.addImageToPDF(evidenceImageData, this.margin + 2, this.yPosition + 2, imageBoxWidth, imageBoxHeight);
        } else {
          this.pdf.rect(this.margin + 2, this.yPosition + 2, imageBoxWidth, imageBoxHeight);
          this.addText('Evidence image not available', this.margin + 5, this.yPosition + imageBoxHeight/2, { fontSize: 8 });
        }
      } else {
        this.pdf.rect(this.margin + 2, this.yPosition + 2, imageBoxWidth, imageBoxHeight);
        this.addText('No evidence image', this.margin + 5, this.yPosition + imageBoxHeight/2, { fontSize: 8 });
      }
      
      this.yPosition += imageBoxHeight + 15;

      const now = new Date();
      const reportTime = now.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      this.addText(
        `Report generated on ${reportTime}`,
        this.margin,
        this.yPosition,
        { fontSize: 9 }
      );

      const filename = `violation_report_${data.trackingNumber || 'unknown'}_${new Date().toISOString().split('T')[0]}.pdf`;
      this.pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  private formatDate(dateValue: Date | { toDate(): Date } | string | undefined): string {
    if (!dateValue) return new Date().toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
    
    try {
      let date: Date;
      
      if (typeof dateValue === 'object' && 'toDate' in dateValue && typeof dateValue.toDate === 'function') {
        date = dateValue.toDate();
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else {
        return new Date().toLocaleDateString('en-US', { 
          month: '2-digit', 
          day: '2-digit', 
          year: 'numeric' 
        });
      }
      
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch {
      return new Date().toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric' 
      });
    }
  }

  private async loadImageFromUrl(url: string): Promise<string | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error loading image:', error);
      return null;
    }
  }

  private addImageToPDF(imageData: string, x: number, y: number, width: number, height: number): void {
    try {
      this.pdf.addImage(imageData, 'JPEG', x, y, width, height);
    } catch (error) {
      console.error('Error adding image to PDF:', error);
      // Fallback: draw a placeholder box
      this.pdf.rect(x, y, width, height);
      this.addText('Image not available', x + 5, y + height/2, { fontSize: 8 });
    }
  }

  private formatCurrency(amount: number | string | undefined): string {
    if (!amount) return 'PHP 0.00';
    
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return 'PHP 0.00';

    // Format with thousands separator
    const formattedAmount = numAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `PHP ${formattedAmount}`;
  }

  private formatRepetition(repetition: string | number): string {
    const num = typeof repetition === 'string' ? parseInt(repetition) : repetition;
    
    if (isNaN(num) || num <= 0) return '1ST';
    
    const cappedNum = Math.min(num, 3);
    
    switch (cappedNum) {
      case 1: return '1ST';
      case 2: return '2ND';
      case 3: return '3RD';
      default: return '1ST';
    }
  }
}

export async function generateViolationReportPDF(reportData: ReportData): Promise<void> {
  const generator = new PDFGenerator();
  await generator.generateReport(reportData);
}

export default PDFGenerator;
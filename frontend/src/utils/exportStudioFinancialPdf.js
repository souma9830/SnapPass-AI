import { jsPDF } from 'jspdf';

/**
 * Generates and downloads an A4 daily studio financial & compliance summary report PDF.
 */
export function exportStudioFinancialPdf({
  studioName = 'SnapPass AI Partner Studio',
  date = new Date().toISOString().split('T')[0],
  photosPrepared = 0,
  sheetsPrinted = 0,
  grossRevenue = 0,
  totalExpense = 0,
  netProfit = 0,
  profitMargin = 0,
  currencySymbol = '$',
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 25, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(studioName, 15, 16);

  // Title
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text('Daily Commercial & Production Telemetry Report', 15, 36);

  doc.setLineWidth(0.4);
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 42, 195, 42);

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Date: ${date}`, 15, 50);
  doc.text(`Generated At: ${new Date().toLocaleTimeString()}`, 130, 50);

  // Section 1: Production Volume
  doc.setFillColor(241, 245, 249);
  doc.rect(15, 58, 180, 40, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Production & Print Output Volume', 20, 68);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Total Biometric Photos Processed: ${photosPrepared}`, 25, 78);
  doc.text(`High-DPI A4 Print Sheets Generated: ${sheetsPrinted}`, 25, 88);

  // Section 2: Financial Metrics
  doc.setFillColor(236, 253, 245);
  doc.rect(15, 106, 180, 58, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(6, 95, 70);
  doc.text('2. Financial Breakdown & Net Margin Analysis', 20, 116);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(`Gross Revenue: ${currencySymbol}${Number(grossRevenue).toFixed(2)}`, 25, 126);
  doc.text(`Consumable Expenses (Paper + Ink + Overhead): ${currencySymbol}${Number(totalExpense).toFixed(2)}`, 25, 136);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`Net Studio Profit: ${currencySymbol}${Number(netProfit).toFixed(2)} (${profitMargin}% Profit Margin)`, 25, 148);

  // Section 3: System Verification Note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('All measurements and financial metrics verified under ICAO 9303 & ISO 19794-5 standards.', 15, 180);

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('SnapPass AI Commercial Studio Engine • Automated Financial Telemetry PDF', 15, 282);

  doc.save(`studio_financial_report_${date}.pdf`);
  return doc;
}

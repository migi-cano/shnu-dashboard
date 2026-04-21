import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// 📝 NOTE: This map ensures data hits the CORRECT ROW in your template.
// Row 6 is usually Caloocan, Row 7 is Las Piñas, etc. 
// Match these to your actual Excel Template row numbers!
const DIVISION_ROW_MAP = {
  "Caloocan": 6, "Las Piñas": 7, "Makati": 8, "Malabon": 9,
  "Mandaluyong": 10, "Manila": 11, "Marikina": 12, "Muntinlupa": 13,
  "Navotas": 14, "Parañaque": 15, "Pasay": 16, "Pasig": 17,
  "Quezon City": 18, "San Juan": 19, "Taguig": 20, "Valenzuela": 21
};

export const exportSDHCPReport = async (reportType, allData) => {
  try {
    const response = await fetch('/templates/SDHCP-Master.xlsx');
    if (!response.ok) throw new Error('Template not found in /public/templates/');

    const arrayBuffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const sheetName = reportType === 'RO' ? 'RO' : `FORM ${reportType}`;
    const worksheet = workbook.getWorksheet(sheetName);

    if (!worksheet) throw new Error(`Worksheet ${sheetName} not found.`);

    const filteredData = allData.filter(item => item.reportType === reportType);

    filteredData.forEach((record) => {
      // Find the specific row for this division. Defaults to Row 6 if not found.
      const rowIndex = DIVISION_ROW_MAP[record.location] || 6;
      const row = worksheet.getRow(rowIndex);

      // --- 📊 FORM 1.1 MAPPING (STUDENTS) ---
      // Inside your forEach loop for Form 1.1:
if (reportType === '1.1') {
    row.getCell(1).value = record.location;
    row.getCell(2).value = record.enrollment;
    row.getCell(3).value = record.schoolsVisited;
    row.getCell(4).value = record.healthTalks;
    row.getCell(5).value = record.toothbrushingDrills;

    // Number of Children
    row.getCell(6).value = record.oralExam;
    row.getCell(7).value = record.cariesFree;
    row.getCell(8).value = record.treatedMeds;
    row.getCell(9).value = record.scalingPolishing;
    row.getCell(10).value = record.extractionDone;
    row.getCell(11).value = record.fillingDone;
    row.getCell(12).value = record.fluorideVarnish;
    row.getCell(13).value = record.healthSupplies;

    // Number of Teeth - Extraction
    row.getCell(14).value = record.extPerm; // Col N
    row.getCell(15).value = record.extTemp; // Col O

    // Number of Teeth - Filling
    row.getCell(16).value = record.fillPFS;  // Col P
    row.getCell(17).value = record.fillART;  // Col Q
    row.getCell(18).value = record.fillZOE;  // Col R
    row.getCell(19).value = record.fillSYF;  // Col S

    // Permanent (Indices start at U=21)
    row.getCell(21).value = record.dmft_D;
    row.getCell(22).value = record.dmft_M;
    row.getCell(23).value = record.dmft_F;
    row.getCell(24).value = record.dmftTotal;

        // Temporary Teeth Index (df s)
        row.getCell(25).value = record.temp_S || 0;        // Col Y
        row.getCell(26).value = record.temp_d || 0;        // Col Z
        row.getCell(27).value = record.temp_f || 0;        // Col AA
        row.getCell(28).value = record.temp_s || 0;        // Col AB
      }

      // --- 🦷 FORM 1.2 MAPPING (DISEASES) ---
      else if (reportType === '1.2') {
        row.getCell(1).value = record.location;
        row.getCell(2).value = record.enrollment || 0;
        row.getCell(3).value = record.gingivitis || 0;     // Col C
        row.getCell(4).value = record.periodontal || 0;    // Col D
        row.getCell(11).value = record.fluorosis || 0;     // Col K
      }

      // --- 👨‍⚕️ FORM 1.3 / RO MAPPING (PERSONNEL) ---
      else if (reportType === '1.3' || reportType === 'RO') {
        row.getCell(1).value = record.location;
        row.getCell(2).value = record.personnel || 0;      // Col B
        row.getCell(3).value = record.oralExam || 0;       // Col C
        row.getCell(5).value = record.cariesFree || 0;     // Col E
        row.getCell(15).value = record.soundTeeth || 0;    // Col O
      }

      row.commit(); 
    });

    // Generate Download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `SDHCP_Form_${reportType}_Full_Report_${new Date().getFullYear()}.xlsx`);

  } catch (error) {
    console.error("Excel Export Error:", error);
    alert("Export Error: " + error.message);
  }
};
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ---- QA Test Cases Excel/Local Storage Utils ----
import * as XLSX from "xlsx";

const EXCEL_PASCAL_COLUMNS = [
  "TestCaseId",
  "Location",
  "TestScenarioName",
  "ExpectedResult",
  "ActualResult",
  "TestStatus",
  "AutomationStatus",
  "Comments",
  "DefectId",
];

const SHEET_NAME = "TestCases";
const LS_KEY = "testCasesData";

// Map PascalCase Excel row to camelCase JS object
function excelRowToCase(row) {
  return {
    testCaseId: row.TestCaseId ?? "",
    location: row.Location ?? "",
    testScenarioName: row.TestScenarioName ?? "",
    expectedResult: row.ExpectedResult ?? "",
    actualResult: row.ActualResult ?? "",
    testStatus: row.TestStatus ?? "",
    automationStatus: row.AutomationStatus ?? "",
    comments: row.Comments ?? "",
    defectId: row.DefectId ?? "",
  };
}

// Map camelCase JS object to PascalCase row for Excel
function caseToExcelRow(tc) {
  return {
    TestCaseId: tc.testCaseId || "",
    Location: tc.location || "",
    TestScenarioName: tc.testScenarioName || "",
    ExpectedResult: tc.expectedResult || "",
    ActualResult: tc.actualResult || "",
    TestStatus: tc.testStatus || "",
    AutomationStatus: tc.automationStatus || "",
    Comments: tc.comments || "",
    DefectId: tc.defectId || "",
  };
}

// Parse from file (ArrayBuffer/File) to JS (camelCase array)
export function parseExcelToCases(file, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const wb = XLSX.read(e.target.result, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
      const cases = json.map(excelRowToCase);
      onSuccess(cases);
    } catch (err) {
      onError(err);
    }
  };
  reader.onerror = onError;
  reader.readAsArrayBuffer(file);
}

// Convert JS (camelCase array) to Excel and return ArrayBuffer
export function casesToExcelBlob(cases) {
  const rows = cases.map(caseToExcelRow);
  const ws = XLSX.utils.json_to_sheet(rows, { header: EXCEL_PASCAL_COLUMNS });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

// Get/set test cases in localStorage
export function getLocalTestCases() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
export function setLocalTestCases(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(data || []));
}

"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Download,
  Edit,
  Save,
  X,
  FileText,
  FileSpreadsheet,
  Globe,
  Calendar,
  Camera,
  Clipboard,
  Delete,
  Trash,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
//Custome components
import ExampleFile from "./_components/Example";

const TestReportGenerator = () => {
  const [testCases, setTestCases] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const [editingCase, setEditingCase] = useState(null);
  const [executionData, setExecutionData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [includeDate, setIncludeDate] = useState(true);
  const fileInputRef = useRef(null);
  const screenshotInputRef = useRef(null);

  // Load data from memory on component mount
  useEffect(() => {
    const savedTestCases = JSON.parse(
      localStorage.getItem("testCases") || "[]"
    );
    const savedExecutionData = JSON.parse(
      localStorage.getItem("executionData") || "{}"
    );
    // Only set if there is data in localStorage
    if (savedTestCases.length > 0) {
      setTestCases(savedTestCases);
    }
    if (Object.keys(savedExecutionData).length > 0) {
      setExecutionData(savedExecutionData);
    }
  }, []);

  // Save data to memory whenever it changes
  useEffect(() => {
    localStorage.setItem("testCases", JSON.stringify(testCases));
  }, [testCases]);

  useEffect(() => {
    localStorage.setItem("executionData", JSON.stringify(executionData));
  }, [executionData]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      //Sheet 01 - meta data
      if (workbook.SheetNames.length < 2) {
        console.error("Second sheet not found in the uploaded file.");
        return;
      }
      const sheetName01 = workbook.SheetNames[0];
      const worksheet01 = workbook.Sheets[sheetName01];
      const jsonData01 = XLSX.utils.sheet_to_json(worksheet01);

      const formattedData01 = jsonData01.map((row, index) => ({
        id: index + 1,
        taskId: row["Task ID"] || row["taskId"] || "",
        taskName: row["Task Name"] || row["taskName"] || "",
        taskURL: row["Task URL"] || row["taskURL"] || "",
        testerName: row["Tester Name"] || row["testerName"] || "",
      }));

      //Sheet 02 - Test data
      const sheetName = workbook.SheetNames[1];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const formattedData = jsonData.map((row, index) => ({
        id: index + 1,
        testCaseNo: row["Test Case No"] || row["testCaseNo"] || "",
        location: row["Location"] || row["location"] || "",
        testCaseName: row["Test Case Name"] || row["testCaseName"] || "",
        expectedResult: row["Expected Result"] || row["expectedResult"] || "",
        actualResult: row["Actual Result"] || row["actualResult"] || "",
        status: "Not Executed",
      }));

      setTestCases(formattedData);
      setMetaData(formattedData01);
    };
    reader.readAsArrayBuffer(file);
  };

  const openEditModal = (testCase) => {
    setEditingCase({
      ...testCase,
      date: new Date().toISOString().split("T")[0],
      status: executionData[testCase.id]?.status || "Not Executed",
      expectedResult:
        executionData[testCase.id]?.expectedResult ||
        testCase.expectedResult ||
        "",
      actualResult:
        executionData[testCase.id]?.actualResult || testCase.actualResult || "",
      screenshot: executionData[testCase.id]?.screenshot || null,
      notes: executionData[testCase.id]?.notes || "",
    });
    setShowEditModal(true);
  };

  const handleSaveExecution = () => {
    if (!editingCase) return;

    const updatedExecutionData = {
      ...executionData,
      [editingCase.id]: {
        date: editingCase.date,
        status: editingCase.status,
        expectedResult: editingCase.expectedResult,
        actualResult: editingCase.actualResult,
        screenshot: editingCase.screenshot,
        notes: editingCase.notes,
        executedAt: new Date().toISOString(),
      },
    };

    setExecutionData(updatedExecutionData);

    // Optional sync back to testCases list (for visible update without reload)
    setTestCases((prev) =>
      prev.map((tc) =>
        tc.id === editingCase.id
          ? {
              ...tc,
              actualResult: editingCase.actualResult,
              expectedResult: editingCase.expectedResult,
            }
          : tc
      )
    );

    setShowEditModal(false);
    setEditingCase(null);
  };

  const handleScreenshotUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setEditingCase((prev) => ({
        ...prev,
        screenshot: e.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const reader = new FileReader();
            reader.onload = (e) => {
              setEditingCase((prev) => ({
                ...prev,
                screenshot: e.target.result,
              }));
            };
            reader.readAsDataURL(blob);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pass":
        return "bg-green-100 text-green-800 border-green-200";
      case "Fail":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const exportToWord = () => {
    const htmlContent = generateReportHTML();
    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split("T")[0]}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // Format Test Case Data
    const reportData = testCases.map((tc) => ({
      "Test Case No": tc.testCaseNo,
      Location: tc.location,
      "Test Case Name": tc.testCaseName,
      "Expected Result": tc.expectedResult,
      "Actual Result": tc.actualResult,
      "Execution Date": executionData[tc.id]?.date || "",
      Status: executionData[tc.id]?.status || "Not Executed",
      Notes: executionData[tc.id]?.notes || "",
    }));

    // Format Meta Data (manual 2-column row-per-field structure)
    const meta = metaData[0] || {}; // assume metaData is array of 1 object
    const metaSheetData = [
      ["Task ID", meta.taskId || ""],
      ["Task Name", meta.taskName || ""],
      ["Task URL", meta.taskURL || ""],
      ["Tester Name", meta.testerName || ""],
    ];

    const metaSheet = XLSX.utils.aoa_to_sheet(metaSheetData); // AOA = Array of Arrays
    const reportSheet = XLSX.utils.json_to_sheet(reportData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, metaSheet, "Meta Data");
    XLSX.utils.book_append_sheet(workbook, reportSheet, "Test Report");

    XLSX.writeFile(
      workbook,
      `test-report-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const exportToWebPage = () => {
    const htmlContent = generateReportHTML();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split("T")[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReportHTML = () => {
    const reportHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Test Execution Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 40px;
          background-color: #f9fafb;
          color: #111827;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .header h1 {
          font-size: 2.5rem;
          font-weight: bold;
        }
        .summary {
          background: #f3f4f6;
          border-left: 6px solid #3b82f6;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 40px;
        }
        .summary h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .summary p {
          margin: 6px 0;
        }
        .test-case {
          background: #ffffff;
          padding: 25px;
          margin-bottom: 40px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .test-case h3 {
          font-size: 1.2rem;
          font-weight: bold;
          color: #0f766e; /* Teal color */
          margin-bottom: 10px;
        }
        .test-case p {
          margin: 6px 0;
        }
        .status-pass {
          background-color: #dcfce7;
          color: #16a34a;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          display: inline-block;
        }
        .status-fail {
          background-color: #fee2e2;
          color: #dc2626;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          display: inline-block;
        }
        .status-not-executed {
          background-color: #f3f4f6;
          color: #6b7280;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          display: inline-block;
        }
        .screenshot {
          margin-top: 15px;
          width: 100%;
        //   max-width: 800px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          display: block;
        }
        @media (min-width: 1200px) {
          .screenshot {
            width: 80%;
          }
        }
        hr {
          margin: 30px 0;
          border: none;
          border-top: 2px dashed #e5e7eb;
        }
        .align-left {
          text-align: left;
          font-size: 0.95rem;
          color: #4b5563;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🧪 Test Execution Report</h1>
        <p class="align-left"><strong>Generated:</strong> ${
          includeDate ? new Date().toISOString().split("T")[0] : ""
        }</p>
        <p class="align-left"><strong>Task ID:</strong> ${
          metaData[0]?.taskId || ""
        } </p>
        <p class="align-left"><strong>Task Name:</strong> ${
          metaData[0]?.taskName || ""
        } </p>
        <p class="align-left"><strong>Task URL:</strong> <a href="${
          metaData[0]?.taskURL || ""
        }">${metaData[0]?.taskURL || ""}</a></p>
        <hr />
      </div>
     
      <div class="summary">
        <h2>Summary</h2>
        <p>Total Test Cases: ${testCases.length}</p>
        <p>✅ Passed: ${
          Object.values(executionData).filter((d) => d.status === "Pass").length
        }</p>
        <p>❌ Failed: ${
          Object.values(executionData).filter((d) => d.status === "Fail").length
        }</p>
        <p>🕒 Not Executed: ${
          testCases.length - Object.keys(executionData).length
        }</p>
      </div>

      <h2 style="font-size: 1.8rem; margin-bottom: 20px;">Test Case Details</h2>

      ${testCases
        .map((tc) => {
          const execution = executionData[tc.id];
          const statusClass = execution?.status
            ? `status-${execution.status.toLowerCase()}`
            : "status-not-executed";
          // Only show date part for execution.date
          const execDate = execution?.date ? execution.date.split("T")[0] : "";

          return `
            <div class="test-case">
              <h3>${tc.testCaseNo}: ${tc.testCaseName}</h3>
              <p><strong>Status:</strong> 
                <span class="${statusClass}">${
            execution?.status || "Not Executed"
          }</span>
              </p>
              
              ${
                includeDate && execDate
                  ? `<p><strong>Execution Date:</strong> ${execDate}</p>`
                  : ""
              }
              <p><strong>Location:</strong> ${tc.location}</p>
              <p><strong>Expected Result:</strong> ${tc.expectedResult}</p>
              <p><strong>Actual:</strong> ${
                execution?.actualResult
                  ? execution.actualResult
                  : tc.actualResult || "-"
              }</p>

              
              ${
                execution?.notes
                  ? `<p><strong>Notes:</strong> ${execution.notes}</p>`
                  : ""
              }
              ${
                execution?.screenshot
                  ? `<img src="${execution.screenshot}" alt="Screenshot" class="screenshot">`
                  : ""
              }
            </div>
          `;
        })
        .join("")}
    </body>
    </html>
  `;
    return reportHTML;
  };

  return (
    <div className="container mx-auto px-5 bg-white shadow rounded-lg">
      <h1 className="py-3 text-3xl font-bold text-gray-800">
        🧪 Test Report Generator
      </h1>
      <hr className="my-4" />

      {/* Upload Section */}
      {testCases.length === 0 && (
        <div className="">
          <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                Upload your Excel file with test cases
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Choose File
              </button>
            </div>
          </div>
          <ExampleFile />
        </div>
      )}

      {/* Export Buttons */}
      {testCases.length > 0 && (
        <div className="mb-6 flex justify-end gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="include-date-checkbox"
              className="text-sm text-gray-700 cursor-pointer select-none"
            >
              Date in Report
            </label>
            <input
              id="include-date-checkbox"
              type="checkbox"
              checked={!!includeDate}
              onChange={(e) => setIncludeDate(e.target.checked)}
              className="accent-blue-600 w-4 h-4"
            />
          </div>
          <Button variant="secondary" onClick={exportToWord}>
            <FileText size={16} />
            Export to Word
          </Button>
          <Button variant="secondary" onClick={exportToExcel}>
            <FileSpreadsheet size={16} />
            Export to Excel
          </Button>
          <Button variant="secondary" onClick={exportToWebPage}>
            <Globe size={16} />
            Export to Web Page
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Clear all test cases?")) {
                setTestCases([]);
                setExecutionData({});
              }
            }}
          >
            <Trash size={16} />
            Clear All
          </Button>
        </div>
      )}

      {/* Test Cases Grid */}
      <div className="grid grid-cols-1 gap-6 mx-3">
        {testCases.map((testCase) => {
          const execution = executionData[testCase.id];
          const status = execution?.status || "Not Executed";

          return (
            <div
              key={testCase.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Header: Test Case Title + Action Buttons */}
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-teal-700">
                  {testCase.testCaseNo} - {testCase.testCaseName}
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditModal(testCase)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    // onClick={() => deleteTestCase(testCase.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>

              <hr className="border-dashed" />

              {/* Main Content: Info + Screenshot */}

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Info Section  */}
                <div className="flex-1 space-y-3 text-sm text-gray-700">
                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <p>
                      <span className="font-bold">Status:</span> {""}
                      <span
                        className={`px-3 py-1 font-medium text-xs ${getStatusColor(
                          status
                        )}`}
                      >
                        {status.toUpperCase()}
                      </span>
                    </p>
                    <span>
                      <strong>Location:</strong> {testCase.location}
                    </span>
                    {execution?.date && (
                      <span>
                        <strong>Execution Date:</strong>{" "}
                        <span className="text-gray-500 text-xs">
                          {(() => {
                            const d = new Date(execution.date);
                            const day = String(d.getDate()).padStart(2, "0");
                            const month = String(d.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const year = d.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()}
                        </span>
                      </span>
                    )}
                  </div>

                  <p>
                    <strong>Expected:</strong> {testCase.expectedResult}
                  </p>
                  <p>
                    <strong>Actual:</strong>
                    {"  "}
                    {execution?.actualResult || testCase.actualResult}
                  </p>

                  {execution?.notes && (
                    <p>
                      <strong>Notes:</strong>{" "}
                      <span className="text-gray-600">{execution.notes}</span>
                    </p>
                  )}
                </div>
                {/* Right: Screenshot (if any) */}
                {execution?.screenshot && (
                  <div className="lg:w-1/2">
                    <p className="text-sm text-gray-500 mb-2 font-medium">
                      Screenshot:
                    </p>
                    <img
                      src={execution.screenshot}
                      alt="Screenshot"
                      className="w-full max-w-[500px] rounded border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="foo mt-5 py-3">End of Test Cases</div>

      {/* Edit Modal */}
      {showEditModal && editingCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Execute Test Case
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Test Case No */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Test Case No
                </label>
                <input
                  type="text"
                  value={editingCase.testCaseNo}
                  disabled
                  className="w-full p-2 border rounded bg-gray-50 text-gray-700"
                />
              </div>

              {/* Test Case Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Test Case Name
                </label>
                <textarea
                  value={editingCase.testCaseName}
                  disabled
                  className="w-full p-2 border rounded bg-gray-50 text-gray-700 h-20 resize-none"
                />
              </div>

              {/* Execution Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Execution Date
                </label>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <input
                    type="date"
                    value={editingCase.date}
                    onChange={(e) =>
                      setEditingCase((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="flex-1 p-2 border rounded"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Test Status
                </label>
                <select
                  value={editingCase.status}
                  onChange={(e) =>
                    setEditingCase((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="Not Executed">Not Executed</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>

              {/* ✅ Expected Result Textarea */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Expected Result
                </label>
                <textarea
                  value={editingCase.expectedResult || ""}
                  onChange={(e) =>
                    setEditingCase((prev) => ({
                      ...prev,
                      expectedResult: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded h-20"
                  placeholder="Enter actual result observed during execution..."
                />
              </div>

              {/* ✅ Actual Result Textarea */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Actual Result
                </label>
                <textarea
                  value={editingCase.actualResult || ""}
                  onChange={(e) =>
                    setEditingCase((prev) => ({
                      ...prev,
                      actualResult: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded h-20"
                  placeholder="Enter actual result observed during execution..."
                />
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Screenshot
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    ref={screenshotInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => screenshotInputRef.current?.click()}
                    className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    <Camera size={14} />
                    Upload
                  </button>
                  <button
                    onClick={handlePasteFromClipboard}
                    className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    <Clipboard size={14} />
                    Paste
                  </button>
                </div>

                {editingCase.screenshot && (
                  <img
                    src={editingCase.screenshot}
                    alt="Screenshot"
                    className="w-full max-w-xs h-32 object-cover rounded border"
                  />
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={editingCase.notes}
                  onChange={(e) =>
                    setEditingCase((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded h-20"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExecution}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestReportGenerator;

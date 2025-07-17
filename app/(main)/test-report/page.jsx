"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

const STORAGE_KEY = "test_case_report";

const TestCases = () => {
  const [taskDetails, setTaskDetails] = useState({
    taskId: "",
    taskName: "",
    taskUrl: "",
    testerName: "",
  });

  const [steps, setSteps] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newStep, setNewStep] = useState({
    stepNo: "",
    description: "",
    image: null,
  });

  const [includeDate, setIncludeDate] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      setTaskDetails(saved.taskDetails || {});
      setSteps(saved.steps || []);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ taskDetails, steps }));
  }, [taskDetails, steps]);

  const handleTaskChange = (e) => {
    setTaskDetails({ ...taskDetails, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.clipboardData?.files?.[0] || e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStep({ ...newStep, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStep = () => {
    setSteps([...steps, newStep]);
    setNewStep({ stepNo: "", description: "", image: null });
    setIsOpen(false);
  };

  const handleDeleteAll = () => {
    if (confirm("Are you sure you want to delete all data?")) {
      setTaskDetails({ taskId: "", taskName: "", taskUrl: "", testerName: "" });
      setSteps([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // const handleExportToWeb = () => {
  //   const html = `
  //     <html><head><title>Test Case Report</title></head><body>
  //     <h1>Test Case Report</h1>
  //     <p><strong>Task ID:</strong> ${taskDetails.taskId}</p>
  //     <p><strong>Task Name:</strong> ${taskDetails.taskName}</p>
  //     <p><strong>Task URL:</strong> ${taskDetails.taskUrl}</p>
  //     <p><strong>Tester Name:</strong> ${taskDetails.testerName}</p>
  //     <hr/>
  //     ${steps
  //       .map(
  //         (step) => `
  //       <h3>Step ${step.stepNo}</h3>
  //       <p>${step.description}</p>
  //       ${
  //         step.image
  //           ? `<img src="${step.image}" style="max-width:100%;border:1px solid #ccc;border-radius:8px;"/>`
  //           : ""
  //       }
  //       <hr/>`
  //       )
  //       .join("")}
  //     </body></html>
  //   `;

  //   const blob = new Blob([html], { type: "text/html" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "TestCaseReport.html";
  //   a.click();
  // };

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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">
        📝 Test Case Report Generator
      </h1>

      {/* Task Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Input
          name="taskId"
          placeholder="Task ID"
          value={taskDetails.taskId}
          onChange={handleTaskChange}
        />
        <Input
          name="taskName"
          placeholder="Task Name"
          value={taskDetails.taskName}
          onChange={handleTaskChange}
        />
        <Input
          name="taskUrl"
          placeholder="Task URL"
          value={taskDetails.taskUrl}
          onChange={handleTaskChange}
        />
        <Input
          name="testerName"
          placeholder="Tester Name"
          value={taskDetails.testerName}
          onChange={handleTaskChange}
        />
      </div>

      <div className="flex gap-4 mb-8">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add Step</Button>
          </DialogTrigger>
          <DialogContent onPaste={handleImageUpload}>
            <DialogHeader>
              <DialogTitle>Add Test Step</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Step Number"
              value={newStep.stepNo}
              onChange={(e) =>
                setNewStep({ ...newStep, stepNo: e.target.value })
              }
              className="mb-3"
            />
            <Textarea
              placeholder="Step Description"
              value={newStep.description}
              onChange={(e) =>
                setNewStep({ ...newStep, description: e.target.value })
              }
              className="mb-3"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-3"
            />
            {newStep.image && (
              <img
                src={newStep.image}
                alt="Preview"
                className="rounded mb-3 border"
              />
            )}
            <Button onClick={handleAddStep}>Save Step</Button>
          </DialogContent>
        </Dialog>

        <Button variant="destructive" onClick={handleDeleteAll}>
          Delete All
        </Button>

        <Button variant="outline" onClick={exportToWebPage}>
          Export to Webpage
        </Button>
      </div>

      {/* Preview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Report Preview</h2>
        <p>
          <strong>Task ID:</strong> {taskDetails.taskId}
        </p>
        <p>
          <strong>Task Name:</strong> {taskDetails.taskName}
        </p>
        <p>
          <strong>Task URL:</strong> {taskDetails.taskUrl}
        </p>
        <p>
          <strong>Tester Name:</strong> {taskDetails.testerName}
        </p>
        <hr className="my-4" />

        {steps.length === 0 ? (
          <p className="text-muted">No steps added yet.</p>
        ) : (
          steps.map((step, idx) => (
            <div key={idx} className="mb-6">
              <p className="font-medium">Step {step.stepNo}</p>
              <p>{step.description}</p>
              {step.image && (
                <img
                  src={step.image}
                  alt={`Step ${step.stepNo}`}
                  className="mt-2 max-w-full rounded border"
                />
              )}
              <hr className="mt-4" />
            </div>
          ))
        )}
      </Card>
    </div>
  );
};

export default TestCases;

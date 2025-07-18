"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import generateReportHTML from "./_components/HtmlReport";
import {
  Clipboard,
  Edit,
  FileText,
  Globe,
  Trash,
  Camera,
  Save,
  X,
  Code,
} from "lucide-react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Media,
} from "docx";
import exportToWordAsDocx from "./_components/ExportAsDocx";

const STORAGE_KEY = "test_case_report";

const SingleTestPage = () => {
  const [taskDetails, setTaskDetails] = useState({
    taskId: "",
    taskName: "",
    taskUrl: "",
    testerName: "",
  });

  const [steps, setSteps] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBasicDetails, setShowBasicDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [includeDate, setIncludeDate] = useState(true);

  const screenshotInputRef = useRef(null);

  const [newStepData, setNewStepData] = useState({
    description: "",
    image: null,
    notes: "",
  });

  // Load from local storage on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        if (parsedData.taskDetails) {
          setTaskDetails(parsedData.taskDetails);
        }
        if (parsedData.steps) {
          setSteps(parsedData.steps);
        }
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage only after initial load
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ taskDetails, steps })
        );
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  }, [taskDetails, steps, isLoaded]);

  const handleTaskChange = (e) => {
    setTaskDetails({ ...taskDetails, [e.target.name]: e.target.value });
  };

  const handleAddStep = () => {
    const nextStepNo = steps.length + 1;
    const newStep = {
      id: Date.now(), // Add unique ID for each step
      stepNo: nextStepNo,
      description: newStepData.description,
      image: newStepData.image,
      notes: newStepData.notes,
    };

    setSteps((prev) => [...prev, newStep]);
    setNewStepData({ description: "", image: null, notes: "" });
    setIsOpen(false);
  };

  const handleDeleteAll = () => {
    if (confirm("Are you sure you want to delete all data?")) {
      setTaskDetails({
        taskId: "",
        taskName: "",
        taskUrl: "",
        testerName: "",
      });
      setSteps([]);
      setNewStepData({ description: "", image: null, notes: "" });
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.clipboardData?.files?.[0] || e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStepData({ ...newStepData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Only update the editingCase state, not affecting other steps
        setEditingCase((prev) => ({
          ...prev,
          screenshot: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToWebPage = () => {
    const htmlContent = generateReportHTML({ taskDetails, steps });
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split("T")[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  //Export to word - as webpage html
  const exportToWord = () => {
    const htmlContent = exportWordReport({
      taskDetails,
      steps,
      includeDate,
    });

    const blob = new Blob([htmlContent], {
      type: "text/html", // Changed MIME type
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split("T")[0]}.html`; // Changed extension
    a.click();
    URL.revokeObjectURL(url);
  };
  const exportWordReport = ({ taskDetails, steps, includeDate }) => {
    let htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Test Report</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 20px;">
          <h1 style="color: #2563eb; text-align: center;">Test Case Report</h1>
          ${
            includeDate
              ? `<p style="text-align: center; color: #6b7280;">Generated on: ${new Date().toLocaleDateString()}</p>`
              : ""
          }
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; background-color: #f9fafb;">Task ID:</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                taskDetails.taskId || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; background-color: #f9fafb;">Task Name:</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                taskDetails.taskName || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; background-color: #f9fafb;">Task URL:</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                taskDetails.taskUrl || "N/A"
              }</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; background-color: #f9fafb;">Tester Name:</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${
                taskDetails.testerName || "N/A"
              }</td>
            </tr>
          </table>
          
          <h2 style="color: #059669; margin-top: 30px;">Test Steps:</h2>
    `;

    steps.forEach((step, index) => {
      htmlContent += `
        <div style="margin-bottom: 30px; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
          <h3 style="color: #0d9488; margin-top: 0;">Step ${step.stepNo}: ${
        step.description
      }</h3>
          ${
            step.image
              ? `<img src="${step.image}" alt="Step ${step.stepNo} Screenshot" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0;"/>`
              : ""
          }
          ${step.notes ? `<p><strong>Notes:</strong> ${step.notes}</p>` : ""}
        </div>
      `;
    });

    htmlContent += `
        </body>
      </html>
    `;

    return htmlContent;
  };

  //Export to word - with docs lib
  // const exportToWordAsDocx = async () => {
  //   const doc = new Document({
  //     sections: [
  //       {
  //         properties: {},
  //         children: [
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: "Test Case Report",
  //                 bold: true,
  //                 size: 32,
  //               }),
  //             ],
  //             alignment: "center",
  //           }),

  //           // Add date if included
  //           ...(includeDate
  //             ? [
  //                 new Paragraph({
  //                   children: [
  //                     new TextRun({
  //                       text: `Generated on: ${new Date().toLocaleDateString()}`,
  //                       italics: true,
  //                     }),
  //                   ],
  //                   alignment: "center",
  //                 }),
  //               ]
  //             : []),

  //           // Task details table
  //           new Table({
  //             rows: [
  //               new TableRow({
  //                 children: [
  //                   new TableCell({ children: [new Paragraph("Task ID:")] }),
  //                   new TableCell({
  //                     children: [new Paragraph(taskDetails.taskId || "N/A")],
  //                   }),
  //                 ],
  //               }),
  //               new TableRow({
  //                 children: [
  //                   new TableCell({ children: [new Paragraph("Task Name:")] }),
  //                   new TableCell({
  //                     children: [new Paragraph(taskDetails.taskName || "N/A")],
  //                   }),
  //                 ],
  //               }),
  //               // Add more rows as needed
  //             ],
  //           }),

  //           // Steps
  //           new Paragraph({
  //             children: [
  //               new TextRun({
  //                 text: "Test Steps:",
  //                 bold: true,
  //                 size: 24,
  //               }),
  //             ],
  //           }),

  //           // Add steps dynamically
  //           ...steps.map(
  //             (step) =>
  //               new Paragraph({
  //                 children: [
  //                   new TextRun({
  //                     text: `Step ${step.stepNo}: ${step.description}`,
  //                     bold: true,
  //                   }),
  //                 ],
  //               })
  //           ),
  //         ],
  //       },
  //     ],
  //   });

  //   const blob = await Packer.toBlob(doc);
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `test-report-${new Date().toISOString().split("T")[0]}.docx`;
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  //Export to word - my version

  const exportToWordAsDocx = async () => {
    // Function to convert image URL to Uint8Array
    const getImageData = async (imageUrl) => {
      try {
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
      } catch (error) {
        console.error("Error fetching image:", error);
        return null;
      }
    };

    // Function to get image dimensions
    const getImageDimensions = (imageUrl) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          // Calculate dimensions to fit in document (max width 500px)
          const maxWidth = 500;
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
          resolve({
            width: Math.round(img.width * ratio),
            height: Math.round(img.height * ratio),
          });
        };
        img.onerror = () => resolve({ width: 400, height: 300 });
        img.src = imageUrl;
      });
    };

    // Prepare step paragraphs with images
    const stepParagraphs = [];

    for (const step of steps) {
      // Add step title
      stepParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Step ${step.stepNo}: ${step.description}`,
              bold: true,
              size: 24,
            }),
          ],
          spacing: {
            before: 200,
            after: 100,
          },
        })
      );

      // Add image if exists
      if (step.image) {
        try {
          const imageData = await getImageData(step.image);
          const dimensions = await getImageDimensions(step.image);

          if (imageData) {
            stepParagraphs.push(
              new Paragraph({
                children: [
                  Media.addImage(
                    doc,
                    imageData,
                    dimensions.width,
                    dimensions.height
                  ),
                ],
                spacing: {
                  before: 100,
                  after: 100,
                },
              })
            );
          }
        } catch (error) {
          console.error("Error processing image:", error);
          // Add a placeholder text if image fails to load
          stepParagraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `[Image could not be loaded: ${step.image}]`,
                  italics: true,
                  color: "999999",
                }),
              ],
            })
          );
        }
      }

      // Add notes if exists
      if (step.notes) {
        stepParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Notes: ",
                bold: true,
              }),
              new TextRun({
                text: step.notes,
              }),
            ],
            spacing: {
              before: 100,
              after: 200,
            },
          })
        );
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Test Case Report",
                  bold: true,
                  size: 32,
                }),
              ],
              alignment: "center",
              spacing: {
                after: 300,
              },
            }),

            // Add date if included
            ...(includeDate
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Generated on: ${new Date().toLocaleDateString()}`,
                        italics: true,
                      }),
                    ],
                    alignment: "center",
                    spacing: {
                      after: 400,
                    },
                  }),
                ]
              : []),

            // Task details table
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Task ID:", bold: true }),
                          ],
                        }),
                      ],
                      shading: {
                        fill: "F9FAFB",
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph(taskDetails.taskId || "N/A")],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Task Name:", bold: true }),
                          ],
                        }),
                      ],
                      shading: {
                        fill: "F9FAFB",
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph(taskDetails.taskName || "N/A")],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Task URL:", bold: true }),
                          ],
                        }),
                      ],
                      shading: {
                        fill: "F9FAFB",
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph(taskDetails.taskUrl || "N/A")],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Tester Name:", bold: true }),
                          ],
                        }),
                      ],
                      shading: {
                        fill: "F9FAFB",
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph(taskDetails.testerName || "N/A"),
                      ],
                    }),
                  ],
                }),
              ],
              width: {
                size: 100,
                type: "pct",
              },
            }),

            // Test Steps heading
            new Paragraph({
              children: [
                new TextRun({
                  text: "Test Steps:",
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: {
                before: 400,
                after: 200,
              },
            }),

            // Add all step paragraphs
            ...stepParagraphs,
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split("T")[0]}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToWordMy = () => {
    const htmlContent = generateReportHTML({ taskDetails, steps });
    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split("T")[0]}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Delete individual step
  const deleteStep = (stepId) => {
    if (confirm("Are you sure you want to delete this step?")) {
      setSteps((prev) => prev.filter((step) => step.id !== stepId));
    }
  };

  // Open edit modal for specific step
  const openEditModal = (step) => {
    // Create a deep copy of the step to avoid modifying the original
    setEditingCase({
      ...step,
      screenshot: step.image, // Map image to screenshot for the modal
    });
    setShowEditModal(true);
  };

  // Save edited step
  const handleSaveExecution = () => {
    if (editingCase) {
      setSteps((prev) =>
        prev.map((step) =>
          step.id === editingCase.id
            ? {
                ...step,
                description: editingCase.description,
                image: editingCase.screenshot || step.image, // Use screenshot if available, otherwise keep original
                notes: editingCase.notes,
              }
            : step
        )
      );
      setShowEditModal(false);
      setEditingCase(null);
    }
  };

  // Handle paste from clipboard
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const reader = new FileReader();
            reader.onload = (e) => {
              // Only update the editingCase state, not the original steps
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
      alert(
        "Failed to paste from clipboard. Please try uploading an image instead."
      );
    }
  };

  // Show loading state until data is loaded
  if (!isLoaded) {
    return <div className="max-w-5xl mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-5 bg-white shadow rounded-lg">
      <h1 className="py-3 text-3xl font-bold text-gray-800">
        📝 Test Case Report Generator
      </h1>

      {/* Task basic Info */}
      {showBasicDetails && (
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
      )}

      <hr className="my-4" />

      {/* Export Buttons */}
      <div className="flex justify-between flex-wrap gap-4 mb-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add Step</Button>
          </DialogTrigger>
          <DialogContent onPaste={handleImageUpload}>
            <DialogHeader>
              <DialogTitle>Add Test Step</DialogTitle>
            </DialogHeader>

            <Textarea
              placeholder="Step Description"
              value={newStepData.description}
              onChange={(e) =>
                setNewStepData({ ...newStepData, description: e.target.value })
              }
              className="mb-3"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-3"
            />
            {newStepData.image && (
              <img
                src={newStepData.image}
                alt="Preview"
                className="rounded mb-3 border max-h-60 object-contain"
              />
            )}

            <Textarea
              placeholder="Notes (optional)"
              value={newStepData.notes}
              onChange={(e) =>
                setNewStepData({ ...newStepData, notes: e.target.value })
              }
              className="mb-3"
            />

            <Button onClick={handleAddStep}>Save Step</Button>
          </DialogContent>
        </Dialog>

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

        <div className="flex items-center gap-2">
          <label
            htmlFor="show-basic-details-checkbox"
            className="text-sm text-gray-700 cursor-pointer select-none"
          >
            Show Basic Details
          </label>
          <input
            id="show-basic-details-checkbox"
            type="checkbox"
            checked={!!showBasicDetails}
            onChange={(e) => setShowBasicDetails(e.target.checked)}
            className="accent-blue-600 w-4 h-4"
          />
        </div>

        <div className="flex gap-4">
          <Button variant="secondary" onClick={exportToWord}>
            <Code size={16} />
            Export to Html
          </Button>

          {/* As docx */}
          <Button variant="secondary" hidden onClick={exportToWordAsDocx}>
            <FileText size={16} />
            Export to Word as Docx
          </Button>

          {/* As docx my */}
          <Button variant="secondary" onClick={exportToWordMy}>
            <FileText size={16} />
            Export to Word
          </Button>

          <Button variant="secondary" onClick={exportToWebPage}>
            <Globe size={16} />
            Export to Web Page
          </Button>

          <Button variant="destructive" onClick={handleDeleteAll}>
            Delete All
          </Button>
        </div>
      </div>

      <hr className="my-4" />

      {/* Preview */}
      {steps.length === 0 ? (
        <p className="text-muted-foreground">No steps added yet.</p>
      ) : (
        steps.map((step) => (
          <div
            key={step.id}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all space-y-4 mb-5"
          >
            {/* Header: Test Case Title + Action Buttons */}
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-teal-700">
                Step {step.stepNo} - {step.description}
              </h3>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEditModal(step)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteStep(step.id)}
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
              <div className="lg:w-1/2">
                {step.image && (
                  <>
                    <p className="text-sm text-gray-500 mb-2 font-medium">
                      Screenshot:
                    </p>
                    <img
                      src={step.image}
                      alt="Screenshot"
                      className="w-full max-w-[500px] rounded border border-gray-300"
                    />
                  </>
                )}
                {step.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2 font-medium">
                      Notes:
                    </p>
                    <p className="text-gray-700">{step.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      <hr />

      {/* Edit Modal */}
      {showEditModal && editingCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Edit Test Step
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
              {/* Test Case Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Test Case Description
                </label>
                <textarea
                  value={editingCase.description || ""}
                  onChange={(e) =>
                    setEditingCase((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded h-20"
                  placeholder="Enter step description..."
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
                  value={editingCase.notes || ""}
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

export default SingleTestPage;

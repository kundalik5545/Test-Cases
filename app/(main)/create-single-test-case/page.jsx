"use client";
import React, { useEffect, useState } from "react";
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
import { Clipboard, Edit, FileText, Globe, Trash } from "lucide-react";

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
  const [isLoaded, setIsLoaded] = useState(false); // Track if data is loaded
  const [showBasicDetails, setShowBasicDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [includeDate, setIncludeDate] = useState(true);

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
      stepNo: nextStepNo,
      description: newStepData.description,
      image: newStepData.image,
      notes: newStepData.notes,
    };

    setSteps((prev) => [...prev, newStep]);
    setNewStepData({ description: "", image: null });
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
      setNewStepData({ description: "", image: null });
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

  // Show loading state until data is loaded
  if (!isLoaded) {
    return <div className="max-w-5xl mx-auto px-4 py-8">Loading...</div>;
  }

  // Open add steps form
  const openEditModal = () => {
    setEditingCase({
      ...steps,
      stepNo: "",
      description: "",
    });
    setShowEditModal(true);
  };

  //Handle paste from clipboard
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
          <Button variant="secondary">
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
            key={step.stepNo}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all space-y-4 mb-5"
          >
            {/* Header: Test Case Title + Action Buttons */}
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-teal-700">
                {step.stepNo} - {step.description}
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
              <div className="lg:w-1/2">
                <p className="text-sm text-gray-500 mb-2 font-medium">
                  Screenshot:
                </p>
                <img
                  src={step.image}
                  alt="Screenshot"
                  className="w-full max-w-[500px] rounded border border-gray-300"
                />
              </div>
            </div>
          </div>
        ))
      )}

      <hr />

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
              {/* <div>
                <label className="block text-sm font-medium mb-1">
                  Steps No
                </label>
                <input
                  type="text"
                  value=""
                  disabled
                  className="w-full p-2 border rounded bg-gray-50 text-gray-700"
                />
              </div> */}

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

export default SingleTestPage;

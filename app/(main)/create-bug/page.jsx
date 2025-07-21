"use client";
import { useState } from "react";

const BugPage = () => {
  const [bugData, setBugData] = useState({
    title: "",
    description: "",
    priority: "medium",
    severity: "minor",
    steps: "",
    expectedResult: "",
    actualResult: "",
    environment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBugData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(bugData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Bug</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Bug Title</label>
          <input
            type="text"
            name="title"
            value={bugData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={bugData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              name="priority"
              value={bugData.priority}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Severity</label>
            <select
              name="severity"
              value={bugData.severity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
              <option value="blocker">Blocker</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Steps to Reproduce
          </label>
          <textarea
            name="steps"
            value={bugData.steps}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
            placeholder="1. First step&#10;2. Second step&#10;3. ..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Expected Result
          </label>
          <textarea
            name="expectedResult"
            value={bugData.expectedResult}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Actual Result
          </label>
          <textarea
            name="actualResult"
            value={bugData.actualResult}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Environment</label>
          <input
            type="text"
            name="environment"
            value={bugData.environment}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="OS, Browser, Version, etc."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Bug
        </button>
      </form>
    </div>
  );
};

export default BugPage;

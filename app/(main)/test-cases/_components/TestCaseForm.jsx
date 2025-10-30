import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

const STATUS_OPTIONS = [
  { label: "Pass", value: "pass", color: "green" },
  { label: "Fail", value: "fail", color: "red" },
  { label: "Block", value: "block", color: "orange" },
  { label: "Select", value: "select", color: "blue" },
  { label: "Pending", value: "pending", color: "gray" },
];

const AUTOMATION_OPTIONS = [
  { label: "Automated", value: "automated", color: "green" },
  { label: "Not Automated", value: "notautomated", color: "red" },
  { label: "Pending", value: "pending", color: "blue" },
  { label: "Block", value: "block", color: "orange" },
];

const EMPTY_CASE = {
  testCaseId: "",
  location: "",
  testScenarioName: "",
  expectedResult: "",
  actualResult: "",
  testStatus: "",
  automationStatus: "",
  comments: "",
  defectId: "",
};

export default function TestCaseForm({ onSubmit, onCancel, initialValues }) {
  const [fields, setFields] = useState(initialValues || EMPTY_CASE);
  const [err, setErr] = useState("");

  useEffect(() => {
    setFields(initialValues || EMPTY_CASE);
  }, [initialValues]);

  function handleChange(field, value) {
    setFields((f) => ({ ...f, [field]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    const atLeastOne = Object.values(fields).some(
      (v) => !!v && v.trim() !== ""
    );
    if (!atLeastOne) {
      setErr("Please provide at least one value.");
      return;
    }
    setErr("");
    onSubmit(fields);
    // Only reset if not editing
    if (!initialValues) setFields(EMPTY_CASE);
  }
  return (
    <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="testCaseId">Test Case ID</Label>
          <Input
            id="testCaseId"
            value={fields.testCaseId}
            onChange={(e) => handleChange("testCaseId", e.target.value)}
            placeholder="Test Case ID"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={fields.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Location"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="testScenarioName">Test Scenario Name</Label>
          <Input
            id="testScenarioName"
            value={fields.testScenarioName}
            onChange={(e) => handleChange("testScenarioName", e.target.value)}
            placeholder="Test Scenario Name"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="expectedResult">Expected Result</Label>
          <Textarea
            id="expectedResult"
            value={fields.expectedResult}
            onChange={(e) => handleChange("expectedResult", e.target.value)}
            placeholder="Expected Result"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="actualResult">Actual Result</Label>
          <Textarea
            id="actualResult"
            value={fields.actualResult}
            onChange={(e) => handleChange("actualResult", e.target.value)}
            placeholder="Actual Result"
          />
        </div>
        <div>
          <Label htmlFor="testStatus">Test Status</Label>
          <Select
            value={fields.testStatus}
            onValueChange={(v) => handleChange("testStatus", v)}
          >
            <SelectTrigger id="testStatus" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="automationStatus">Automation Status</Label>
          <Select
            value={fields.automationStatus}
            onValueChange={(v) => handleChange("automationStatus", v)}
          >
            <SelectTrigger id="automationStatus" className="w-full">
              <SelectValue placeholder="Select automation status" />
            </SelectTrigger>
            <SelectContent>
              {AUTOMATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="comments">Comments</Label>
          <Textarea
            id="comments"
            value={fields.comments}
            onChange={(e) => handleChange("comments", e.target.value)}
            placeholder="Enter comments"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="defectId">Defect ID</Label>
          <Input
            id="defectId"
            value={fields.defectId}
            onChange={(e) => handleChange("defectId", e.target.value)}
            placeholder="Defect ID"
            className="w-28 md:w-40"
          />
        </div>
      </div>
      {err && <div className="text-red-600 text-sm mt-1">{err}</div>}
      <div className="flex gap-2 justify-end mt-6">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          {initialValues ? "Update" : "Add Test Case"}
        </Button>
      </div>
    </form>
  );
}

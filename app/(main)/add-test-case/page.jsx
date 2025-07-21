"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const AddNewTCPage = () => {
  const [formData, setFormData] = useState({
    testCaseNo: "",
    location: "",
    testCaseName: "",
    expectedResult: "",
    actualResult: "",
    testStatus: "Pass",
  });

  const [testCases, setTestCases] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, testStatus: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTestCases((prev) => [...prev, formData]);
    setFormData({
      testCaseNo: "",
      location: "",
      testCaseName: "",
      expectedResult: "",
      actualResult: "",
      testStatus: "Pass",
    });
  };

  const exportToExcel = () => {
    alert("Export logic goes here...");
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Add New Test Case</h1>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="testCaseNo">Test Case No:</Label>
                <Input
                  id="testCaseNo"
                  name="testCaseNo"
                  value={formData.testCaseNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location:</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="testCaseName">Test Case Name:</Label>
                <Input
                  id="testCaseName"
                  name="testCaseName"
                  value={formData.testCaseName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="testStatus">Test Status:</Label>
                <Select
                  value={formData.testStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Fail">Fail</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="expectedResult">Expected Result:</Label>
              <Textarea
                id="expectedResult"
                name="expectedResult"
                value={formData.expectedResult}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="actualResult">Actual Result:</Label>
              <Textarea
                id="actualResult"
                name="actualResult"
                value={formData.actualResult}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Add Test Case</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {testCases.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Saved Test Cases</h2>
              <Button variant="success" onClick={exportToExcel}>
                Export to Excel
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Case No</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Test Case Name</TableHead>
                    <TableHead>Expected Result</TableHead>
                    <TableHead>Actual Result</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testCases.map((tc, index) => (
                    <TableRow key={index}>
                      <TableCell>{tc.testCaseNo}</TableCell>
                      <TableCell>{tc.location}</TableCell>
                      <TableCell>{tc.testCaseName}</TableCell>
                      <TableCell>{tc.expectedResult}</TableCell>
                      <TableCell>{tc.actualResult}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            tc.testStatus === "Pass"
                              ? "bg-green-100 text-green-800"
                              : tc.testStatus === "Fail"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {tc.testStatus}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddNewTCPage;

"use client";
import FormModal from "@/components/myUi/FormModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  casesToExcelBlob,
  getLocalTestCases,
  parseExcelToCases,
  setLocalTestCases,
} from "@/lib/utils";
import { Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TestCaseForm from "./_components/TestCaseForm";

// Badge component for rendering
function Badge({ color, children }) {
  let bg = "";
  switch (color) {
    case "green":
      bg = "bg-green-500";
      break;
    case "red":
      bg = "bg-red-500";
      break;
    case "orange":
      bg = "bg-orange-500";
      break;
    case "gray":
      bg = "bg-gray-500";
      break;
    case "blue":
      bg = "bg-blue-500";
      break;
    default:
      bg = "bg-gray-400";
  }
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${bg}`}
    >
      {children}
    </span>
  );
}

// Map status/automation string to display & color for badges
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
function getStatusOption(value) {
  return STATUS_OPTIONS.find((s) => s.value === value);
}
function getAutomationOption(value) {
  return AUTOMATION_OPTIONS.find((s) => s.value === value);
}

const PAGE_SIZE = 10;
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

function StatusCards({ data }) {
  const stats = useMemo(() => {
    const initial = {
      pass: 0,
      fail: 0,
      block: 0,
      select: 0,
      pending: 0,
      total: 0,
    };
    return data.reduce((acc, c) => {
      acc.total++;
      if (c.testStatus && acc[c.testStatus] !== undefined) acc[c.testStatus]++;
      return acc;
    }, initial);
  }, [data]);
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {Object.entries(stats).map(([k, v]) => (
        <Card key={k} className="min-w-[120px] grow">
          <CardHeader>
            <CardTitle className="capitalize">{k}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xl font-bold">{v}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function TestCases() {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("testCaseId");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [upErr, setUpErr] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null); // index of row being edited (in filtered array, remapped)
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    setCases(getLocalTestCases());
  }, []);
  useEffect(() => {
    setLocalTestCases(cases);
  }, [cases]);

  const filtered = useMemo(() => {
    let d = [...cases];
    if (filter)
      d = d.filter((row) =>
        Object.values(row).some((v) =>
          (v + "").toLowerCase().includes(filter.toLowerCase())
        )
      );
    if (sortKey)
      d = d.sort(
        (a, b) =>
          (a[sortKey] || "").localeCompare(b[sortKey] || "", undefined, {
            numeric: true,
          }) * (sortDir === "asc" ? 1 : -1)
      );
    return d;
  }, [cases, filter, sortKey, sortDir]);
  const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    parseExcelToCases(
      file,
      (arr) => {
        setCases(arr);
        setPage(1);
        setUpErr(null);
      },
      (err) => setUpErr("Failed to parse file. Ensure columns use PascalCase.")
    );
  }
  function handleExport() {
    const blob = casesToExcelBlob(cases);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "TestCases.xlsx";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    a.remove();
  }
  function handleDelete(idx) {
    setCases((cs) => cs.filter((_, i) => i !== idx));
  }
  // Add handler for submit from modal form
  function handleAddCase(newCase) {
    setCases((prev) => [newCase, ...prev]);
    setAddOpen(false);
    setPage(1);
  }
  // Edit
  function handleEdit(idx) {
    setEditIdx(idx);
    setEditOpen(true);
  }
  function handleEditSubmit(editedCase) {
    if (editIdx === null) return;
    // Map filtered index in paginated to global index in cases
    const pagedGlobalIdx = (page - 1) * PAGE_SIZE + editIdx;
    setCases((prev) =>
      prev.map((c, i) => (i === pagedGlobalIdx ? editedCase : c))
    );
    setEditOpen(false);
    setEditIdx(null);
  }
  function handleEditCancel() {
    setEditOpen(false);
    setEditIdx(null);
  }

  // Helper for status badge
  const renderStatusBadge = (value) => {
    const option = STATUS_OPTIONS.find((item) => item.value === value);
    if (!option) return value;
    return <Badge color={option.color}>{option.label}</Badge>;
  };
  // Helper for automation badge
  const renderAutomationBadge = (value) => {
    const option = AUTOMATION_OPTIONS.find((item) => item.value === value);
    if (!option) return value;
    return <Badge color={option.color}>{option.label}</Badge>;
  };

  return (
    <div className="mx-auto py-4 px-2  ">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <Input type="file" accept=".xlsx" onChange={handleUpload} />
          <Button variant="outline" onClick={handleExport}>
            Export to Excel
          </Button>
          <Button variant="default" onClick={() => setAddOpen(true)}>
            Add New Test Case
          </Button>
          <Link href="/TestCases.xlsx" download>
            <Button variant="outline">
              <Download className="w-4 h-4 " /> Sample Excel
            </Button>
          </Link>
        </div>
        <Input
          placeholder="Filter test cases..."
          value={filter}
          onChange={(e) => (setFilter(e.target.value), setPage(1))}
          className="md:w-64"
        />
      </div>
      {upErr && <div className="text-red-600 mb-2">{upErr}</div>}
      <StatusCards data={cases} />
      <div className="rounded-xl border overflow-auto shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.keys(EMPTY_CASE).map((key) => (
                <TableHead
                  key={key}
                  onClick={() => {
                    setSortKey(key);
                    setSortDir((d) =>
                      sortKey === key && d === "asc" ? "desc" : "asc"
                    );
                  }}
                  className="cursor-pointer select-none font-bold px-3 py-2 text-gray-800 bg-muted/40 hover:bg-muted/70 transition-colors"
                >
                  {key}
                  {sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : null}
                </TableHead>
              ))}
              <TableHead className="w-32 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((row, i) => (
              <TableRow key={i} className="hover:bg-muted/20 ">
                {Object.keys(EMPTY_CASE).map((col) => (
                  <TableCell
                    key={col}
                    className="min-w-[120px] px-3 py-2" // removed max-w constraint
                  >
                    {/* Display colored badges for status fields, plain text for all others */}
                    {col === "testStatus" && row[col] ? (
                      (() => {
                        const s = getStatusOption(row[col]);
                        return s ? (
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold bg-${s.color}-100 text-${s.color}-800 border border-${s.color}-300`}
                          >
                            {s.label}
                          </span>
                        ) : (
                          row[col]
                        );
                      })()
                    ) : col === "automationStatus" && row[col] ? (
                      (() => {
                        const s = getAutomationOption(row[col]);
                        return s ? (
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold bg-${s.color}-100 text-${s.color}-800 border border-${s.color}-300`}
                          >
                            {s.label}
                          </span>
                        ) : (
                          row[col]
                        );
                      })()
                    ) : row[col] ? (
                      row[col]
                    ) : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </TableCell>
                ))}
                <TableCell className="px-3 text-center flex gap-2 justify-center">
                  <Button
                    variant="secondary"
                    onClick={() => handleEdit(i)}
                    className="text-blue-600"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete((page - 1) * PAGE_SIZE + i)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={Object.keys(EMPTY_CASE).length + 1}
                  className="text-center py-8"
                >
                  No test cases found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-3 py-2 gap-2 bg-muted/20">
          <span className="text-sm">
            Showing {filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0} -{" "}
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
            test cases
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <span>
              Page {page} / {maxPage}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(p + 1, maxPage))}
              disabled={page === maxPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <FormModal
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Test Case"
        description="Fill in the details for the new test case."
      >
        <TestCaseForm
          onSubmit={handleAddCase}
          onCancel={() => setAddOpen(false)}
        />
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v);
          if (!v) setEditIdx(null);
        }}
        title="Edit Test Case"
        description="Modify the fields and save."
      >
        <TestCaseForm
          key={editIdx}
          initialValues={editIdx !== null ? paginated[editIdx] : null}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      </FormModal>
    </div>
  );
}

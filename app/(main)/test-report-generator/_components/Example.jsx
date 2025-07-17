import { Button } from "@/components/ui/button";
import React from "react";

const ExampleFile = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Example Test Cases
      </h1>
      <p className="mb-6 text-gray-600">
        Download an example Excel file to help you format your test cases for
        upload.
      </p>
      <a href="/Test cases example file.xlsx" download className="inline-block">
        <Button type="button" className="w-full">
          Download Excel File
        </Button>
      </a>
    </div>
  );
};

export default ExampleFile;

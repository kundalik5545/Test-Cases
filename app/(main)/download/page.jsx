import React from "react";

const DownloadPage = () => {
  const downloadItem = [
    {
      itemName: "Download SQL Script",
      URL: "/QA Test.sql",
      info: "Use to track all QA Test Database script.",
    },
    {
      itemName: "Download Test Cases Sample File",
      URL: "/Test cases example file.xlsx",
      info: "This is sample file for test cases upload.",
    },
    {
      itemName: "Download HR System Script",
      URL: "/Test cases example file.xlsx",
      info: "This is sample file for test cases upload.",
    },
    {
      itemName: "Download HR System Script",
      URL: "/Test cases example file.xlsx",
      info: "This is sample file for test cases upload.",
    },
    {
      itemName: "Download HR System Script",
      URL: "/Test cases example file.xlsx",
      info: "This is sample file for test cases upload.",
    },
  ];
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Download Content</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {downloadItem.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 border border-gray-300 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              {item.itemName}
            </h2>
            <p className="text-gray-600 mb-4">{item.info}</p>
            <a
              href={item.URL}
              download
              className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadPage;

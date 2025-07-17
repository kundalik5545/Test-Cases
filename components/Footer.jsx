import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Info sect */}
      <div className="flex flex-col items-center">
        <p className="text-xl font-semibold">QA XPath by Random Coders</p>
        <p className="text-sm p-1 text-center dark:text-gray-300 text-gray-600">
          💡 Helping Test Automation Engineers to automate process.
        </p>
      </div>

      <div
        className="p-5 text-base text-gray-500 dark:text-gray-400 text-center"
        aria-label="Copy Rights Warning"
      >
        <span>© 2025 QA XPath. </span>
        <span>Created by </span>
        <Link
          href="https://github.com/kundalik5545"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#f18b42] hover:text-[#e07b35] transition-colors"
        >
          Random Coders
        </Link>
      </div>
    </div>
  );
};

export default Footer;

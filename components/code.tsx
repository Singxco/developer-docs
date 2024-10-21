"use client";
import React, { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism.css"; // Import Prism CSS

interface JsonHighlighterProps {
  jsonData: object; // Accept JSON data as a prop
}

const JsonHighlighter: React.FC<JsonHighlighterProps> = ({ jsonData }) => {
  useEffect(() => {
    Prism.highlightAll(); // Highlight the code after rendering
  }, [jsonData]);

  return (
    <code className="language-json">
      {JSON.stringify(jsonData, null, 2)} {/* Format JSON for display */}
    </code>
  );
};

export default JsonHighlighter;

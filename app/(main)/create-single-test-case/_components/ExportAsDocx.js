import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
} from "docx";
//Export to word - with docs lib
const exportToWordAsDocx = async () => {
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
                }),
              ]
            : []),

          // Task details table
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Task ID:")] }),
                  new TableCell({
                    children: [new Paragraph(taskDetails.taskId || "N/A")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Task Name:")] }),
                  new TableCell({
                    children: [new Paragraph(taskDetails.taskName || "N/A")],
                  }),
                ],
              }),
              // Add more rows as needed
            ],
          }),

          // Steps
          new Paragraph({
            children: [
              new TextRun({
                text: "Test Steps:",
                bold: true,
                size: 24,
              }),
            ],
          }),

          // Add steps dynamically
          ...steps.map(
            (step) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Step ${step.stepNo}: ${step.description}`,
                    bold: true,
                  }),
                ],
              })
          ),
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

export default exportToWordAsDocx;

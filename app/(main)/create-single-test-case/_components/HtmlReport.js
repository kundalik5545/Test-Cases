const generateReportHTML = ({ taskDetails, steps }) => {
  console.log("Generating HTML report with newStep:", steps);

  const reportHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Test Execution Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 40px;
          background-color: #f9fafb;
          color: #111827;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .header h1 {
          font-size: 2.5rem;
          font-weight: bold;
        }
        .summary {
          background: #f3f4f6;
          border-left: 6px solid #3b82f6;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 40px;
        }
        .summary h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .summary p {
          margin: 6px 0;
        }
        .test-case {
          background: #ffffff;
          padding: 25px;
          margin-bottom: 40px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .test-case h3 {
          font-size: 1.2rem;
          font-weight: bold;
          color: #0f766e;
          margin-bottom: 10px;
        }
        .test-case p {
          margin: 6px 0;
        }
        .status-pass {
          background-color: #dcfce7;
          color: #16a34a;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          display: inline-block;
        }
        .status-fail {
          background-color: #fee2e2;
          color: #dc2626;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          display: inline-block;
        }
        .status-not-executed {
          background-color: #f3f4f6;
          color: #6b7280;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          display: inline-block;
        }
        .screenshot {
          margin-top: 15px;
          width: 100%;
          // height: auto;
          // max-height: 600px;
          // object-fit: contain;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          display: block; 
        }
        @media (min-width: 768px) {
          .screenshot {
            width: 90%;
            margin: 15px 0px;
          }
        }
        @media (min-width: 1200px) {
          .screenshot {
            width: 80%;
            max-height: 800px;
          }
        }
        hr {
          margin: 30px 0;
          border: none;
          border-top: 2px dashed #e5e7eb;
        }
        .align-left {
          text-align: left;
          font-size: 0.95rem;
          color: #4b5563;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🧪 Test Execution Report</h1>
        <p class="align-left"><strong>Generated:</strong> ${new Date().toISOString()}</p> 
        <hr />
      </div>
     
      <div class="summary">
        <h2>Summary</h2>
        <p class="align-left"><strong>Task ID:</strong> ${
          taskDetails.taskId
        }</p>
        <p class="align-left"><strong>Task Name:</strong> ${
          taskDetails.taskName
        }</p>
        <p class="align-left"><strong>Task URL:</strong> ${
          taskDetails.taskUrl
        }</p>
        <p class="align-left"><strong>Tester Name:</strong> ${
          taskDetails.testerName
        }</p>
      </div>

      <h2 style="font-size: 1.8rem; margin-bottom: 20px;">Test Case Details</h2>
 
        ${steps
          .map(
            (step, index) => `
            <div class="test-case" key="${index}">
              <h3 class="align-left"><strong>Step ${index + 1}:</strong> 
              ${step.description} </h3>
              <p class=""><strong>Screenshot:</strong>
              <img src="${step.image}" alt="Screenshot for Step ${
              index + 1
            }" class="screenshot " />
            </div> 
            `
          )
          .join("")} 
      
    </body>
    </html>
  `;
  return reportHTML;
};

export default generateReportHTML;

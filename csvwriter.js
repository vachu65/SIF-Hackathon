import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { stringify } from "csv-stringify";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));



const app = express();
const port = 6969;
const csvFilePath = path.join(__dirname, 'public', 'userLogs.csv');



app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.post("/user-logs", async (req, res) => {
  try {
    const logData = req.body;
    // Save the log to CSV
    saveToCSV(logData);
    res.status(200).send('Log received and saved.');
  } catch (error) {
    console.error('Error saving log:', error);
    res.status(500).send('Internal Server Error');
  }
});
function saveToCSV(logData) {
    const headers = [
      'target', 'path', 'pageUrl', 'pageTitle', 'pageReferrer', 'browser',
      'clientTime', 'microTime', 'location', 'scrnRes', 'type', 'logType',
      'userAction', 'details', 'userId', 'toolVersion', 'toolName',
      'useraleVersion', 'sessionID'
    ];
    const data = [headers.map(header => logData[header])];
  
    stringify(data, { header: true, columns: headers }, (err, csvString) => {
      if (err) {
        console.error('Error converting to CSV:', err);
        return;
      }
  
      // Append to the CSV file
      fs.appendFile(csvFilePath, csvString, (err) => {
        if (err) {
          console.error('Error writing to CSV file:', err);
        }
      });
    });
  }
  
  

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

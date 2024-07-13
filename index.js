import express from "express";
import axios from "axios";
import { stringify } from "csv-stringify";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // Add this line to import the fs module
import path from "path"; // Add this line to import the path module

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 6969;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.text()); // Use express.text() directly for parsing the body

app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/terms", async (req, res) => {
    res.render("type.ejs");
  });

  
 

app.post('/updateCsv', (req, res) => {
  const csvData = req.body;

  // Path to the existing CSV file
  const filePath = path.join(__dirname, 'log_events.csv');

  // Read the existing content
  fs.readFile(filePath, 'utf8', (err, existingData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    // Append the new data
    const newData = existingData + csvData;

    // Write back to the file
    fs.writeFile(filePath, newData, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      res.status(200).send('CSV Updated Successfully');
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

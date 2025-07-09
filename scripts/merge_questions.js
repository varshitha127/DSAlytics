const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Parse command-line arguments
const args = process.argv.slice(2);
let inputPath = null;
let outputPath = null;
let source = 'Custom';
let maxCount = 200;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--input' && args[i + 1]) inputPath = args[++i];
  else if (args[i] === '--output' && args[i + 1]) outputPath = args[++i];
  else if (args[i] === '--source' && args[i + 1]) source = args[++i];
  else if (args[i] === '--max' && args[i + 1]) maxCount = parseInt(args[++i], 10);
}

if (!inputPath || !outputPath) {
  console.error('Usage: node merge_questions.js --input <input.csv> --output <output.json> [--source <source>] [--max <count>]');
  process.exit(1);
}

const problems = [];
const titles = new Set();
let id = 1;

function addProblem({ title, difficulty, acceptance, source }) {
  if (!title || titles.has(title)) return;
  problems.push({
    id: id++,
    title,
    difficulty,
    acceptance: acceptance ? parseFloat(acceptance) : undefined,
    source
  });
  titles.add(title);
}

function readCSV() {
  return new Promise((resolve) => {
    fs.createReadStream(inputPath)
      .pipe(csv())
      .on('data', (row) => {
        // Try to find the best column names
        const title = row['title'] || row['Question Name'] || row['Title'] || row['Problem'] || row['Problem Name'];
        const difficulty = row['difficulty'] || row['Difficulty Level'] || row['Difficulty'] || row['Level'];
        const acceptance = row['acceptance'] || row['Accuracy'] || row['Acceptance'];
        addProblem({
          title,
          difficulty,
          acceptance: acceptance ? acceptance.replace('%', '') : undefined,
          source
        });
      })
      .on('end', resolve);
  });
}

async function main() {
  await readCSV();
  const output = problems.slice(0, maxCount);
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Wrote ${output.length} unique problems to ${outputPath}`);
}

main(); 
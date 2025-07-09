const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

const datasets = [
  {
    name: 'leetcode-dsa-questions',
    owner: 'tarundelhi',
    filename: 'leetcode_questions.csv'
  },
  {
    name: 'dsa-questions-dataset',
    owner: 'inductiveanks',
    filename: 'dsa_questions.csv'
  }
];

const downloadDataset = async (dataset) => {
  try {
    console.log(`Downloading ${dataset.name}...`);
    const downloadCmd = `kaggle datasets download ${dataset.owner}/${dataset.name} -p ${path.join(__dirname, '../../data')} --unzip`;
    await execAsync(downloadCmd);
    console.log(`Successfully downloaded ${dataset.name}`);
  } catch (error) {
    console.error(`Error downloading ${dataset.name}:`, error.message);
  }
};

const processDatasets = async () => {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Download all datasets
    for (const dataset of datasets) {
      await downloadDataset(dataset);
    }

    console.log('All datasets downloaded successfully!');
  } catch (error) {
    console.error('Error processing datasets:', error);
    process.exit(1);
  }
};

// Run the script
processDatasets(); 
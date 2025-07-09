const fs = require('fs');
const path = require('path');

const directories = [
    'client',
    'client/public',
    'client/src',
    'client/src/assets',
    'client/src/components',
    'client/src/features',
    'client/src/features/Auth',
    'client/src/features/Dashboard',
    'client/src/features/Questions',
    'client/src/features/CodingPlayground',
    'client/src/features/Tests',
    'client/src/features/Forum',
    'client/src/features/AIChatbot',
    'client/src/pages',
    'client/src/context',
    'client/src/services',
    'client/src/utils',
    'server',
    'server/config',
    'server/controllers',
    'server/models',
    'server/routes',
    'server/middleware',
    'server/utils',
    'ai-services',
    'docker'
];

// Create directories
directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
});

// Create .gitkeep files to preserve empty directories
directories.forEach(dir => {
    const gitkeepPath = path.join(__dirname, dir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '');
        console.log(`Created .gitkeep in: ${dir}`);
    }
});

console.log('Directory structure setup complete!'); 
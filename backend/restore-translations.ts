import * as fs from 'fs';

// Read original seed file
const originalContent = fs.readFileSync('prisma/seed_original.ts', 'utf-8');

// Extract all translation fields and convert to content_en
let restoredContent = originalContent.replace(/translation:/g, 'content_en:');

// Remove depth_level and content_with_ruby fields
restoredContent = restoredContent.replace(/\s*depth_level:\s*\d+,?\n/g, '\n');
restoredContent = restoredContent.replace(/\s*content_with_ruby:.*?,?\n/g, '\n');

// Remove quizResult.deleteMany
restoredContent = restoredContent.replace(/\s*await prisma\.quizResult\.deleteMany\(\);?\n/g, '');

// Write restored file
fs.writeFileSync('prisma/seed_restored.ts', restoredContent, 'utf-8');

console.log('Created seed_restored.ts with all translations converted to content_en');

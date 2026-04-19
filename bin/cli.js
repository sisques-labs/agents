#!/usr/bin/env node

import { copyFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const agentsDir = join(__dirname, '..', 'agents');

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log('Usage: npx @sisques-labs/agents add <agent>');
  console.log('Available agents: commit, testing, code-review, architecture, readme, docs, migration');
  process.exit(0);
}

if (command === 'add') {
  const agentName = args[1];
  if (!agentName) {
    console.error('Error: Please specify an agent name');
    console.log('Usage: npx @sisques-labs/agents add <agent>');
    process.exit(1);
  }

  const agentPath = join(agentsDir, `${agentName}.md`);
  const targetPath = join(process.cwd(), `${agentName}.md`);

  if (!existsSync(agentPath)) {
    console.error(`Error: Agent "${agentName}" not found`);
    console.log('Available agents: commit, testing, code-review, architecture, readme, docs, migration');
    process.exit(1);
  }

  copyFileSync(agentPath, targetPath);
  console.log(`✓ Agent "${agentName}" added to ${targetPath}`);
} else if (command === 'list') {
  const agents = readdirSync(agentsDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
  console.log('Available agents:');
  agents.forEach(a => console.log(`  - ${a}`));
} else {
  console.error(`Unknown command: ${command}`);
  console.log('Usage: npx @sisques-labs/agents add <agent>');
  process.exit(1);
}
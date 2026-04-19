#!/usr/bin/env node

import { copyFileSync, readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const agentsDir = join(__dirname, '..', 'agents');
const workflowDir = join(agentsDir, 'workflow');

const workflowAgents = ['discover', 'planner', 'executer', 'reviewer'];

const args = process.argv.slice(2);
const command = args[0];

function isWorkflowAgent(name) {
  return workflowAgents.includes(name);
}

function getAgentPath(name) {
  if (isWorkflowAgent(name) && existsSync(workflowDir)) {
    return join(workflowDir, `${name}.md`);
  }
  return join(agentsDir, `${name}.md`);
}

if (!command) {
  console.log('Usage: npx @sisques-labs/agents add <agent>');
  console.log('Available agents: commit, testing, code-review, architecture, readme, docs, migration');
  console.log('');
  console.log('Workflow agents: discover, planner, executer, reviewer');
  console.log('Workflow usage:');
  console.log('  npx @sisques-labs/agents add discover           - Add workflow agents');
  console.log('  npx @sisques-labs/agents discover            - Show discover agent prompt');
  console.log('  npx @sisques-labs/agents planner              - Show planner agent prompt');
  console.log('  npx @sisques-labs/agents executer              - Show executer agent prompt');
  console.log('  npx @sisques-labs/agents reviewer            - Show reviewer agent prompt');
  process.exit(0);
}

if (command === 'add') {
  const agentName = args[1];
  if (!agentName) {
    console.error('Error: Please specify an agent name');
    console.log('Usage: npx @sisques-labs/agents add <agent>');
    process.exit(1);
  }

  if (agentName === 'discover' || agentName === 'planner' || agentName === 'executer' || agentName === 'reviewer') {
    const targetDir = process.cwd();

    if (!existsSync(workflowDir)) {
      console.error('Error: Workflow agents not found');
      process.exit(1);
    }

    console.log('Adding workflow agents...');
    for (const agent of workflowAgents) {
      const sourcePath = join(workflowDir, `${agent}.md`);
      const targetPath = join(targetDir, `${agent}.md`);

      if (!existsSync(sourcePath)) {
        console.error(`Error: Agent "${agent}" not found in workflow`);
        process.exit(1);
      }

      copyFileSync(sourcePath, targetPath);
      console.log(`✓ Agent "${agent}" added`);
    }

    console.log('');
    console.log('Workflow agents ready. Usage:');
    console.log('  npx @sisques-labs/agents discover  - Run discover');
    console.log('  npx @sisques-labs/agents planner   - Run planner');
    console.log('  npx @sisques-labs/agents executer  - Run executer');
    console.log('  npx @sisques-labs/agents reviewer - Run reviewer');
    process.exit(0);
  }

  const agentPath = getAgentPath(agentName);
  const targetPath = join(process.cwd(), `${agentName}.md`);

  if (!existsSync(agentPath)) {
    console.error(`Error: Agent "${agentName}" not found`);
    console.log('Available agents: commit, testing, code-review, architecture, readme, docs, migration');
    process.exit(1);
  }

  copyFileSync(agentPath, targetPath);
  console.log(`✓ Agent "${agentName}" added to ${targetPath}`);
} else if (isWorkflowAgent(command)) {
  const sourcePath = getAgentPath(command);

  if (!existsSync(sourcePath)) {
    console.error(`Error: Agent "${command}" not found`);
    process.exit(1);
  }

  const content = readFileSync(sourcePath, 'utf-8');
  console.log(content);
} else if (command === 'list') {
  const allAgents = [];

  function scanDir(dir) {
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = join(dir, item);
      if (statSync(fullPath).isDirectory()) {
        scanDir(fullPath);
      } else if (item.endsWith('.md')) {
        allAgents.push(item.replace('.md', ''));
      }
    }
  }

  scanDir(agentsDir);

  console.log('Available agents:');
  allAgents.forEach(a => console.log(`  - ${a}`));
} else {
  console.error(`Unknown command: ${command}`);
  console.log('Usage: npx @sisques-labs/agents add <agent>');
  process.exit(1);
}
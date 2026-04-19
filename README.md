# @sisques-labs/agents

CLI tool to add reusable AI agent prompts to your projects.

## Installation

```bash
npm install -g @sisques-labs/agents
```

## Usage

```bash
# Add an agent to your project
npx @sisques-labs/agents add commit
npx @sisques-labs/agents add testing
npx @sisques-labs/agents add code-review
npx @sisques-labs/agents add architecture
npx @sisques-labs/agents add readme
npx @sisques-labs/agents add docs
npx @sisques-labs/agents add migration

# List available agents
npx @sisques-labs/agents list
```

## Available Agents

| Agent | Description |
|-------|-------------|
| commit | Conventional commits prompt |
| testing | Test generation prompt |
| code-review | Code review prompt |
| architecture | Architecture design prompt |
| readme | README generation prompt |
| docs | Technical documentation prompt |
| migration | Code migration prompt |

## License

MIT
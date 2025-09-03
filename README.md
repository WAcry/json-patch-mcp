# MCP JSON Patch Utility

Apply RFC 6902 JSON Patch arrays to JSON files via MCP. Absolute paths are required; Node.js >= 20.

## Use via npx (MCP)

```json
{
  "mcpServers": {
    "json_patch": {
      "command": "npx",
      "args": ["@wacry/json-patch-mcp@1.0.6"]
    }
  }
}
```

Starts an MCP stdio server exposing `apply_json_patch_to_file`. Writes back to the file and returns status only. `filePath` MUST be absolute.

## Use without npx (MCP alternatives)

- Global install:

```bash
npm install -g @wacry/json-patch-mcp@1.0.6
```

Then configure your MCP host:

```json
{
  "mcpServers": {
    "json_patch": {
      "command": "json-patch-mcp"
    }
  }
}
```

- Local dependency in a project:

```bash
npm install -D @wacry/json-patch-mcp@1.0.6
```

Cross‑platform (recommended):

```json
{
  "mcpServers": {
    "json_patch": {
      "command": "node",
      "args": ["./node_modules/@wacry/json-patch-mcp/dist/cli.cjs"]
    }
  }
}
```

Or via the package binary (may require a POSIX shell):

```json
{
  "mcpServers": {
    "json_patch": {
      "command": "./node_modules/.bin/json-patch-mcp"
    }
  }
}
```

- Using a cloned repository:

```bash
git clone https://github.com/WAcry/json-patch-mcp.git
cd json-patch-mcp
npm install
npm run build
```

Configure with an absolute path to the built CLI:

```json
{
  "mcpServers": {
    "json_patch": {
      "command": "node",
      "args": ["/absolute/path/to/json-patch-mcp/dist/cli.cjs"]
    }
  }
}
```

On Windows you can be explicit about `node.exe`:

```json
{
  "mcpServers": {
    "json_patch": {
      "command": "C:\\\\Program Files\\\\nodejs\\\\node.exe",
      "args": ["C:\\\\path\\\\to\\\\json-patch-mcp\\\\dist\\\\cli.cjs"]
    }
  }
}
```

Notes:

- Prefer absolute paths in MCP configs (hosts may change CWD).
- Node.js >= 20 is required.

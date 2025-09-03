# MCP JSON Patch Utility

Apply RFC 6902 JSON Patch arrays to JSON files via MCP.

## Use via npx (MCP)

```json
{
  "mcpServers": {
    "json_patch": {
      "command": "npx",
      "args": ["-y","@wacry/json-patch-mcp@1.0.6"]
    }
  }
}
```

Starts an MCP stdio server exposing `apply_json_patch_to_file`. Writes back to the file and returns status only. `filePath` MUST be absolute.

Notes:
- Node.js >= 20 is required.

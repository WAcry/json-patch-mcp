#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { applyJsonPatchToFile } from './index.js';

const mcp = new McpServer({ name: 'json-patch-mcp', version: '1.0.6' });

mcp.tool(
  'apply_json_patch_to_file',
  'Apply RFC 6902 JSON Patch to a JSON file on disk. Always writes back to file and returns only status. filePath MUST be an absolute OS path.',
  {
    filePath: z.string().describe('Absolute file path to JSON file.'),
    patches: z.array(z.any()).describe('RFC 6902 operations array.'),
  },
  async (args, _extra) => {
    const { filePath, patches } = args as any;
    const result = await applyJsonPatchToFile({ filePath, patches } as any);
    if (result.status === 'success') {
      return { content: [{ type: 'text', text: 'success' }] };
    }
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `${result.code}: ${result.message}${result.details ? ` | details=${JSON.stringify(result.details)}` : ''}`,
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
void (async () => {
  await mcp.connect(transport);
})().catch((err) => {
  console.error('[json-patch-mcp] Failed to start MCP server:', err);
  process.exitCode = 1;
});



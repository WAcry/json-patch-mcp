#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { applyJsonPatchToFile } from './index.js';
import type { ApplyPatchParams } from './types.js';
import type { Operation } from 'fast-json-patch';

const mcp = new McpServer({ name: 'json-patch-mcp', version: '1.0.7' });

// Strict RFC 6902 patch operation schema
const addOp = z.object({ op: z.literal('add'), path: z.string(), value: z.any() }).strict();
const replaceOp = z.object({ op: z.literal('replace'), path: z.string(), value: z.any() }).strict();
const testOp = z.object({ op: z.literal('test'), path: z.string(), value: z.any() }).strict();
const removeOp = z.object({ op: z.literal('remove'), path: z.string() }).strict();
const moveOp = z.object({ op: z.literal('move'), path: z.string(), from: z.string() }).strict();
const copyOp = z.object({ op: z.literal('copy'), path: z.string(), from: z.string() }).strict();

const patchOperationSchema = z.discriminatedUnion('op', [addOp, replaceOp, testOp, removeOp, moveOp, copyOp]);

mcp.tool(
  'apply_json_patch_to_file',
  'Apply RFC 6902 JSON Patch to a JSON file on disk. Always writes back to file and returns only status. filePath MUST be an absolute OS path.',
  {
    filePath: z.string().describe('Absolute file path to JSON file.'),
    patches: z.array(patchOperationSchema).describe('RFC 6902 operations array.'),
  },
  async (args, _extra) => {
    const { filePath, patches } = args as { filePath: string; patches: Operation[] };
    const result = await applyJsonPatchToFile({ filePath, patches } as ApplyPatchParams);
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



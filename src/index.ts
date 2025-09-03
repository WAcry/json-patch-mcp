import { readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import jsonpatch, { type Operation } from 'fast-json-patch';
import type { ApplyPatchParams, ServiceResult } from './types.js';
import { toServiceError } from './errors.js';

/**
 * Apply a JSON Patch (RFC 6902) array to a JSON file on disk.
 *
 * The function resolves the provided file path to an absolute path, reads and parses the JSON,
 * validates the patch, applies it without mutating the original document by default, and returns
 * a structured result suitable for machine consumers.
 */
export async function applyJsonPatchToFile(params: ApplyPatchParams): Promise<ServiceResult<unknown>> {
  const { filePath, patches } = params;

  try {
    const resolvedPath = path.resolve(filePath);
    // Enforce absolute path: reject if input was not absolute and resolved differently
    if (!path.isAbsolute(filePath)) {
      return {
        status: 'error',
        code: 'INVALID_PATH',
        message: 'filePath must be an absolute filesystem path. Relative paths are not allowed.',
        details: { provided: filePath, resolved: resolvedPath },
      } as const;
    }

    let fileContent: string;
    try {
      fileContent = await readFile(resolvedPath, 'utf8');
    } catch (e) {
      return toServiceError(e, { path: resolvedPath });
    }

    let document: unknown;
    try {
      document = JSON.parse(fileContent);
    } catch (e) {
      return toServiceError(e, { path: resolvedPath });
    }

    const validationError = jsonpatch.validate(patches as ReadonlyArray<Operation>, document as any);
    if (validationError) {
      return {
        status: 'error',
        code: 'PATCH_FAILED',
        message: validationError.message || 'Failed to apply JSON patch. The patch may be invalid or conflict with the document.',
        details: { path: resolvedPath },
      };
    }

    try {
      const results = jsonpatch.applyPatch(
        document as any,
        patches as ReadonlyArray<Operation>,
        false,
        true,
        true,
      );
      const newDoc = results.newDocument;
      try {
        await writeFile(resolvedPath, JSON.stringify(newDoc, null, 2), 'utf8');
      } catch (e) {
        return toServiceError(e, { path: resolvedPath });
      }
      return { status: 'success', data: newDoc };
    } catch (e) {
      return toServiceError(e, { path: resolvedPath });
    }
  } catch (e) {
    return toServiceError(e);
  }
}

export default {
  applyJsonPatchToFile,
};

export * from './types.js';



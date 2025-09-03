import type { ServiceError, ServiceErrorCode } from './types';

function mapErrnoToCode(code?: string): ServiceErrorCode | undefined {
  switch (code) {
    case 'ENOENT':
      return 'FILE_NOT_FOUND';
    case 'EACCES':
    case 'EPERM':
      return 'PERMISSION_DENIED';
    default:
      return undefined;
  }
}

export function toServiceError(err: unknown, ctx?: { path?: string }): ServiceError {
  const details: Record<string, unknown> = {};
  if (ctx?.path) details.path = ctx.path;

  if (err && typeof err === 'object') {
    const anyErr = err as any;
    if (anyErr.code || anyErr.syscall || anyErr.path) {
      if (anyErr.code) details.nodeCode = anyErr.code;
      if (anyErr.syscall) details.syscall = anyErr.syscall;
      if (anyErr.path && !details.path) details.path = anyErr.path;

      const mapped = mapErrnoToCode(anyErr.code);
      if (mapped) {
        return {
          status: 'error',
          code: mapped,
          message:
            mapped === 'FILE_NOT_FOUND'
              ? 'File not found at specified path.'
              : 'Permission denied to access the file.',
          details,
        };
      }
    }

    const name: string | undefined = anyErr.name;
    const message: string = typeof anyErr.message === 'string' ? anyErr.message : 'An unexpected error occurred.';

    if (name === 'SyntaxError') {
      return { status: 'error', code: 'INVALID_JSON', message: 'The file content is not valid JSON.', details };
    }

    if (name === 'JsonPatchError' || name === 'PatchError') {
      return { status: 'error', code: 'PATCH_FAILED', message, details };
    }
  }

  return { status: 'error', code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred.', details };
}



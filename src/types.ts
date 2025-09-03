export type ServiceStatus = 'success' | 'error';

export interface ServiceSuccess<T> {
  status: 'success';
  data: T;
}

export interface ServiceError {
  status: 'error';
  code: ServiceErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export type ServiceErrorCode =
  | 'INVALID_PATH'
  | 'FILE_NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'INVALID_JSON'
  | 'PATCH_FAILED'
  | 'UNKNOWN_ERROR';

export interface ApplyPatchParams {
  filePath: string;
  patches: ReadonlyArray<any>;
}



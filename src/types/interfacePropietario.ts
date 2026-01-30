export interface FtpConfig {
  Id: number;
  FtpUrl: string;
  FtpUsername: string;
  FtpPassword: string;
  Observaciones?: string;
}

export interface SaveFtpConfigData {
  FtpUrl: string;
  FtpUsername: string;
  FtpPassword: string;
  Observaciones?: string;
}

export interface FtpFile {
  Name: string;
  FullPath: string;
  IsDirectory: boolean;
  Size: number;
  ModifiedDate?: string;
}

export interface UploadResult {
  Success: boolean;
  Message: string;
  FileName?: string;
}

export interface TestConnectionResult {
  success: boolean;
  message: string;
}

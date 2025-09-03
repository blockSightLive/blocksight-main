export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ErrorCategory {
  RENDER = 'RENDER',
  LIFECYCLE = 'LIFECYCLE',
  EVENT_HANDLER = 'EVENT_HANDLER',
  ASYNC_OPERATION = 'ASYNC_OPERATION',
  WEBGL_THREEJS = 'WEBGL_THREEJS',
  WEBSOCKET = 'WEBSOCKET',
  STATE_MANAGEMENT = 'STATE_MANAGEMENT',
  ROUTING = 'ROUTING',
  UNKNOWN = 'UNKNOWN'
}

export interface ErrorInfo {
  componentStack: string;
  errorBoundaryId?: string;
}

export interface ErrorDetails {
  error: Error;
  errorInfo: ErrorInfo;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: number;
  componentName?: string;
  retryCount?: number;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  errorHistory: ErrorDetails[];
  isRecovering: boolean;
  lastErrorTime: number;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  componentName?: string;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  errorThreshold?: number;
  recoveryTimeout?: number;
  enableAutoRecovery?: boolean;
  maxRetries?: number;
}

export interface ThreeJSErrorBoundaryProps extends ErrorBoundaryProps {
  maxRetries?: number;
  enableAutoRecovery?: boolean;
}

export interface RouterErrorBoundaryProps extends ErrorBoundaryProps {
  onNavigateToError?: () => void;
}

export interface ErrorBoundaryCallback {
  (error: Error, category: ErrorCategory, severity: ErrorSeverity): void;
}

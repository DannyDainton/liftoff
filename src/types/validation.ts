export interface ValidationRequest {
  stepId: string;
  apiKey: string;
  context?: ValidationContext;
}

export interface ValidationContext {
  userId?: string;
  workspaceId?: string;
  environmentId?: string;
}

export interface ValidationResult {
  success: boolean;
  message: string;
  details?: string;
  pointsAwarded: number;
  context?: ValidationContext;
}

export type ValidatorFn = (
  apiKey: string,
  context: ValidationContext
) => Promise<ValidationResult>;

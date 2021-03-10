export type StateType =
  | 'unknown'
  | 'pending'
  | 'in_progress'
  | 'cancelled'
  | 'failed'
  | 'rolled_back'
  | 'successful';
export type EnvironmentType =
  | 'unmapped'
  | 'development'
  | 'testing'
  | 'staging'
  | 'production';

export interface Associations {
  associationType: 'issueKeys' | 'issueIdOrKeys';
  values: string[];
}

export interface Pipeline {
  id: string;
  displayName: string;
  url: string;
}

export interface Environment {
  id: string;
  displayName: string;
  type: EnvironmentType;
}

export interface DeploymentData {
  schemaVersion?: string;
  deploymentSequenceNumber: number;
  updateSequenceNumber: number;
  associations: Associations[];
  displayName: string;
  url: string;
  description: string;
  lastUpdated: string;
  label?: string;
  state: StateType;
  pipeline: Pipeline;
  environment: Environment;
}

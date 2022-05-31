export interface DataSource {
  getType(): DataSourceType;
  validateCredentials(): Promise<string|null>;
  getRepositories(): Promise<Repository[]>;
  getPullRequests(repos: Repository[]): Promise<PullRequest[]>;
  getBranches(repos: Repository[]): Promise<Branch[]>;
}

export type DataSourceType = 'Bitbucket' | 'Github';
export const DATA_SOURCE_TYPES: DataSourceType[] = ['Bitbucket', 'Github'];

export interface DataSourceInfo {
  type: DataSourceType;
  credentials: Credentials;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Repository {
  title: string;
  project: string;
  name: string;
}

export interface PullRequest {
  source: string;
  destination: string;
  title: string;
  created: string;
  updated: string;
  author: string;
  repository: Repository;
  link: string;
  commentsCount: number;
  hash: string;
}

export interface GroupedPullRequest {
  source: string;
  destination: string;
  pullRequests: PullRequest[];
  created: string;
  updated: string;
  sourceBranchesWithoutPullRequest: Branch[];
}

export interface Branch {
  name: string;
  hash: string;
  repository: Repository;
  link: string;
}

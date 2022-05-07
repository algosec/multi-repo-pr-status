import {DataSourceType} from "./DataSourceProvider";

export interface DataSource {
  getType(): string;
  fetchUserDisplayName(): Promise<string>;
  validateCredentials(): Promise<void>;
  getRepositories(): Promise<Repository[]>;
  getPullRequests(repos: Repository[]): Promise<PullRequest[]>;
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
  created: Date;
  updated: Date;
  author: string;
  repository: Repository;
  link: string;
}

export interface GroupedPullRequest {
  source: string;
  destination: string;
  pullRequests: PullRequest[];
  created: Date;
  updated: Date;
}

export interface Settings {
  datasource: {
    type: DataSourceType;
    credentials: Credentials;
  }
  repositories: Repository[]
}

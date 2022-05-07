export interface BitBucketObjectLinks {
  self: BitBucketLink;
  html: BitBucketLink;
}

export interface BitBucketLink {
  href: string;
}

export interface BitbucketWorkspace {
  created_on: Date;
  is_private: boolean;
  links: BitBucketObjectLinks;
  name: string;
  slug: string;
  uuid: string;
}

export interface BitbucketRepository {
  workspace: BitbucketWorkspace;
  slug: string;
  full_name: string;
  name: string;
}

export interface Paginate<T> {
  pagelen: number;
  size: number;
  page: number;
  next: string;
  values: T[];
}

export interface BitbucketPullRequest {
  title: string;
  links: BitBucketObjectLinks;
  created_on: Date;
  updated_on: Date;
  state: BitbucketPullRequestState;
  source: BitbucketBranch;
  destination: BitbucketBranch;
  comment_count: number;
  task_count: number;
  author: { display_name: string };
}

export interface BitbucketBranch {
  commit: {
    hash: BitbucketCommitHash;
  };
  repository: {
    name: string;
    full_name: string;
  };
  branch: {
    name: string;
  }
}

type BitbucketPullRequestState = 'OPEN' | 'DECLINED' | 'MERGED';
type BitbucketCommitHash = string;

export interface BitbucketUser {
  display_name: string;
}

export interface BitBucketObjectLinks {
  self: BitBucketLink;
  html: BitBucketLink;
}

export interface BitBucketLink {
  href: string;
}

export interface BitbucketWorkspace {
  created_on: string;
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

export interface BitbucketPaginate<T> {
  pagelen: number;
  size: number;
  page: number;
  next: string;
  values: T[];
}

export interface BitbucketPullRequest {
  title: string;
  links: BitBucketObjectLinks;
  created_on: string;
  updated_on: string;
  state: BitbucketPullRequestState;
  source: BitbucketPullRequestBranch;
  destination: BitbucketPullRequestBranch;
  comment_count: number;
  task_count: number;
  author: { display_name: string };
}

export interface BitbucketPullRequestBranch {
  commit?: {
    hash: BitbucketCommitHash;
  };
  repository?: {
    name: string;
    full_name: string;
  };
  branch: {
    name: string;
  }
}

export interface BitbucketBranch {
  name: string;
  links: BitBucketObjectLinks;
  target: {
    hash: string;
    repository: {
      name: string;
      full_name: string;
    }
  }
}

type BitbucketPullRequestState = 'OPEN' | 'DECLINED' | 'MERGED';
type BitbucketCommitHash = string;

export interface BitbucketUser {
  display_name: string;
}

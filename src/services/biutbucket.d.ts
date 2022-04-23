interface BitbucketCredentials {
  username: string;
  password: string;
}

interface BitBucketObjectLinks {
  self: BitBucketLink;
  html: BitBucketLink;
}

interface BitBucketLink {
  href: string;
}

interface BitbucketRepository {
  project: string;
  repository: string;
}

interface Paginate<T> {
  pagelen: number;
  size: number;
  page: number;
  next: string;
  values: T[];
}

interface BitbucketPullRequest {
  title: string;
  links: BitBucketObjectLinks;
  created_on: Date;
  updated_on: Date;
  state: BitbucketPullRequestState;
  source: BitbucketBranch;
  destination: BitbucketBranch;
  comment_count: number;
  task_count: number;
  author: {display_name: string};
}

interface BitbucketBranch {
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

interface BitbucketGroupedPullRequest {
  source: string;
  destination: string;
  pullRequests: BitbucketPullRequest[];
  created_on: Date;
  updated_on: Date;
}

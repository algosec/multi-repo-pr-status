export interface GithubUser {
  login: string;
}

export interface GithubRepository {
  name: string;
  owner: GithubUser
}

export interface GithubPullRequest {
  title: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  comments: number;
  head: GithubPullRequestBranch;
  base: GithubPullRequestBranch;
  user: GithubUser;
}

export interface GithubPullRequestBranch {
  ref: string;
  sha: string;
  repo: GithubRepository;
}

import {
  Branch,
  Credentials,
  DataSource,
  DataSourceType,
  PullRequest,
  PullRequestBranch,
  Repository
} from "../DataSource";
import axios, {AxiosError} from "axios";
import {GithubPullRequest, GithubPullRequestBranch, GithubRepository, GithubUser} from "./github.model";

export class GithubDataSource implements DataSource {

  constructor(private cred: Credentials) {}

  async getBranches(repos: Repository[]): Promise<Branch[]> {
    return Promise.resolve([]);
  }

  async getPullRequests(repos: Repository[]): Promise<PullRequest[]> {
    const pullRequests = await this.fetchOpenPullRequests(repos);

    return pullRequests.map(x => {
      return {
        title: x.title,
        source: GithubDataSource.convertPullRequestBranch(x.head),
        destination: GithubDataSource.convertPullRequestBranch(x.base),
        author: x.user.login,
        created: x.created_at,
        updated: x.updated_at,
        link: x.html_url,
        commentsCount: x.comments,
      };
    });
  }

  private static convertPullRequestBranch(x: GithubPullRequestBranch): PullRequestBranch {
    return {
      name: x.ref,
      hash: x.sha,
      repository: {
        name: x.repo.name,
        title: x.repo.name,
        project: x.repo.owner.login,
      },
    };
  }

  async getRepositories(): Promise<Repository[]> {
    const list = await this.sendRequest<GithubRepository[]>(`https://api.github.com/user/repos`);

    return list.map(x => {
      return {
        title: x.name,
        project: x.owner.login,
        name: x.name,
      };
    });
  }

  getType(): DataSourceType {
    return "Github";
  }

  async validateCredentials(): Promise<string | null> {
    try {
      await this.fetchUser();
      return null;
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const status = (e as AxiosError)?.response?.status;
        if (status === 401) {
          return "Invalid credentials";
        }
        if (status === 403) {
          return "Access token missing permission. Recreate it again";
        }
      }
      return String(e);
    }
  }

  private async fetchUser(): Promise<GithubUser> {
    return this.sendRequest<GithubUser>(`https://api.github.com/user`);
  }

  private async sendRequest<T>(url: string): Promise<T> {
    console.debug(`REST CALL: ${url}`);
    const response = await axios.get<T>(url, {
      auth: this.cred
    });
    return response.data;
  }

  private async fetchOpenPullRequests(repositories: Repository[]): Promise<GithubPullRequest[]> {
    return await this.fetchInParallel<GithubPullRequest>(repositories.map(repo => `https://api.github.com/repos/${repo.project}/${repo.name}/pulls`));
  }

  private async fetchInParallel<T>(urls: string[]): Promise<T[]> {
    return Promise
      .all(urls.map(url => this.sendRequest<T[]>(url)))
      .then(value => value.flatMap(x => x));
  }

}

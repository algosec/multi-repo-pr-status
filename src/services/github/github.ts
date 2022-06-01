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
import {GithubBranch, GithubPullRequest, GithubPullRequestBranch, GithubRepository, GithubUser} from "./github.model";
import {parseNextUrl} from "./links-parser";

export class GithubDataSource implements DataSource {

  constructor(private cred: Credentials) {}

  async getBranches(repos: Repository[]): Promise<Branch[]> {
    return Promise
      .all(repos.map(x => this.loadBranchesOfRepo(x)))
      .then(value => value.flatMap(x => x));
  }

  private async loadBranchesOfRepo(repo: Repository): Promise<Branch[]> {
    const list = await this.fetchPaginatedItems<GithubBranch>(`https://api.github.com/repos/${repo.project}/${repo.name}/branches`);

    return list.map(x => {
      return {
        name: x.name,
        hash: x.commit.sha,
        link: `https://github.com/${repo.project}/${repo.name}/tree/${x.name}`,
        repository: {
          name: repo.name,
          title: repo.title,
          project: repo.project,
        }
      }
    })
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
    const list = (await this.sendRequest<GithubRepository[]>(`https://api.github.com/user/repos`)).data;

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
    return (await this.sendRequest<GithubUser>(`https://api.github.com/user`)).data;
  }

  private async sendRequest<T>(url: string): Promise<{data: T, nextUrl?: string}> {
    if (!this.cred) {
      throw Error("missing credentials");
    }

    console.debug(`REST CALL: ${url}`);
    const response = await axios.get<T>(url, {
      auth: this.cred
    });

    const data = response.data;
    const nextUrl = parseNextUrl(response.headers.link);

    return {data, nextUrl};
  }

  private async fetchOpenPullRequests(repositories: Repository[]): Promise<GithubPullRequest[]> {
    return await this.fetchInParallel<GithubPullRequest>(repositories.map(repo => `https://api.github.com/repos/${repo.project}/${repo.name}/pulls`));
  }

  private async fetchPaginatedItems<T>(url: string, perPage = 100): Promise<T[]> {
    const list: T[] = [];
    let currentUrl: string | undefined = `${url}?page=1&per_page=${perPage}`;

    while (currentUrl) {
      const {data, nextUrl}: {data: T[], nextUrl?: string} = await this.sendRequest<T[]>(currentUrl);

      list.push(...data);
      currentUrl = nextUrl;
    }

    return list;
  }

  private async fetchInParallel<T>(urls: string[]): Promise<T[]> {
    return Promise
      .all(urls.map(url => this.fetchPaginatedItems<T>(url)))
      .then(value => value.flatMap(x => x));
  }

}

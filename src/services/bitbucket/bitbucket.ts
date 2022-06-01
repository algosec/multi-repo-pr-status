import axios, {AxiosError} from "axios";
import {
  Branch,
  Credentials,
  DataSource,
  DataSourceType,
  PullRequest,
  PullRequestBranch,
  Repository
} from "../DataSource";
import {
  BitbucketPullRequest,
  BitbucketRepository, BitbucketUser, BitbucketWorkspace,
  Paginate, BitbucketBranch, BitbucketPullRequestBranch
} from "./bitbucket.model";

export class BitbucketDataSource implements DataSource {

  constructor(private cred: Credentials) {}

  public getType(): DataSourceType {
    return 'Bitbucket';
  }

  public async getPullRequests(repos: Repository[]): Promise<PullRequest[]> {
    const pullRequests = await this.fetchOpenPullRequests(repos);

    return pullRequests.map(x => {
      return {
        title: x.title,
        source: BitbucketDataSource.convertPullRequestBranch(x.source),
        destination: BitbucketDataSource.convertPullRequestBranch(x.destination),
        author: x.author.display_name,
        created: x.created_on,
        updated: x.updated_on,
        link: x.links.html.href,
        commentsCount: x.comment_count,
      };
    });
  }

  private static convertPullRequestBranch(x: BitbucketPullRequestBranch): PullRequestBranch {
    return {
      name: x.branch.name,
      hash: x.commit?.hash || 'unknown',
      repository: {
        name: x.repository.full_name.split("/")[1],
        title: x.repository.name,
        project: x.repository.full_name.split("/")[0]
      },
    };
  }

  public async getBranches(repos: Repository[]): Promise<Branch[]> {
    const branches = await this.fetchBranches(repos);
    return branches.map(x => {
      return {
        name: x.name,
        hash: x.target.hash,
        link: x.links.html.href,
        repository: {
          name: x.target.repository.full_name.split("/")[1],
          title: x.target.repository.name,
          project: x.target.repository.full_name.split("/")[0]
        },
      }
    });
  }

  public async getRepositories(): Promise<Repository[]> {
    const workspaces = await this.fetchWorkspaces();
    const repositories = await this.fetchRepositories(workspaces);

    return repositories.map(x => {
      return {
        title: x.name,
        project: x.workspace.slug,
        name: x.slug
      };
    });
  }

  public async validateCredentials(): Promise<string|null> {
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
          return "Application password missing permission. Recreate it again";
        }
      }
      return String(e);
    }
  }

  private async fetchUser(): Promise<BitbucketUser> {
    return this.sendRequest<BitbucketUser>(`https://api.bitbucket.org/2.0/user`);
  }

  private async fetchPaginatedItems<T>(url: string, pagelen = 50): Promise<T[]> {
    if (!this.cred) {
      throw Error("missing credentials");
    }

    const list: T[] = [];

    url = `${url}?pagelen=${pagelen}`;

    while (url != null) {
      const data = await this.sendRequest<Paginate<T>>(url);

      list.push(...data.values);
      url = data.next;
    }

    return list;
  }

  private async sendRequest<T>(url: string): Promise<T> {
    console.debug(`REST CALL: ${url}`);
    const response = await axios.get<T>(url, {
      auth: this.cred
    });
    return response.data;
  }

  private async fetchInParallel<T>(urls: string[], pagelen?: number): Promise<T[]> {
    const list: Promise<T[]>[] = [];

    for (const url of urls) {
      list.push(this.fetchPaginatedItems<T>(url, pagelen));
    }

    return Promise.all(list).then(value => value.flatMap(x => x));
  }

  private async fetchWorkspaces(): Promise<BitbucketWorkspace[]> {
    return this.fetchPaginatedItems<BitbucketWorkspace>(`https://api.bitbucket.org/2.0/workspaces`)
  }

  private async fetchRepositories(workspaces: BitbucketWorkspace[]): Promise<BitbucketRepository[]> {
    return this.fetchInParallel<BitbucketRepository>(workspaces.map(workspace => `https://api.bitbucket.org/2.0/repositories/${workspace.slug}`));
  }

  private async fetchOpenPullRequests(repositories: Repository[]): Promise<BitbucketPullRequest[]> {
    return await this.fetchInParallel<BitbucketPullRequest>(repositories.map(repo => `https://api.bitbucket.org/2.0/repositories/${repo.project}/${repo.name}/pullrequests`));
  }

  private async fetchBranches(repositories: Repository[]): Promise<BitbucketBranch[]> {
    return await this.fetchInParallel<BitbucketBranch>(repositories.map(repo => `https://api.bitbucket.org/2.0/repositories/${repo.project}/${repo.name}/refs/branches`), 100);
  }

}

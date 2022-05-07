import axios from "axios";
import {Credentials, DataSource, PullRequest, Repository} from "../DataSource";
import {DataSourceType} from "../DataSourceProvider";
import {
  BitbucketPullRequest,
  BitbucketRepository, BitbucketUser, BitbucketWorkspace,
  Paginate
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
        source: x.source.branch.name,
        destination: x.destination.branch.name,
        author: x.author.display_name,
        created: x.created_on,
        updated: x.updated_on,
        link: x.links.html.href,
        repository: {
          name: x.destination.repository.full_name.split("/")[1],
          title: x.destination.repository.name,
          project: x.destination.repository.full_name.split("/")[0]
        }
      };
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

  public async validateCredentials(): Promise<void> {
    console.log(await this.fetchUser());
    return; // TODO: fail in case of error
  }

  public async fetchUserDisplayName(): Promise<string> {
    return (await this.fetchUser()).display_name;
  }

  private async fetchUser(): Promise<BitbucketUser> {
    const url = `https://api.bitbucket.org/2.0/user`;
    const response = await axios.get<BitbucketUser>(url, {
      auth: this.cred
    });

    return response.data;
  }

  private async fetchPaginatedItems<T>(url: string): Promise<T[]> {
    if (!this.cred) {
      throw Error("missing credentials");
    }

    const list: T[] = [];

    url = `${url}?pagelen=50`;

    while (url != null) {
      console.log(`REST CALL: ${url}`);
      const response = await axios.get<Paginate<T>>(url, {
        auth: this.cred
      });

      const data: Paginate<T> = response.data;

      list.push(...data.values);
      url = data.next;
    }

    return list;
  }

  private async fetchInParallel<T>(urls: string[]): Promise<T[]> {
    const list: Promise<T[]>[] = [];

    for (const url of urls) {
      console.log(`Fetching ${url}`);
      list.push(this.fetchPaginatedItems<T>(url));
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

}
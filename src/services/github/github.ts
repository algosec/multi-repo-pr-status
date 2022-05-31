import {Branch, Credentials, DataSource, DataSourceType, PullRequest, Repository} from "../DataSource";
import axios, {AxiosError} from "axios";
import {BitbucketUser} from "../bitbucket/bitbucket.model";

export class GithubDataSource implements DataSource {

  constructor(private cred: Credentials) {}

  getBranches(repos: Repository[]): Promise<Branch[]> {
    return Promise.resolve([]);
  }

  getPullRequests(repos: Repository[]): Promise<PullRequest[]> {
    return Promise.resolve([]);
  }

  getRepositories(): Promise<Repository[]> {
    return Promise.resolve([]);
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

  private async fetchUser(): Promise<BitbucketUser> {
    return this.sendRequest<BitbucketUser>(`https://api.github.com/user`);
  }

  private async sendRequest<T>(url: string): Promise<T> {
    console.debug(`REST CALL: ${url}`);
    const response = await axios.get<T>(url, {
      auth: this.cred
    });
    return response.data;
  }

}

import {BitbucketDataSource} from "./bitbucket/bitbucket";
import {DataSource, DataSourceInfo} from "./DataSource";
import {GithubDataSource} from "./github/github";

export function generateDataSource(info: DataSourceInfo): DataSource {
  console.debug(`generate data source ${info.type}`);

  switch (info.type) {
    case "Bitbucket": return new BitbucketDataSource(info.credentials);
    case "Github": return new GithubDataSource(info.credentials);
    default: throw Error(`Unknown data source ${info.type}`);
  }
}

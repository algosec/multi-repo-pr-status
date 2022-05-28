import {BitbucketDataSource} from "./bitbucket/bitbucket";
import {Credentials, DataSource} from "./DataSource";

export type DataSourceType = 'Bitbucket';

export const DATA_SOURCE_TYPES: DataSourceType[] = ['Bitbucket'];

export interface DataSourceInfo {
  type: DataSourceType;
  credentials: Credentials;
}

export function generateDataSource(info: DataSourceInfo): DataSource {
  console.debug(`generate data source ${info.type}`);

  switch (info.type) {
    case "Bitbucket": return new BitbucketDataSource(info.credentials);
    default: throw Error(`Unknown data source ${info.type}`);
  }
}

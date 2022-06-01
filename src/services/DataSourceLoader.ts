import {DataSource, DataSourceInfo} from "./DataSource";
import {
  EMPTY_TIME,
  selectLastUpdate,
  updateData, selectIsDataWithLatestVersion
} from "../state/remoteData.slice";
import {store} from "../state/store";
import moment, {Moment} from "moment/moment";
import {generateDataSource} from "./DataSourceProvider";
import {groupPullRequests} from "./logic";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios, {AxiosError} from "axios";

const SYNC_INTERVAL_SECONDS = 15 * 60;


export class DataSourceLoader {

  private dataSource: DataSource;
  private interval: NodeJS.Timeout | null = null;
  private isLoading = false;

  constructor(dataSourceInfo: DataSourceInfo) {
    this.dataSource = generateDataSource(dataSourceInfo);
  }

  public init(): void {
    const lastUpdate: Moment = selectLastUpdate(store.getState());

    if (lastUpdate.isSame(EMPTY_TIME)) {
      console.debug(`first time sync`);
      this.reload();
      return;
    }

    if (!selectIsDataWithLatestVersion(store.getState())) {
      console.debug(`reloading since data is not latest version`);
      this.reload();
      return;
    }

    const secondsSinceLastUpdate = moment().diff(lastUpdate, 'seconds');

    if (secondsSinceLastUpdate >= SYNC_INTERVAL_SECONDS) {
      console.debug(`reloading (last updates is ${secondsSinceLastUpdate} seconds ago which is more than the threshold ${SYNC_INTERVAL_SECONDS})`);
      this.reload();
    } else {
      console.debug(`No need to reload (last updates is ${secondsSinceLastUpdate} seconds ago which is less than the threshold ${SYNC_INTERVAL_SECONDS})`);
      const remainingSeconds = SYNC_INTERVAL_SECONDS - secondsSinceLastUpdate;
      this.scheduleNextReload(remainingSeconds);
    }
  }

  public destroy(): void {
    this.clearNextSync();
  }

  private clearNextSync(): void {
    if (this.interval) {
      clearTimeout(this.interval);
    }
    this.interval = null;
  }

   public async reload(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    await toast.promise(this.execSync(), {
      pending: `Syncing with ${this.dataSource.getType()}. It may take a while depending on the amount of data`,
      success: `Sync with ${this.dataSource.getType()} has completed`,
      error: {
        render: ({data: err}) => DataSourceLoader.composeError(err)
      }
    });
  }

  private async execSync(): Promise<void> {
    this.isLoading = true;

    this.clearNextSync();

    const syncTitle = `Sync with ${this.dataSource.getType()}`;
    try {
      console.time(syncTitle);
      console.log(`${syncTitle} started`);
      const repositories = await this.dataSource.getRepositories();
      const pullRequests = await this.dataSource.getPullRequests(repositories);
      const branches = await this.dataSource.getBranches(repositories);

      console.log(`Pulled from ${this.dataSource.getType()}: ${repositories.length} repositories, ${pullRequests.length} pull-requests, ${branches.length} branches`);

      const data = groupPullRequests(pullRequests, branches);
      store.dispatch(updateData(data));
    } catch (err) {
      console.error(`${syncTitle} got error`, err);
      throw err;
    } finally {
      console.timeEnd(syncTitle);
      this.scheduleNextReload(SYNC_INTERVAL_SECONDS);
      this.isLoading = false;
    }
  }

  private static composeError(e: unknown) {
    if (axios.isAxiosError(e)) {
      const status = (e as AxiosError).response?.status;
      const message = (e as AxiosError).message;
      if (status === 401) {
        return "Credentials are no longer valid. Logout and login again";
      }
      if (status === 403) {
        return "Credentials are missing permissions. Recreate it again, and logout and login";
      }
      if (message === 'Network Error') {
        return "Sync was skipped as you're offline"
      }
    }
    return String(`An error occurred during sync - ${String(e)}`);
  }

  private scheduleNextReload(seconds: number): void {
    console.debug(`schdule next reload in ${seconds} seconds`);
    this.interval = setTimeout(() => this.reload(), seconds * 1000);
  }

}

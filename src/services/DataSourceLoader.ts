import {DataSource} from "./DataSource";
import {
  EMPTY_TIME,
  updateIsLoading,
  selectIsLoading,
  selectLastUpdate,
  updatePullRequests
} from "../state/remoteData.slice";
import {store} from "../state/store";
import moment, {Moment} from "moment/moment";
import {DataSourceInfo, generateDataSource} from "./DataSourceProvider";

const SYNC_INTERVAL_SECONDS = 15 * 60;


export class DataSourceLoader {

  private dataSource: DataSource;
  private interval: NodeJS.Timeout | null = null;

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
    if (selectIsLoading(store.getState())) {
      return;
    }

    store.dispatch(updateIsLoading(true));

    this.clearNextSync();

    const syncTitle = `Sync with ${this.dataSource.getType()}`;
    try {
      console.time(syncTitle);
      const repositories = await this.dataSource.getRepositories();
      const list = await this.dataSource.getPullRequests(repositories);
      store.dispatch(updatePullRequests(list));
    } catch (err) {
      console.error('Got error', err);
    } finally {
      console.timeEnd(syncTitle);
      this.scheduleNextReload(SYNC_INTERVAL_SECONDS);
      store.dispatch(updateIsLoading(false));
    }
  }

  private scheduleNextReload(seconds: number): void {
    console.debug(`schdule next reload in ${seconds} seconds`);
    this.interval = setTimeout(() => this.reload(), seconds * 1000);
  }

}

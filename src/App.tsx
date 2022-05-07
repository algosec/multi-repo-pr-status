import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSync, faCodePullRequest, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './App.css';
import useLocalStorage from "use-local-storage";
import {PullRequestsPage} from "./components/pull-requests/PullRequestsPage";
import {BrowserRouter, Link, Navigate, Route, Routes} from "react-router-dom";
import {AuthPanel} from "./components/auth/AuthPanel";
import {DataSource, GroupedPullRequest, PullRequest} from "./services/DataSource";
import {groupPullRequests} from "./services/logic";
import {DataSourceInfo, generateDataSource} from "./services/DataSourceProvider";
import moment from "moment";
import {ContributeLink} from "./components/ContributeLink";
import {DataSourceHeader} from "./components/DataSourceHeader";
import {InitialSyncIndicator} from "./components/InitialSyncIndicator";
import {SyncStatus} from "./components/pull-requests/SyncStatus";
import {Moment} from "moment/moment";

function App() {
  const [dataSourceInfo, setDataSourceInfo] = useLocalStorage<DataSourceInfo|undefined>('data-source', undefined);
  const dataSource = useMemo<DataSource|undefined>(() => dataSourceInfo && generateDataSource(dataSourceInfo), [dataSourceInfo]);

  function disconnect(): void {
    setDataSourceInfo(undefined);
    localStorage.clear();
  }

  return (
    <div className="App">
      <BrowserRouter>
        <header className="App-header">
          <Link to="/" className="App-header-title"><FontAwesomeIcon icon={faCodePullRequest} /> Multi-Repo PR Status</Link>
          <ContributeLink />
        </header>
        <div className="App-body">
          <Routes>
            <Route path="/auth" element={!dataSourceInfo ? <AuthPanel currentDataSourceInfo={dataSourceInfo} updateDataSourceInfo={x => setDataSourceInfo(x)}/> : <Navigate to="/" />} />
            <Route path="/*" element={dataSource && dataSourceInfo ? <AppWithDataSource dataSource={dataSource} dataSourceInfo={dataSourceInfo} disconnect={disconnect} /> : <Navigate to="/auth" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );

}

const momentSerializer = {
  serializer: (obj: Moment | undefined) => obj?.valueOf()?.toString() || "undefined",
  parser: (str: string) => str === "undefined" ? undefined : moment(parseInt(str)),
};

interface AppWithDataSourceProps {
  dataSource: DataSource;
  dataSourceInfo: DataSourceInfo;
  disconnect: () => void;
}

function AppWithDataSource(props: AppWithDataSourceProps) {
  const [lastUpdate, setLastUpdate] = useLocalStorage<Moment|undefined>('pull-requests-last-update', undefined, momentSerializer);
  const [pullRequests, setPullRequests] = useLocalStorage<PullRequest[]>('pull-requests', []);

  const groupedPullRequests: GroupedPullRequest[] = groupPullRequests(pullRequests);

  const [isLoading, setIsLoading] = useState(false);

  const sync: () => Promise<void> = useCallback(async () => {
    const syncTitle = `Sync with ${props.dataSource.getType()}`;
    try {
      console.time(syncTitle);
      console.groupCollapsed(syncTitle);
      const startDate = moment();
      const repositories = await props.dataSource.getRepositories();
      const list = await props.dataSource.getPullRequests(repositories);
      setPullRequests(list);
      setLastUpdate(startDate);
    } catch (err) {
      console.error('Got error', err);
    } finally {
      console.groupEnd();
      console.timeEnd(syncTitle);
      setIsLoading(false);
    }
  }, [props.dataSource, setLastUpdate, setPullRequests]);

  const triggerSync: () => Promise<void> = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => sync(), 1);
  }, [isLoading, sync]);


  useEffect(() => {
    if (!lastUpdate) {
      triggerSync();
    }
  }, [props.dataSourceInfo, lastUpdate, triggerSync]);


  if (!lastUpdate) {
    return <InitialSyncIndicator />;
  }

  return (
    <div>
      <div className="Sub-header">
        <div>
          <DataSourceHeader dataSourceInfo={props.dataSourceInfo} /> (<SyncStatus key={lastUpdate.valueOf()} lastUpdate={lastUpdate} isSyncing={isLoading} triggerSync={() => triggerSync()} />)
        </div>
        <div>
          <button onClick={triggerSync} className="link-button"><FontAwesomeIcon icon={faSync} spin={isLoading}/> Sync</button>
          <button className="link-button margin-left" onClick={() => props.disconnect()}><FontAwesomeIcon icon={faRightFromBracket}/> Disconnect</button>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<PullRequestsPage groupedPullRequests={groupedPullRequests} />} />
      </Routes>
    </div>
  );
}

export default App;

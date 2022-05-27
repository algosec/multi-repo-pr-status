import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSync, faCodePullRequest, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './App.css';
import {PullRequestsPage} from "./components/pull-requests/PullRequestsPage";
import {Link, Navigate, Route, Routes} from "react-router-dom";
import {DataSource} from "./services/DataSource";
import {DataSourceInfo, generateDataSource} from "./services/DataSourceProvider";
import {ContributeLink} from "./components/ContributeLink";
import {DataSourceHeader} from "./components/DataSourceHeader";
import {InitialSyncIndicator} from "./components/InitialSyncIndicator";
import {SyncStatus} from "./components/pull-requests/SyncStatus";
import {Moment} from "moment/moment";
import {HomePage} from "./components/home/HomePage";
import {clearStore, useAppDispatch, useAppSelector} from "./state/store";
import {hasDataSourceInfo, selectDataSourceInfo} from "./state/dataSourceInfo.slice";
import {EMPTY_TIME, selectLastUpdate, updatePullRequests} from "./state/remoteData.slice";

function App() {

  const isConnected = useAppSelector<boolean>(hasDataSourceInfo);

  const homepage = useMemo(() => !isConnected ? <HomePage /> : <Navigate to="/" />, [isConnected]);
  const appWithDataSource = useMemo(() => isConnected ? <AppWithDataSource /> : <Navigate to="/home" />,[isConnected]);

  return (
    <div>
      <header className="App-header">
        <Link to="/" className="App-header-title"><FontAwesomeIcon icon={faCodePullRequest} /> Multi-Repo PR Status</Link>
        <ContributeLink />
      </header>
      <div className="App-body">
        <Routes>
          <Route path="/home" element={homepage} />
          <Route path="*" element={appWithDataSource} />
        </Routes>
      </div>
    </div>
  );
}

function AppWithDataSource() {

  const dispatch = useAppDispatch();

  const dataSourceInfo = useAppSelector<DataSourceInfo>(selectDataSourceInfo);
  const dataSource = useMemo<DataSource>(() => generateDataSource(dataSourceInfo), [dataSourceInfo]);

  const lastUpdate = useAppSelector<Moment>(selectLastUpdate);

  const [isLoading, setIsLoading] = useState(false);

  const sync: () => Promise<void> = useCallback(async () => {
    const syncTitle = `Sync with ${dataSource.getType()}`;
    try {
      console.time(syncTitle);
      console.groupCollapsed(syncTitle);
      const repositories = await dataSource.getRepositories();
      const list = await dataSource.getPullRequests(repositories);
      dispatch(updatePullRequests(list));
    } catch (err) {
      console.error('Got error', err);
    } finally {
      console.groupEnd();
      console.timeEnd(syncTitle);
      setIsLoading(false);
    }
  }, [dataSource, dispatch]);

  const triggerSync: () => Promise<void> = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => sync(), 1);
  }, [isLoading, sync]);

  useEffect(() => {
    if (lastUpdate.isSame(EMPTY_TIME)) {
      triggerSync();
    }
  }, [lastUpdate, triggerSync]);

  if (lastUpdate.isSame(EMPTY_TIME)) {
    return <InitialSyncIndicator />;
  }

  return (
    <div>
      <div className="Sub-header">
        <div>
          <DataSourceHeader dataSourceInfo={dataSourceInfo} /> (<SyncStatus lastUpdate={lastUpdate} />)
        </div>
        <div className="align-right">
          <button onClick={triggerSync} className="link-button"><FontAwesomeIcon icon={faSync} spin={isLoading}/> Sync</button>
          <button className="link-button margin-left" onClick={clearStore}><FontAwesomeIcon icon={faRightFromBracket}/> Disconnect</button>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<PullRequestsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

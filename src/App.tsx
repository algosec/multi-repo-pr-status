import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSync, faCodePullRequest, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import React, {useCallback, useEffect, useMemo} from 'react';
import './App.css';
import {PullRequestsPage} from "./components/pull-requests/PullRequestsPage";
import {Link, Navigate, Route, Routes} from "react-router-dom";
import {DataSourceInfo} from "./services/DataSourceProvider";
import {ContributeLink} from "./components/ContributeLink";
import {DataSourceHeader} from "./components/DataSourceHeader";
import {InitialSyncIndicator} from "./components/InitialSyncIndicator";
import {SyncStatus} from "./components/pull-requests/SyncStatus";
import {Moment} from "moment/moment";
import {HomePage} from "./components/home/HomePage";
import {clearStore, useAppSelector} from "./state/store";
import {hasDataSourceInfo, selectDataSourceInfo} from "./state/dataSourceInfo.slice";
import {
  EMPTY_TIME, selectIsDataWithLatestVersion,
  selectIsLoading,
  selectLastUpdate
} from "./state/remoteData.slice";
import {DataSourceLoader} from "./services/DataSourceLoader";

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

  const dataSourceInfo = useAppSelector<DataSourceInfo>(selectDataSourceInfo);
  const dataSourceLoader = useMemo<DataSourceLoader>(() => new DataSourceLoader(dataSourceInfo), [dataSourceInfo]);

  const isDataWithLatestVersion = useAppSelector<boolean>(selectIsDataWithLatestVersion);

  const lastUpdate = useAppSelector<Moment>(selectLastUpdate);
  const isLoading = useAppSelector<boolean>(selectIsLoading);

  const triggerSync = useCallback(() => dataSourceLoader.reload(), [dataSourceLoader]);

  useEffect(() => {
    dataSourceLoader.init();
    return () => dataSourceLoader.destroy()
  }, [dataSourceLoader]);

  if (lastUpdate.isSame(EMPTY_TIME) || !isDataWithLatestVersion) {
    return <InitialSyncIndicator isLoading={isLoading} />;
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

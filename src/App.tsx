import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSync, faCodePullRequest, faKey} from '@fortawesome/free-solid-svg-icons';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import React, {useState} from 'react';
import './App.css';
import {fetchOpenPullRequestsMultiRepo, groupPullRequests} from "./services/bitbucket";
import useLocalStorage from "use-local-storage";
import {PullRequestsPage} from "./components/pull-requests/PullRequestsPage";
import {BrowserRouter, Link, Navigate, Route, Routes} from "react-router-dom";
import {AuthPage} from "./components/auth/AuthPage";

function App() {
  // Currently, the settings must be provided by the user by manually set the local storage
  // in the future, we would like to have it via GUI
  const [settings] = useLocalStorage<Settings|null>('settings', null);

  const auth = settings?.auth;

  const [pullRequests, setPullRequests] = useLocalStorage<BitbucketPullRequest[]>('pull-requests', []);
  const groupedPullRequests: BitbucketGroupedPullRequest[] = groupPullRequests(pullRequests);

  const [isLoading, setIsLoading] = useState(false);

  async function sync() {
    if (isLoading) {
      return;
    }
    if (!auth) {
      console.warn('Settings are missing. Set them and re-run.');
      return;
    }

    setIsLoading(true);
    try {
      let list = await fetchOpenPullRequestsMultiRepo(auth, settings.repositories);
      setPullRequests(list);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <header className="App-header">
          <div className="App-header-title">
            <Link to="/"><FontAwesomeIcon icon={faCodePullRequest} /> Multi-Repo PR Status</Link>
            <br />
            <a href="https://github.com/algosec/multi-repo-pr-status" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faGithub} /> GitHub repo</a>
          </div>
          { auth &&
            <div className="App-header-buttons">
              <button onClick={sync}><FontAwesomeIcon icon={faSync} spin={isLoading}/> Sync</button>
              <Link to="/auth"><FontAwesomeIcon icon={faKey}/> Authentication</Link>
            </div>
          }
        </header>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={auth ? <PullRequestsPage groupedPullRequests={groupedPullRequests} /> : <Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

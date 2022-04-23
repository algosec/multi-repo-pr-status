import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSync, faCodePullRequest} from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react';
import './App.css';
import {fetchOpenPullRequestsMultiRepo, groupPullRequests} from "./services/bitbucket";
import useLocalStorage from "use-local-storage";
import {PullRequest} from "./components/PullRequest";

function App() {
  // Currently, the settings must be provided by the user by manually set the local storage
  // in the future, we would like to have it via GUI
  const [settings] = useLocalStorage<Settings|null>('settings', null);

  const [pullRequests, setPullRequests] = useLocalStorage<BitbucketPullRequest[]>('pull-requests', []);
  const groupedPullRequests: BitbucketGroupedPullRequest[] = groupPullRequests(pullRequests);

  const [searchFilter, setSearchFilter] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function sync() {
    if (isLoading) {
      return;
    }
    if (!settings) {
      console.warn('Settings are missing. Set them and re-run.');
      return;
    }

    setIsLoading(true);
    try {
      let list = await fetchOpenPullRequestsMultiRepo(settings.auth, settings.repositories);
      setPullRequests(list);
    } finally {
      setIsLoading(false);
    }
  }

  function isInFilter(item: BitbucketGroupedPullRequest) {
    return searchFilter === '' || item.source.includes(searchFilter) || item.source.includes(searchFilter);
  }

  let appBody;
  if (groupedPullRequests.length > 0) {
    appBody = groupedPullRequests
      .filter(item => isInFilter(item))
      .map(item => (
      <PullRequest key={`${item.source}__${item.destination}`} data={item}/>
    ));
  } else {
    appBody = 'No information available';
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-header-title">
          <FontAwesomeIcon icon={faCodePullRequest} /> Multi-Repo PR Status
        </div>
        <div className="App-header-buttons">
          <button onClick={sync}><FontAwesomeIcon icon={faSync} spin={isLoading} /> Sync</button>
        </div>
      </header>
      <div className="App-body">
        <input placeholder="Search..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
        {appBody}
      </div>
    </div>
  );
}

export default App;

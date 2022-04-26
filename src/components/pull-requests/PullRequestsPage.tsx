import React, {useState} from "react";
import {PullRequestItem} from "./PullRequestItem";
import './PullRequestsPage.css';

interface PullRequestPanelProps {
  groupedPullRequests: BitbucketGroupedPullRequest[];
}

export function PullRequestsPage(props: PullRequestPanelProps) {

  const [searchFilter, setSearchFilter] = useState("");

  function isInFilter(item: BitbucketGroupedPullRequest) {
    return searchFilter === '' || item.source.includes(searchFilter) || item.source.includes(searchFilter);
  }

  let appBody;
  if (props.groupedPullRequests.length > 0) {
    appBody = props.groupedPullRequests
      .filter(item => isInFilter(item))
      .map(item => (
        <PullRequestItem key={`${item.source}__${item.destination}`} data={item}/>
      ));
  } else {
    appBody = 'No information available';
  }

  return (
    <div>
      <input placeholder="Search..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
      {appBody}
    </div>
  );
}

import React, {useState} from "react";
import {PullRequestItem} from "./PullRequestItem";
import './PullRequestsPage.css';
import {GroupedPullRequest} from "../../services/DataSource";

interface PullRequestPanelProps {
  groupedPullRequests: GroupedPullRequest[];
}

export function PullRequestsPage(props: PullRequestPanelProps) {

  const [searchFilter, setSearchFilter] = useState("");

  function isInFilter(item: GroupedPullRequest) {
    return searchFilter === '' || item.source.includes(searchFilter) || item.source.includes(searchFilter);
  }

  if (props.groupedPullRequests.length === 0) {
    return <div>No information available</div>;
  }

  return <div>
    <input placeholder={`Search ${props.groupedPullRequests.length} items...`} value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
    {props.groupedPullRequests
      .filter(item => isInFilter(item))
      .map(item => (
        <PullRequestItem key={`${item.source}__${item.destination}`} data={item}/>
      ))}
  </div>
}

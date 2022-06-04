import React from "react";
import {PullRequestItem} from "./PullRequestItem";
import './PullRequestsPage.css';
import { MultiSelect } from "react-multi-select-component";
import {
  OVERRIDE_STRINGS_AUTHOR,
  OVERRIDE_STRINGS_PROJECT,
  OVERRIDE_STRINGS_REPOSITORY,
  usePullRequestsPage
} from "./PullRequestsPage.logic";

export function PullRequestsPage() {

  const {
    groupedPullRequests,
    searchFilter, updateSearchFilter,
    projectList, projectFilter, setProjectFilter,
    repositoryList, repositoryFilter, setRepositoryFilter,
    authorsList, authorFilter, setAuthorFilter,
    itemsInFilters,
    noDataMessage,
  } = usePullRequestsPage();

  return <div>
    <div className="filters">
      <input placeholder={`Search ${groupedPullRequests.length} items...`} value={searchFilter} onChange={updateSearchFilter}  className="search-filter"/>
      <MultiSelect
        options={projectList}
        value={projectFilter}
        onChange={setProjectFilter}
        labelledBy="project-filter"
        hasSelectAll={false}
        overrideStrings={OVERRIDE_STRINGS_PROJECT}
        className="filter-multi-select"
      />
      <MultiSelect
        options={repositoryList}
        value={repositoryFilter}
        onChange={setRepositoryFilter}
        labelledBy="repository-filter"
        hasSelectAll={false}
        overrideStrings={OVERRIDE_STRINGS_REPOSITORY}
        className="filter-multi-select"
      />
      <MultiSelect
        options={authorsList}
        value={authorFilter}
        onChange={setAuthorFilter}
        labelledBy="author-filter"
        hasSelectAll={false}
        overrideStrings={OVERRIDE_STRINGS_AUTHOR}
        className="filter-multi-select"
      />
    </div>
    {groupedPullRequests.map(item => <div key={item.id} className={!itemsInFilters.has(item.id) ? 'hidden' : ''}>
      <PullRequestItem data={item} />
    </div>)}
    {noDataMessage}
  </div>
}
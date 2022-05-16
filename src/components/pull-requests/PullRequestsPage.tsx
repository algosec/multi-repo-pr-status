import React from "react";
import {PullRequestItem} from "./PullRequestItem";
import './PullRequestsPage.css';
import {GroupedPullRequest} from "../../services/DataSource";
import { MultiSelect } from "react-multi-select-component";
import useLocalStorage from "use-local-storage";

interface PullRequestPanelProps {
  groupedPullRequests: GroupedPullRequest[];
}

export function PullRequestsPage(props: PullRequestPanelProps) {

  // free text filter
  const [searchFilter, setSearchFilter] = useLocalStorage("filter-free-text", "");

  // project multi-select filter
  const [projectFilter, setProjectFilter] = useLocalStorage<Option[]>("filter-project", []);
  const selectedProject = projectFilter.map(x => x.value);
  const projectList: Option[] = extractProjects(props.groupedPullRequests)
    .map(x => {return {label: x, value: x}});

  // repository multi-select filter
  const [repositoryFilter, setRepositoryFilter] = useLocalStorage<Option[]>("filter-repository", []);
  const selectedRepository = repositoryFilter.map(x => x.value);
  const repositoryList: Option[] = extractRepositories(props.groupedPullRequests, selectedProject)
    .map(x => {return {label: x, value: x}});

  // author multi-select filter
  const [authorFilter, setAuthorFilter] = useLocalStorage<Option[]>("filter-author", []);
  const selectedAuthors = authorFilter.map(x => x.value);
  const authorsList: Option[] = extractAuthors(props.groupedPullRequests)
    .map(x => {return {label: x, value: x}});

  function isInFilter(item: GroupedPullRequest): boolean {
    const textFilterResult: boolean = searchFilter === '' || item.source.includes(searchFilter) || item.source.includes(searchFilter);
    const authorFilterResult: boolean = selectedAuthors.length === 0 || item.pullRequests.some(x => selectedAuthors.includes(x.author));
    const projectFilterResult: boolean = selectedProject.length === 0 || item.pullRequests.some(x => selectedProject.includes(x.repository.project));
    const repositoryFilterResult: boolean = selectedRepository.length === 0 || item.pullRequests.some(x => selectedRepository.includes(x.repository.name));

    return textFilterResult
      && authorFilterResult
      && projectFilterResult
      && repositoryFilterResult
    ;
  }

  if (props.groupedPullRequests.length === 0) {
    return <div>No information available</div>;
  }

  return <div>
    <div className="filters">
      <input placeholder={`Search ${props.groupedPullRequests.length} items...`} value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}  className="search-filter"/>
      <MultiSelect
        options={projectList}
        value={projectFilter}
        onChange={setProjectFilter}
        labelledBy="project-filter"
        hasSelectAll={false}
        overrideStrings={{"selectSomeItems": "Search project"}}
        className="filter-multi-select"
      />
      <MultiSelect
        options={repositoryList}
        value={repositoryFilter}
        onChange={setRepositoryFilter}
        labelledBy="repository-filter"
        hasSelectAll={false}
        overrideStrings={{"selectSomeItems": "Search repository"}}
        className="filter-multi-select"
      />
      <MultiSelect
        options={authorsList}
        value={authorFilter}
        onChange={setAuthorFilter}
        labelledBy="author-filter"
        hasSelectAll={false}
        overrideStrings={{"selectSomeItems": "Search author"}}
        className="filter-multi-select"
      />
    </div>
    {props.groupedPullRequests
      .filter(item => isInFilter(item))
      .map(item => (
        <PullRequestItem key={`${item.source}__${item.destination}`} data={item}/>
      ))}
  </div>
}

function extractAuthors(groupedPullRequests: GroupedPullRequest[]): string[] {
  const list = groupedPullRequests.flatMap(x => x.pullRequests.map(y => y.author));
  return Array.from(new Set(list)); // make sure items are unique
}

function extractRepositories(groupedPullRequests: GroupedPullRequest[], selectedProjects: string[]): string[] {
  const list = groupedPullRequests.flatMap(x => x.pullRequests
    .filter(y => selectedProjects.length === 0 || selectedProjects.includes(y.repository.project))
    .map(y => y.repository.name)
  );
  return Array.from(new Set(list)); // make sure items are unique
}

function extractProjects(groupedPullRequests: GroupedPullRequest[]): string[] {
  const list = groupedPullRequests.flatMap(x => x.pullRequests.map(y => y.repository.project));
  return Array.from(new Set(list)); // make sure items are unique
}

// this interface belongs to "react-multi-select-component",
// however, it's not exported, so had to paste it here.
interface Option {
  value: string;
  label: string;
  key?: string;
  disabled?: boolean;
}
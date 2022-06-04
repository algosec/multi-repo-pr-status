import {ChangeEvent, useCallback, useMemo} from "react";
import './PullRequestsPage.css';
import {GroupedPullRequest} from "../../services/DataSource";
import {useAppDispatch, useAppSelector} from "../../state/store";
import {selectData} from "../../state/remoteData.slice";
import {
  Option,
  selectAuthorsFilter, selectFreeTextFilter,
  selectProjectsFilter,
  selectRepositoriesFilter, updateAuthorsFilter, updateFreeTextFilter,
  updateProjectsFilter, updateRepositoriesFilter
} from "../../state/filters.slice";

export const OVERRIDE_STRINGS_PROJECT = {"selectSomeItems": "Search project"};
export const OVERRIDE_STRINGS_AUTHOR = {"selectSomeItems": "Search author"};
export const OVERRIDE_STRINGS_REPOSITORY = {"selectSomeItems": "Search repository"};

export function usePullRequestsPage() {

  const dispatch = useAppDispatch();

  const groupedPullRequests = useAppSelector<GroupedPullRequest[]>(selectData);

  // free text filter
  const searchFilter = useAppSelector<string>(selectFreeTextFilter);
  const setSearchFilter = useCallback((x: string) => dispatch(updateFreeTextFilter(x)), [dispatch]);

  // project multi-select filter
  const projectFilter = useAppSelector<Option[]>(selectProjectsFilter);
  const setProjectFilter = useCallback((x: Option[]) => dispatch(updateProjectsFilter(x)), [dispatch]);
  const selectedProject = projectFilter.map(x => x.value);
  const projectList: Option[] = extractProjects(groupedPullRequests)
    .map(x => {return {label: x, value: x}});

  // repository multi-select filter
  const repositoryFilter = useAppSelector<Option[]>(selectRepositoriesFilter);
  const setRepositoryFilter = useCallback((x: Option[])  => dispatch(updateRepositoriesFilter(x)), [dispatch]);
  const selectedRepository = repositoryFilter.map(x => x.value);
  const repositoryList: Option[] = extractRepositories(groupedPullRequests, selectedProject)
    .map(x => {return {label: x, value: x}});

  // author multi-select filter
  const authorFilter = useAppSelector<Option[]>(selectAuthorsFilter);
  const setAuthorFilter = useCallback((x: Option[])  => dispatch(updateAuthorsFilter(x)), [dispatch]);
  const selectedAuthors = authorFilter.map(x => x.value);
  const authorsList: Option[] = extractAuthors(groupedPullRequests)
    .map(x => {return {label: x, value: x}});


  const updateSearchFilter = useCallback((e: ChangeEvent<HTMLInputElement>) => setSearchFilter(e.target.value), [setSearchFilter]);

  const isInFilter = useCallback((item: GroupedPullRequest): boolean => {
    const textFilterResult: boolean = searchFilter === '' || item.source.includes(searchFilter) || item.destination.includes(searchFilter) || item.pullRequests.some(pr => pr.title.includes(searchFilter));
    const authorFilterResult: boolean = selectedAuthors.length === 0 || item.pullRequests.some(x => selectedAuthors.includes(x.author));
    const projectFilterResult: boolean = selectedProject.length === 0 || item.pullRequests.some(x => selectedProject.includes(x.destination.repository.project));
    const repositoryFilterResult: boolean = selectedRepository.length === 0 || item.pullRequests.some(x => selectedRepository.includes(x.destination.repository.name));

    return textFilterResult
      && authorFilterResult
      && projectFilterResult
      && repositoryFilterResult
    ;
  }, [searchFilter, selectedAuthors, selectedProject, selectedRepository]);

  const itemsInFilters = useMemo<Set<string>>(() => new Set<string>(groupedPullRequests.filter(item => isInFilter(item)).map(x => x.id)), [groupedPullRequests, isInFilter]);

  const noDataMessage = useMemo<string>(() => {
    if (groupedPullRequests.length === 0) {
      return 'No data is available';
    } else if (itemsInFilters.size === 0) {
      return 'Filters has no results'
    } else {
      return '';
    }
  }, [groupedPullRequests, itemsInFilters]);

  return {
    groupedPullRequests,
    searchFilter, updateSearchFilter,
    projectList, projectFilter, setProjectFilter,
    repositoryList, repositoryFilter, setRepositoryFilter,
    authorsList, authorFilter, setAuthorFilter,
    itemsInFilters,
    noDataMessage,
  };
}

function extractAuthors(groupedPullRequests: GroupedPullRequest[]): string[] {
  const list = groupedPullRequests.flatMap(x => x.pullRequests.map(y => y.author));
  return Array.from(new Set(list)); // make sure items are unique
}

function extractRepositories(groupedPullRequests: GroupedPullRequest[], selectedProjects: string[]): string[] {
  const list = groupedPullRequests.flatMap(x => x.pullRequests
    .filter(y => selectedProjects.length === 0 || selectedProjects.includes(y.destination.repository.project))
    .map(y => y.destination.repository.name)
  );
  return Array.from(new Set(list)); // make sure items are unique
}

function extractProjects(groupedPullRequests: GroupedPullRequest[]): string[] {
  const list = groupedPullRequests.flatMap(x => x.pullRequests.map(y => y.destination.repository.project));
  return Array.from(new Set(list)); // make sure items are unique
}

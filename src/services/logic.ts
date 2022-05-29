import moment from "moment";
import {Branch, GroupedPullRequest, PullRequest, Repository} from "./DataSource";

export function groupPullRequests(pullRequests: PullRequest[], branches: Branch[]): GroupedPullRequest[] {
  const branchesMap: Map<string, Branch[]> = new Map<string, Branch[]>();

  const list: GroupedPullRequest[] = [];
  const map: Map<string, GroupedPullRequest> = new Map<string, GroupedPullRequest>();

  branches.forEach(branch => {
    let list = branchesMap.get(branch.name);
    if (!list) {
      list = [];
      branchesMap.set(branch.name, list);
    }
    list.push(branch);
  });

  pullRequests.forEach(pullRequest => {
    const source = pullRequest.source;
    const dest = pullRequest.destination;
    const key = `${source}__${dest}`;

    let groupedPullRequests = map.get(key);
    if (!groupedPullRequests) {
      groupedPullRequests = {
        source: source,
        destination: dest,
        created: pullRequest.created,
        updated: pullRequest.updated,
        pullRequests: [pullRequest],
        sourceBranchesWithoutPullRequest: []
      };
      map.set(key, groupedPullRequests);
      list.push(groupedPullRequests);
    } else {
      groupedPullRequests.pullRequests.push(pullRequest);
      groupedPullRequests.created = moment(groupedPullRequests.created).isBefore(moment(pullRequest.created)) ? groupedPullRequests.created : pullRequest.created;
      groupedPullRequests.updated = moment(groupedPullRequests.updated).isAfter(pullRequest.updated) ? groupedPullRequests.updated : pullRequest.updated;
    }
  });

  list.forEach(groupedPullRequests => {
    const allBranches = branchesMap.get(groupedPullRequests.source);
    if (!allBranches) {
      return;
    }

    const repositoriesWithPr: Repository[] = groupedPullRequests.pullRequests.map(x => x.repository);
    const repositoriesWithoutPR = allBranches.filter(branch => !repositoriesWithPr.some(repo => repo.name === branch.repository.name));

    groupedPullRequests.sourceBranchesWithoutPullRequest.push(...repositoriesWithoutPR);
  })

  return list;
}

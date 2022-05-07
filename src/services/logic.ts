import moment from "moment";
import {GroupedPullRequest, PullRequest} from "./DataSource";

export function groupPullRequests(pullRequests: PullRequest[]): GroupedPullRequest[] {
  const list: GroupedPullRequest[] = [];
  const map: Map<string, GroupedPullRequest> = new Map<string, GroupedPullRequest>()

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
        pullRequests: [pullRequest]
      };
      map.set(key, groupedPullRequests);
      list.push(groupedPullRequests);
    } else {
      groupedPullRequests.pullRequests.push(pullRequest);
      groupedPullRequests.created = moment.min(moment(groupedPullRequests.created), moment(pullRequest.created)).toDate();
      groupedPullRequests.updated = moment.max(moment(groupedPullRequests.updated), moment(pullRequest.updated)).toDate();
    }
  })

  return list;
}

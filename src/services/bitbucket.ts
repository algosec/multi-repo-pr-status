import axios from "axios";
import moment from "moment";

export async function fetchOpenPullRequests(cred: BitbucketCredentials, project: string, repository: string): Promise<BitbucketPullRequest[]> {
  const list: BitbucketPullRequest[] = [];

  let url = `https://api.bitbucket.org/2.0/repositories/${project}/${repository}/pullrequests`;

  while (url != null) {
    console.log(`REST CALL: ${url}`);
    const response = await axios.get<Paginate<BitbucketPullRequest>>(url, {
      auth: cred
    });

    const data: Paginate<BitbucketPullRequest> = response.data;

    list.push(...data.values);
    url = data.next;
  }

  return list;
}

export async function fetchOpenPullRequestsMultiRepo(cred: BitbucketCredentials, repositories: BitbucketRepository[]): Promise<BitbucketPullRequest[]> {
  const list: BitbucketPullRequest[] = [];

  for (const repo of repositories) {
    console.log(`Fetching ${repo.project}/${repo.repository}`);
    list.push(...await fetchOpenPullRequests(cred, repo.project, repo.repository));
  }

  return list;
}

export function groupPullRequests(pullRequests: BitbucketPullRequest[]): BitbucketGroupedPullRequest[] {
  const list: BitbucketGroupedPullRequest[] = [];
  const map: Map<string, BitbucketGroupedPullRequest> = new Map<string, BitbucketGroupedPullRequest>()

  pullRequests.forEach(pullRequest => {
    const source = pullRequest.source.branch.name;
    const dest = pullRequest.destination.branch.name;
    const key = `${source}__${dest}`;

    let groupedPullRequests = map.get(key);
    if (!groupedPullRequests) {
      groupedPullRequests = {
        source: source,
        destination: dest,
        created_on: pullRequest.created_on,
        updated_on: pullRequest.updated_on,
        pullRequests: [pullRequest]
      };
      map.set(key, groupedPullRequests);
      list.push(groupedPullRequests);
    } else {
      groupedPullRequests.pullRequests.push(pullRequest);
      groupedPullRequests.created_on = moment.min(moment(groupedPullRequests.created_on), moment(pullRequest.created_on)).toDate();
      groupedPullRequests.updated_on = moment.max(moment(groupedPullRequests.updated_on), moment(pullRequest.updated_on)).toDate();
    }
  })

  return list;
}

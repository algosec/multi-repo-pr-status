import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faClock, faCodeBranch, faUser, faComments} from "@fortawesome/free-solid-svg-icons";
import {faGitAlt, } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import './PullRequestsItem.css';
import moment from "moment";
import {GroupedPullRequest} from "../../services/DataSource";

interface PullRequestProps {
  data: GroupedPullRequest;
}

export function PullRequestItem(props: PullRequestProps) {


  function getActivityColor(date: string): string {
    const diff =  moment().diff(moment(date), 'days');
    if (diff < 7) {
      return "active";
    } else if (diff < 25) {
      return "semi-active";
    } else {
      return "inactive";
    }
  }

  function getFirstLine(str: string): string  {
    return str.split('\n')[0];
  }

  return (
    <div className="PullRequest">
      <div className="row">
        <div>
          <span className="box branch-box"><FontAwesomeIcon icon={faCodeBranch} /> {props.data.source}</span>
          <FontAwesomeIcon icon={faArrowRight} className="pr-arrow" />
          <span className="box branch-box"><FontAwesomeIcon icon={faCodeBranch} /> {props.data.destination}</span>
        </div>
        <div className={`date ${getActivityColor(props.data.updated)}`} title={moment(props.data.updated).format("LLLL")}>
          <FontAwesomeIcon icon={faClock} /> Last update {moment(props.data.updated).fromNow()}
        </div>
        <div className={`date ${getActivityColor(props.data.created)}`} title={moment(props.data.created).format("LLLL")}>
          <FontAwesomeIcon icon={faClock} /> Created {moment(props.data.created).fromNow()}
        </div>
      </div>
      {props.data.pullRequests.map(item => (
        <div key={`${item.source.repository.project}:${item.source.repository.name}`} className="row">
          <div>
            <a href={item.link} target="_blank" rel="noreferrer" className="box repo-box">
              <FontAwesomeIcon icon={faGitAlt} /> {item.destination.repository.name}
            </a>
            <span title={item.title}>{getFirstLine(item.title)}</span>
          </div>
          <div>
            <FontAwesomeIcon icon={faUser} /> {item.author}
          </div>
          <div className="comments-count">
            <FontAwesomeIcon icon={faComments} /> {item.commentsCount}
          </div>
          <div className={`date ${getActivityColor(item.updated)}`} title={moment(item.updated).format("LLLL")}>
            <FontAwesomeIcon icon={faClock} /> Last update {moment(item.updated).fromNow()}
          </div>
          <div className={`date ${getActivityColor(item.created)}`} title={moment(item.created).format("LLLL")}>
            <FontAwesomeIcon icon={faClock} /> Created {moment(item.created).fromNow()}
          </div>
        </div>
      ))}
      {props.data.sourceBranchesWithoutPullRequest.length > 0 && <div className="row">
        <div>
          Source branch <span className="box branch-box"><FontAwesomeIcon icon={faCodeBranch} /> {props.data.source}</span> exists <b>without</b> open pull-request for
          &nbsp;
          {props.data.sourceBranchesWithoutPullRequest.map(item => <a key={item.repository.name} href={item.link} target="_blank" rel="noreferrer" className="box repo-box">
            <FontAwesomeIcon icon={faGitAlt} /> {item.repository.name}
          </a>)}
        </div>
      </div>}
    </div>
  );
}

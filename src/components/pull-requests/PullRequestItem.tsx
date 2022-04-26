import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faClock, faCodeBranch, faUser} from "@fortawesome/free-solid-svg-icons";
import {faGitAlt, } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import './PullRequestsItem.css';
import moment from "moment";

interface PullRequestProps {
  data: BitbucketGroupedPullRequest;
}

export function PullRequestItem(props: PullRequestProps) {


  function getActivityColor(date: Date): string {
    const diff =  moment().diff(moment(date), 'days');
    if (diff < 7) {
      return "active";
    } else if (diff < 25) {
      return "semi-active";
    } else {
      return "inactive";
    }
  }


  return (
    <div className="PullRequest">
      <div className="row">
        <div>
          <span className="hype"><FontAwesomeIcon icon={faCodeBranch} /> {props.data.source}</span>
          &nbsp;
          <FontAwesomeIcon icon={faArrowRight}/>
          &nbsp;
          <span className="hype"><FontAwesomeIcon icon={faCodeBranch} /> {props.data.destination}</span>
        </div>
        <div className={`date ${getActivityColor(props.data.updated_on)}`} title={moment(props.data.updated_on).format("LLLL")}>
          <FontAwesomeIcon icon={faClock} /> Last update {moment(props.data.updated_on).fromNow()}
        </div>
        <div className={`date ${getActivityColor(props.data.created_on)}`} title={moment(props.data.created_on).format("LLLL")}>
          <FontAwesomeIcon icon={faClock} /> Created {moment(props.data.created_on).fromNow()}
        </div>
      </div>
      <hr />
      <div>
        {props.data.pullRequests.map(item => (
          <div key={item.destination.repository.name} className="row">
            <div>
              <a href={item.links.html.href} target="_blank" rel="noreferrer" className="hype">
                <FontAwesomeIcon icon={faGitAlt} /> {item.destination.repository.name}
              </a>
              {item.title.split('\n')[0]}
            </div>
            <div>
              <FontAwesomeIcon icon={faUser} /> {item.author.display_name}
            </div>
            <div className={`date ${getActivityColor(item.updated_on)}`} title={moment(item.updated_on).format("LLLL")}>
              <FontAwesomeIcon icon={faClock} /> Last update {moment(item.updated_on).fromNow()}
            </div>
            <div className={`date ${getActivityColor(item.created_on)}`} title={moment(item.created_on).format("LLLL")}>
              <FontAwesomeIcon icon={faClock} /> Created {moment(item.created_on).fromNow()}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

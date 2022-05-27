import {AuthPanel} from "./auth/AuthPanel";
import './HomePage.css';
import {faFileShield, faArrowsToEye, faWandMagicSparkles} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

export function HomePage() {

  return (
    <div>
      <div className="Sub-header">
        <AuthPanel />
      </div>
      <div className="box-holder">
          <div className="box">
            <div className="box-header">
              <h1>Centralized PR view</h1>
              <FontAwesomeIcon icon={faArrowsToEye} className="icon" />
              <div className="content">Get a <b>bird's eye view</b> for related pull-requests from all GIT repositories you have access to. You can <b>easily share</b> set of PRs with others.</div>
            </div>
          </div>
          <div className="box">
            <div className="box-header">
              <h1>Bulk Operations</h1>
              <FontAwesomeIcon icon={faWandMagicSparkles} className="icon" />
              <div className="content">Perform <b>bulk operations</b> on related pull-requests from multiple repositories such as commenting, merging and declining.</div>
            </div>
          </div>
          <div className="box">
            <div className="box-header">
              <h1>Secured</h1>
              <FontAwesomeIcon icon={faFileShield} className="icon" />
              <div className="content">This application is a <b>client side only</b> (no backend), so your data stays secured between your GIT host provider and your laptop.</div>
            </div>
          </div>
      </div>
    </div>
  );
}

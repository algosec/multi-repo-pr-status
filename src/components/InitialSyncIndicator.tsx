import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import './InitialSyncIndicator.css';

export function InitialSyncIndicator() {
  return (
    <div className="center-box">
      <FontAwesomeIcon icon={faSpinner} spin={true}/>
    </div>
  );
}

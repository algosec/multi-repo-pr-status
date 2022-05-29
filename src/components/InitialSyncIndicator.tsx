import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import './InitialSyncIndicator.css';

export interface InitialSyncIndicatorProps {
  isLoading: boolean;
}

export function InitialSyncIndicator(props: InitialSyncIndicatorProps) {
  return (
    <div className="center-box">
      <FontAwesomeIcon icon={faSpinner} spin={props.isLoading}/>
    </div>
  );
}

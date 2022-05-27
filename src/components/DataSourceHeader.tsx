import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBitbucket} from "@fortawesome/free-brands-svg-icons";
import React from "react";
import {DataSourceInfo} from "../services/DataSourceProvider";

interface DataSourceHeaderProps {
  dataSourceInfo: DataSourceInfo;
}

export const DataSourceHeader = React.memo((props: DataSourceHeaderProps) => {

  function getDataSourceIcon() {
    switch (props.dataSourceInfo.type) {
      case "Bitbucket": return faBitbucket;
      default: throw Error(`Unknown data source ${props.dataSourceInfo.type}`);
    }
  }

  return (
    <span>
      Connected to <b><FontAwesomeIcon icon={getDataSourceIcon()} /> {props.dataSourceInfo.type}</b> as <b>{props.dataSourceInfo.credentials.username}</b>
    </span>
  );
});

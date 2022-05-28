import {DataSourceType} from "../services/DataSourceProvider";
import React from "react";
import {faBitbucket} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export interface DataSourceIconProps {
  type: DataSourceType;
}

function getDataSourceIcon(type: DataSourceType) {
  switch (type) {
    case "Bitbucket": return faBitbucket;
    default: throw Error(`Unknown data source ${type}`);
  }
}

export const DataSourceIcon = React.memo((props: DataSourceIconProps) => {
  return <FontAwesomeIcon icon={getDataSourceIcon(props.type)} />;
});

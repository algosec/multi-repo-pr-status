import React from "react";
import {faBitbucket, faGithub} from "@fortawesome/free-brands-svg-icons";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {DataSourceType} from "../services/DataSource";

export interface DataSourceIconProps {
  type: DataSourceType;
}

function getDataSourceIcon(type: DataSourceType) {
  switch (type) {
    case "Bitbucket": return faBitbucket;
    case "Github": return faGithub;
    default: return faQuestionCircle;
  }
}

export const DataSourceIcon = React.memo((props: DataSourceIconProps) => {
  return <FontAwesomeIcon icon={getDataSourceIcon(props.type)} />;
});

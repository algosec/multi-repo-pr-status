import React from "react";
import {DataSourceInfo} from "../services/DataSourceProvider";
import {DataSourceIcon} from "./DataSourceIcon";

interface DataSourceHeaderProps {
  dataSourceInfo: DataSourceInfo;
}

export const DataSourceHeader = React.memo((props: DataSourceHeaderProps) => {
  return <span>
    Connected to <b><DataSourceIcon type={props.dataSourceInfo.type} /> {props.dataSourceInfo.type}</b> as <b>{props.dataSourceInfo.credentials.username}</b>
  </span>;
});

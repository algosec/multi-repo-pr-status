import React from "react";
import {DataSourceIcon} from "./DataSourceIcon";
import {DataSourceInfo} from "../services/DataSource";

interface DataSourceHeaderProps {
  dataSourceInfo: DataSourceInfo;
}

export const DataSourceHeader = React.memo((props: DataSourceHeaderProps) => {
  return <span>
    Connected to <b><DataSourceIcon type={props.dataSourceInfo.type} /> {props.dataSourceInfo.type}</b> as <b>{props.dataSourceInfo.credentials.username}</b>
  </span>;
});

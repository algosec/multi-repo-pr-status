import React, {useEffect, useState} from "react";
import {Moment} from "moment/moment";
import {EMPTY_TIME} from "../../state/remoteData.slice";

const UPDATE_INTERVAL = 1000;

interface SyncStatusProps {
  lastUpdate: Moment;
}

function computeText(lastUpdate: Moment): string {
  if (lastUpdate.isSame(EMPTY_TIME)) {
    return "haven't synced yet";
  }

  return `Last update ${lastUpdate.fromNow()}`;
}

export const SyncStatus = React.memo((props: SyncStatusProps) => {
  const [text, setText] = useState(() => computeText(props.lastUpdate));

  useEffect(() => {
    const interval = setInterval(() => setText(computeText(props.lastUpdate)), UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [props.lastUpdate]);

  return <span>{text}</span>;
});

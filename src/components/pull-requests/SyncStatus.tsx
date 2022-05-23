import React, {useEffect, useState} from "react";
import {Moment} from "moment/moment";

const UPDATE_INTERVAL = 1000;

interface SyncStatusProps {
  lastUpdate: Moment;
}

export const SyncStatus = React.memo(function (props: SyncStatusProps) {
  const [lastUpdateSince, setLastUpdateSince] = useState(props.lastUpdate.fromNow());

  useEffect(() => {
    const interval = setInterval(() => setLastUpdateSince(props.lastUpdate.fromNow()), UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [props.lastUpdate]);

  return (
      <span>Last update {lastUpdateSince}</span>
  );
});

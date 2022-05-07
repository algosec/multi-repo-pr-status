import React, {useEffect, useState} from "react";
import {Moment} from "moment/moment";

const UPDATE_INTERVAL = 1000;

interface SyncStatusProps {
  lastUpdate: Moment;
  isSyncing: boolean;
  triggerSync: () => Promise<void>;
}

export function SyncStatus(props: SyncStatusProps) {

  const [lastUpdateSince, setLastUpdateSince] = useState('');

  useEffect(() => {
    function calculateLastUpdateSince(): void {
      setLastUpdateSince(props.lastUpdate.fromNow());
    }

    calculateLastUpdateSince();
    const interval = setInterval(() => calculateLastUpdateSince(), UPDATE_INTERVAL);
    return () => clearInterval(interval);
  });

  return (
      <span>Last update {lastUpdateSince}</span>
  );
}

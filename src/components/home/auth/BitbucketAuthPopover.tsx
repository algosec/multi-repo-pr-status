import * as React from 'react';
import Popover from '@mui/material/Popover';
import './BitbucketAuthPopover.css';
import {useCallback} from "react";
import type {PopoverOrigin} from "@mui/material/Popover/Popover";

type Props = {
  children: JSX.Element,
};

const TRANSFORM_ORIGIN: PopoverOrigin = {
  vertical: 'top',
  horizontal: 'left',
};

const ANCHOR_ORIGIN: PopoverOrigin = {
  vertical: 'bottom',
  horizontal: 'center',
};

export function BitbucketAuthPopover({children}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget), []);
  const handleClose = useCallback(() => setAnchorEl(null), []);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <span>
      <span aria-describedby={id} onMouseEnter={handleClick}>
        {children}
      </span>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={ANCHOR_ORIGIN}
        transformOrigin={TRANSFORM_ORIGIN}
      >
        <div className="bb-popover-content">
          <p>
            Connection to Bitbucket uses a dedicated <a href="https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/" target="_blank" rel="noreferrer">application password</a>.
          </p>
          <ul>
            <li><b>Username</b> - can be found <a href="https://bitbucket.org/account/settings/" target="_blank" rel="noreferrer">here</a> next to <b>Username</b> field.</li>
            <li>
              <b>Password</b> - create application password <a href="https://bitbucket.org/account/settings/app-passwords/" target="_blank" rel="noreferrer">here</a>.
              <br />
              Required permissions:
              <ul>
                <li>Account - Read</li>
                <li>Pull requests - Write</li>
              </ul>
            </li>
          </ul>
        </div>
      </Popover>
    </span>
  );
}

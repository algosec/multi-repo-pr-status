import {DATA_SOURCE_TYPES, DataSourceType} from "../../../services/DataSource";
import {MenuItem} from "@mui/material";
import {DataSourceIcon} from "../../DataSourceIcon";
import React from "react";

export const CONNECT_TO_OPTIONS = DATA_SOURCE_TYPES.map(type => <MenuItem key={type} value={type}><DataSourceIcon type={type} /> &nbsp; {type}</MenuItem>);

export interface LoginTypeDefinition {
  usernameTitle: string,
  usernameInfo: JSX.Element,
  passwordTitle: string,
  passwordInfo: JSX.Element,
}

const UsernameInfoBitbucket = <div>
  Username can be found <a href="https://bitbucket.org/account/settings/" target="_blank" rel="noreferrer">here</a> next to <b>Username</b> field.
</div>;

const PasswordInfoBitbucket = <div>
  Create application password <a href="https://bitbucket.org/account/settings/app-passwords/" target="_blank" rel="noreferrer">here</a>.
  <br />
  Required permissions: <i>Account - Read</i>, <i>Pull requests - Write</i>
</div>;

const UsernameInfoGithub = <div>Username is the regular name that you use to login to GitHub</div>;

const PasswordInfoGithub = <div>
  Create personal access token <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer">here</a>.
  <br />
  Expiration: <i>No Expiration</i>
  <br />
  Required permissions: <i>repo</i>, <i>read:user</i>
</div>;

export const LOGIN_TYPE_DEFINITIONS: { [type in DataSourceType]: LoginTypeDefinition } = {
  'Bitbucket': {
    usernameTitle: 'Username',
    usernameInfo: UsernameInfoBitbucket,
    passwordTitle: 'Application password',
    passwordInfo: PasswordInfoBitbucket,
  },
  'Github': {
    usernameTitle: 'Username',
    usernameInfo: UsernameInfoGithub,
    passwordTitle: 'Access token',
    passwordInfo: PasswordInfoGithub,
  },
};
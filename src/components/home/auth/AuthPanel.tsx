import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useCallback, useState} from "react";
import {
  generateDataSource
} from "../../../services/DataSourceProvider";
import {useNavigate} from "react-router-dom";
import './AuthPanel.css';
import {useAppDispatch} from "../../../state/store";
import {updateDataSourceInfo} from "../../../state/dataSourceInfo.slice";
import {MenuItem, Select, TextField} from "@mui/material";
import type {SelectChangeEvent} from "@mui/material";
import {DataSourceIcon} from "../../DataSourceIcon";
import {DATA_SOURCE_TYPES, DataSourceInfo, DataSourceType} from "../../../services/DataSource";

const CONNECT_TO_OPTIONS = DATA_SOURCE_TYPES.map(type => <MenuItem key={type} value={type}><DataSourceIcon type={type} /> &nbsp; {type}</MenuItem>);

interface LoginTypeDefinition {
  usernameTitle: string,
  usernameInfo: JSX.Element,
  passwordTitle: string,
  passwordInfo: JSX.Element,
}

const LOGIN_TYPE_DEFINITIONS: {[type in DataSourceType]: LoginTypeDefinition} = {
  'Bitbucket': {
    usernameTitle: 'Username',
    usernameInfo: UsernameInfoBitbucket(),
    passwordTitle: 'Application password',
    passwordInfo: PasswordInfoBitbucket(),
  },
  'Github': {
    usernameTitle: 'Username',
    usernameInfo: UsernameInfoGithub(),
    passwordTitle: 'Access token',
    passwordInfo: PasswordInfoGithub(),
  },
};

export function AuthPanel() {

  const dispatch = useAppDispatch();

  const [type, setType] = useState<DataSourceType>(DATA_SOURCE_TYPES[0]);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const navigate = useNavigate();

  const updateType = useCallback((e:  SelectChangeEvent<DataSourceType>) => setType(e.target.value as DataSourceType), []);
  const updateUser = useCallback((e:  React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value), []);
  const updatePass = useCallback((e:  React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), []);

  async function save() {
    setErrorMessage(null);

    if (!username || !password) {
      setErrorMessage("Fill credentials and try again");
      return;
    }

    const dataSourceInfo: DataSourceInfo = {
      type,
      credentials: {
        username,
        password,
      },
    };

    const dataSource = generateDataSource(dataSourceInfo);
    const error = await dataSource.validateCredentials();

    if (error) {
      setErrorMessage(error);
      return;
    }

    dispatch(updateDataSourceInfo(dataSourceInfo));
    navigate('/');
  }

  return (
    <div>
      <div className="auth-row">
        <div className="title">Connect to</div>
        <div className="section">
          <Select value={type} onChange={updateType} size="small">
            {CONNECT_TO_OPTIONS}
          </Select>
        </div>
      </div>

      <div className="auth-row">
        <div className="title">{LOGIN_TYPE_DEFINITIONS[type].usernameTitle}</div>
        <div className="section">
          <TextField
            name="user"
            value={username}
            onChange={updateUser}
          />
        </div>
        <div className="info">
          <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
          {LOGIN_TYPE_DEFINITIONS[type].usernameInfo}
        </div>
      </div>

      <div className="auth-row">
        <div className="title">{LOGIN_TYPE_DEFINITIONS[type].passwordTitle}</div>
        <div className="section">
          <TextField
            name="password"
            type="password"
            value={password}
            onChange={updatePass}
          />
        </div>
        <div className="info">
          <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
          {LOGIN_TYPE_DEFINITIONS[type].passwordInfo}
        </div>
      </div>

      <button onClick={save} className="link-button spacious">Connect</button>
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
}

function UsernameInfoBitbucket() {
  return <div>
    Username can be found <a href="https://bitbucket.org/account/settings/" target="_blank" rel="noreferrer">here</a> next to <b>Username</b> field.
  </div>;
}

function PasswordInfoBitbucket() {
  return <div>
    Create application password <a href="https://bitbucket.org/account/settings/app-passwords/" target="_blank" rel="noreferrer">here</a>.
    <br />
    Required permissions: <i>Account - Read</i>, <i>Pull requests - Write</i>
  </div>;
}

function UsernameInfoGithub() {
  return <div>Username is the regular name that you use to login to GitHub</div>;
}

function PasswordInfoGithub() {
  return <div>
    Create personal access token <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer">here</a>.
    <br />
    Expiration: <i>No Expiration</i>
    <br />
    Required permissions: <i>repo</i>, <i>read:user</i>
  </div>;
}



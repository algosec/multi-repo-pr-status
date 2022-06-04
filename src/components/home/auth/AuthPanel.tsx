import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import './AuthPanel.css';
import {Select, TextField} from "@mui/material";
import {useAuthPanel} from "./AuthPanel.logic";
import {CONNECT_TO_OPTIONS, LOGIN_TYPE_DEFINITIONS} from "./AuthPanel.strategies";

export function AuthPanel() {

  const {
    type, updateType,
    username, updateUser,
    password, updatePass,
    save,
    errorMessage
  } = useAuthPanel();

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



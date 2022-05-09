import {faBitbucket} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useState} from "react";
import {DataSourceInfo, generateDataSource} from "../../../services/DataSourceProvider";
import {useNavigate} from "react-router-dom";
import './AuthPanel.css';
import {BitbucketAuthPopover} from "./BitbucketAuthPopover";

interface AuthPanelProps {
  currentDataSourceInfo?: DataSourceInfo;
  updateDataSourceInfo: (dataSourceInfo: DataSourceInfo) => void;
}

export function AuthPanel(props: AuthPanelProps) {

  const [user, setUser] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const navigate = useNavigate();

  async function save() {
    setErrorMessage(null);

    if (!user || !pass) {
      setErrorMessage("Fill credentials and try again");
      return;
    }

    const dataSourceInfo: DataSourceInfo = {
      type: "Bitbucket",
      credentials: {
        username: user,
        password: pass
      },
    };

    const dataSource = generateDataSource(dataSourceInfo);
    const error = await dataSource.validateCredentials();

    if (error) {
      setErrorMessage(error);
      return;
    }

    props.updateDataSourceInfo(dataSourceInfo);
    navigate('/');
  }

  return (
    <div className="auth-row">
      <span>Connect to</span>
      <BitbucketAuthPopover>
        <span><FontAwesomeIcon icon={faBitbucket} /> Bitbucket:</span>
      </BitbucketAuthPopover>
      <label>
        <input type="text" name="user" value={user} placeholder="Username" onChange={e=>setUser(e.target.value)}/>
      </label>
      <label>
        <input type="password" name="pass" placeholder="Password" onChange={e=>setPass(e.target.value)} />
      </label>
      <button onClick={save} className="link-button">Connect</button>
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
}

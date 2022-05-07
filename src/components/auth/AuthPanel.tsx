import {faBitbucket} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useState} from "react";
import {DataSourceInfo, generateDataSource} from "../../services/DataSourceProvider";
import {useNavigate} from "react-router-dom";
import './AuthPanel.css';

interface AuthPageProps {
  currentDataSourceInfo?: DataSourceInfo;
  updateDataSourceInfo: (dataSourceInfo: DataSourceInfo) => void;
}

export function AuthPanel(props: AuthPageProps) {

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  async function save() {

    const dataSourceInfo: DataSourceInfo = {
      type: "Bitbucket",
      credentials: {
        username: user,
        password: pass
      },
    };

    const dataSource = generateDataSource(dataSourceInfo);

    await dataSource.validateCredentials();

    props.updateDataSourceInfo(dataSourceInfo);
    navigate('/');
  }


  return (
    <div className="LoginPanel">
      <span>
        <FontAwesomeIcon icon={faBitbucket} /> Bitbucket
      </span>
      <label>
        <input type="text" name="bb-user" value={user} placeholder="Username" onChange={e=>setUser(e.target.value)}/>
      </label>
      <label>
        <input type="password" name="bb-pass" placeholder="Application password" onChange={e=>setPass(e.target.value)} />
      </label>
      <button onClick={() => save()}>Login</button>
    </div>
  );
}

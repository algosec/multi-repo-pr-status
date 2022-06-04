
import React, {useCallback, useState} from "react";
import {
  generateDataSource
} from "../../../services/DataSourceProvider";
import {useNavigate} from "react-router-dom";
import './AuthPanel.css';
import {useAppDispatch} from "../../../state/store";
import {updateDataSourceInfo} from "../../../state/dataSourceInfo.slice";
import type {SelectChangeEvent} from "@mui/material";
import {DATA_SOURCE_TYPES, DataSourceInfo, DataSourceType} from "../../../services/DataSource";

export function useAuthPanel() {

  const dispatch = useAppDispatch();

  const [type, setType] = useState<DataSourceType>(DATA_SOURCE_TYPES[0]);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const navigate = useNavigate();

  const updateType = useCallback((e:  SelectChangeEvent<DataSourceType>) => setType(e.target.value as DataSourceType), []);
  const updateUser = useCallback((e:  React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value), []);
  const updatePass = useCallback((e:  React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), []);

  const save = useCallback(async () => {
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
  }, [dispatch, navigate, password, type, username]);

  return {
    type, updateType,
    username, updateUser,
    password, updatePass,
    save,
    errorMessage
  };
}
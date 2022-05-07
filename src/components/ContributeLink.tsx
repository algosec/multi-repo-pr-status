import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import React from "react";

export function ContributeLink() {
  return (
    <a href="https://github.com/algosec/multi-repo-pr-status" target="_blank" rel="noreferrer">
      <FontAwesomeIcon icon={faGithub} /> Contribute on GitHub
    </a>
  );
}

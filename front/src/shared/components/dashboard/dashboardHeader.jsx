/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import PropTypes from "prop-types";

import { Icon, TextField, Button } from "zrmc";

import DashboardActionbar from "./dashboardActionbar";

class DashboardHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.bot.name,
    };
  }
  handleBotNameChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  onSaveBotDetails = () => {
    this.props.onSaveBotDetails({
      ...this.props.bot,
      ...this.state,
    });
  };

  render() {
    return (
      <div className="opla-dashboard_panel">
        <div className="opla-dashboard_panel-header">
          <div className="opla-dashboard_title">
            <div className="opla-dashboard_icon">
              <Icon>
                <svg viewBox="0 0 24 24">
                  <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
                </svg>
              </Icon>
            </div>
            <div style={{ display: "flex" }}>
              <div className="opla-dashboard_title_edit">
                <Icon name="edit" />
              </div>
              <TextField
                defaultValue={this.props.bot.name}
                onChange={this.handleBotNameChange}
              />
            </div>
          </div>
          <div className="opla-dashboard_actionbar">
            <Button
              dense
              className="button-secondary"
              onClick={this.onSaveBotDetails}
              disabled={!this.state.name || this.state.name.length < 1}
            >
              Save Bot name
            </Button>
            <DashboardActionbar
              selectedBotId={this.props.selectedBotId}
              bot={this.props.bot}
              intents={this.props.intents}
              apiImportRequest={this.props.apiImportRequest}
            />
          </div>
        </div>
      </div>
    );
  }
}

DashboardHeader.propTypes = {
  bot: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  intents: PropTypes.array.isRequired,
  selectedBotId: PropTypes.string.isRequired,

  apiImportRequest: PropTypes.func.isRequired,
  onSaveBotDetails: PropTypes.func.isRequired,
};

export default DashboardHeader;

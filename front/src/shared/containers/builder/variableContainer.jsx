/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { SubToolbar, TableComponent } from "zoapp-ui";
import Zrmc, { DialogManager, Icon } from "zrmc";
import {
  apiGetVariablesRequest,
  apiSetVariablesRequest,
  apiGetEntitiesRequest,
} from "../../actions/api";
import {
  apiGetBotVariablesRequest,
  apiSetBotVariablesRequest,
  apiGetLocalBotVariablesRequest,
  apiSetLocalBotVariablesRequest,
  apiGetBotEntitiesRequest,
} from "../../actions/bot";
import VariableDetail from "../../components/variableDetail";

class VariableContainer extends Component {
  constructor() {
    super();
    this.state = {
      showVariableDetail: false,
      action: null,
      selectedVariableId: -1,
      selectedVariableIndex: -1,
      titleName: "",
      variables: [],
      hasAccess: false,
      variableScope: "",
      setVariables: () => {},
    };
  }

  componentDidMount() {
    this.props.apiGetEntitiesRequest();
    this.props.apiGetVariablesRequest();
    if (this.props.selectedBotId) {
      this.props.apiGetBotEntitiesRequest(this.props.selectedBotId);
      this.props.apiGetBotVariablesRequest(this.props.selectedBotId);
      this.props.apiGetLocalBotVariablesRequest(this.props.selectedBotId);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selectedVariableIndex !== state.selectedVariableIndex) {
      const { user, selectedVariableIndex } = props;
      const { scope } = user.attributes;
      let { titlename, variables, hasAccess, setVariables } = state;
      switch (selectedVariableIndex) {
        case 0:
          titlename = "System";
          variables = props.systemVariables;
          setVariables = props.apiSetVariablesRequest;
          hasAccess = scope === "admin";
          break;
        case 1:
          titlename = "Global";
          variables = props.botVariables;
          setVariables = (vs) =>
            props.apiSetBotVariablesRequest(props.selectedBotId, vs);
          hasAccess = scope === "owner";
          break;
        case 2:
          titlename = "Local";
          variables = props.botLocalVariables;
          setVariables = (vs) =>
            props.apiSetLocalBotVariablesRequest(props.selectedBotId, vs);
          hasAccess = scope === "owner";
          break;
        default:
          break;
      }
      return {
        titlename,
        variables,
        setVariables,
        hasAccess,
        variableScope: titlename.toLowerCase(),
      };
    }
    return null;
  }

  renderVariableDetail = () => (
    <VariableDetail
      onClose={() =>
        this.setState({
          showVariableDetail: false,
          action: null,
          selectedVariableId: -1,
        })
      }
      onSubmit={(variable) => {
        const { variables } = this.state;
        if (this.state.action === "create") {
          variables.push(variable);
        } else {
          variables[this.state.selectedVariableId] = variable;
        }
        this.state.setVariables(variables);

        this.setState({
          showVariableDetail: false,
          action: null,
          selectedVariableId: -1,
        });
      }}
      variable={
        this.state.action === "create"
          ? {}
          : {
              ...this.state.variables[this.state.selectedVariableId],
            }
      }
      variableScope={this.state.variableScope}
      header={
        <React.Fragment>
          {this.state.action === "create" ? "Create" : "Edit"} Variable{" "}
          {this.state.variableScope}
        </React.Fragment>
      }
      entities={this.props.entities}
    />
  );

  onDelete = () => {
    Zrmc.showDialog({
      header: "Are you sure?",
      body: "This action is definitive. Are you sure ?",
      actions: [{ name: "Cancel" }, { name: "Ok" }],
      onAction: (e, action) => {
        if (action !== "Cancel") {
          const { variables } = this.state;
          variables.splice(this.state.selectedVariableId, 1);
          this.state.setVariables(variables);
        }
        DialogManager.close();
      },
      onClose: () => {
        DialogManager.close();
      },
      style: { width: "720px" },
    });
  };

  handleMenuEdit = () => {
    this.setState({
      showVariableDetail: true,
      action: "edit",
    });
  };

  handleMenuDelete = () => {
    this.setState(
      {
        showVariableDetail: false,
        action: "delete",
      },
      () => {
        this.onDelete();
      },
    );
  };

  render() {
    const renderVariableMenu = this.state.hasAccess && (
      <div className="variable-menu">
        <Icon
          name="edit"
          onClick={() => {
            this.handleMenuEdit();
          }}
        />
        <Icon
          name="delete"
          onClick={() => {
            this.handleMenuDelete();
          }}
        />
      </div>
    );

    const headers = ["", "Name", "Value", "Type", "Access", "Description", ""];

    const items = this.state.variables.map((v) => ({
      id: v.id,
      values: [
        v.name,
        v.value,
        v.type,
        v.access,
        v.description,
        renderVariableMenu,
      ],
    }));

    const action = [
      {
        name: "Add",
        onClick: () => {
          this.setState({ showVariableDetail: true, action: "create" });
        },
        disabled: !this.state.hasAccess,
      },
    ];

    return (
      <div className="variables_container">
        <SubToolbar
          className="variables_toolbar"
          style={{ margin: "0px 0px 0 0px" }}
          titleName={
            <div
              className="variables_title"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <p className="variable_overline_title">Variables</p>
              <div>${this.state.titlename}</div>
            </div>
          }
          actions={action}
        />
        <div className="zui-action-panel list-box variable_table_wrapper">
          {this.state.variables.length > 0 ? (
            <TableComponent
              className="variable_table"
              headers={headers}
              items={items}
              selectedItem={-1}
              onSelect={(index) => {
                this.setState({ selectedVariableId: index });
              }}
            />
          ) : (
            <p>You have no variables ${this.state.titlename} yet.</p>
          )}
        </div>
        {this.state.showVariableDetail && this.renderVariableDetail()}
      </div>
    );
  }
}

VariableContainer.defaultProps = {
  selectedBotId: null,
};

VariableContainer.propTypes = {
  selectedBotId: PropTypes.string,
  selectedVariableIndex: PropTypes.number,
  botVariables: PropTypes.arrayOf(PropTypes.object).isRequired,
  botLocalVariables: PropTypes.arrayOf(PropTypes.object).isRequired,
  systemVariables: PropTypes.arrayOf(PropTypes.object).isRequired,
  entities: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({}).isRequired,
  isLoading: PropTypes.bool.isRequired,

  apiGetVariablesRequest: PropTypes.func.isRequired,
  apiSetVariablesRequest: PropTypes.func.isRequired,
  apiGetBotVariablesRequest: PropTypes.func.isRequired,
  apiSetBotVariablesRequest: PropTypes.func.isRequired,
  apiGetLocalBotVariablesRequest: PropTypes.func.isRequired,
  apiSetLocalBotVariablesRequest: PropTypes.func.isRequired,
  apiGetEntitiesRequest: PropTypes.func.isRequired,
  apiGetBotEntitiesRequest: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => {
  const selectedVariableIndex = state.app.selectedVariableIndex || 0;
  const { user } = state;
  const {
    variables: systemVariables,
    botVariables,
    botLocalVariables,
    selectedBotId,
    entities: systemEntities,
    botEntities,
  } = state.app;
  const entities = [{ name: "string" }, { name: "number" }, { name: "array" }]
    .concat(systemEntities)
    .concat(botEntities);
  return {
    selectedVariableIndex,
    selectedBotId,
    botVariables,
    botLocalVariables,
    systemVariables,
    entities,
    user,
    isLoading: false,
  };
};
const mapDispatchToProps = (dispatch) => ({
  apiGetVariablesRequest: () => dispatch(apiGetVariablesRequest()),
  apiSetVariablesRequest: (variables) =>
    dispatch(apiSetVariablesRequest(variables)),
  apiGetBotVariablesRequest: (botId) =>
    dispatch(apiGetBotVariablesRequest(botId)),
  apiSetBotVariablesRequest: (botId, variables) =>
    dispatch(apiSetBotVariablesRequest(botId, variables)),
  apiGetLocalBotVariablesRequest: (botId) =>
    dispatch(apiGetLocalBotVariablesRequest(botId)),
  apiSetLocalBotVariablesRequest: (botId, variables) =>
    dispatch(apiSetLocalBotVariablesRequest(botId, variables)),
  apiGetEntitiesRequest: () => dispatch(apiGetEntitiesRequest()),
  apiGetBotEntitiesRequest: (botId) =>
    dispatch(apiGetBotEntitiesRequest(botId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VariableContainer);

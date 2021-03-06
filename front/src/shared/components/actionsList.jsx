/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { List, Icon } from "zrmc";
import { ExpansionPanel } from "zoapp-ui";
import ActionsItem from "./actionsItem";
import ActionsToolbox from "./actionsToolbox";
import ActionsTools from "../utils/actionsTools";

class ActionsList extends Component {
  constructor(props) {
    super(props);
    this.actionsEditableRefs = [];
    this.newActionsEditableRefs = undefined;
  }

  handleAddNewAction = (content, isCondition = false) => {
    if (isCondition) {
      // add action condition
      if (content.text && (content.name || content.value)) {
        this.handleAddActionCondition(content);
        // clear new
        this.props.onNewActionsChange(this.props.name, {});
        // add condition as string action if actions list and condition values are empty
      } else if (
        this.props.actions.length === 0 &&
        content.text &&
        !content.name &&
        !content.value
      ) {
        this.handleAddNewAction(content.text, false);
      }
      // add string action
    } else {
      this.handleAddAction(content);
      this.props.onNewActionsChange(this.props.name, "");
    }
  };

  handleAddAction = (text) => {
    this.handleAction("add", { text });
  };

  handleAddActionCondition = (actionCondition) => {
    this.handleAction("add", actionCondition, "condition");
  };

  handleActionChange = (text, index) => {
    this.handleAction("change", { text }, null, index);
  };

  handleActionConditionChange = (actionCondition, index) => {
    this.handleAction("change", actionCondition, "condition", index);
  };

  // private method
  handleAction = (state, content, type = null, index = undefined) => {
    if (state && content) {
      const { name } = this.props;
      const p = { name, type, state, index, action: content };
      this.props.onAction(p);
    }
  };

  handleDeleteClick = (index) => {
    this.props.onDeleteActionClick(this.props.name, index);
  };

  render() {
    const {
      name,
      actions,
      newAction,
      displayCondition,
      onDrop,
      onSelectActionsComponent,
      onChangeToolbox,
      onHelp,
    } = this.props;
    let contentList;
    const isActionsEmpty = !actions || actions.length === 0;
    const isActionsCondition =
      !isActionsEmpty &&
      ActionsTools.isActionValid(actions[0]) &&
      actions[0].type === "condition";
    const editable = true;

    const isInput = name === "input";
    const isIntentOutputEmpty = !isInput && !(actions && actions.length > 0);
    const toolbox = (
      <div className="actionstoolbox">
        <ActionsToolbox
          onChange={onChangeToolbox}
          isInput={isInput}
          condition={isIntentOutputEmpty}
        />
      </div>
    );

    let addContentClassname = "addActionItem";
    let isAddContentSelected = false;
    if (this.props.selected === 0) {
      addContentClassname += " selectedActionItem";
      isAddContentSelected = true;
    }
    const addContent = (
      <ActionsItem
        className={addContentClassname}
        containerName={name}
        action={newAction}
        editable={editable}
        isSelected={isAddContentSelected}
        onAddAction={(content, isCondition = false) => {
          this.handleAddNewAction(content, isCondition);
        }}
        onActionChange={(newContent) => {
          this.props.onNewActionsChange(this.props.name, newContent);
        }}
        onSelectActionsComponent={onSelectActionsComponent}
        isNew
        isCondition={
          name === "output" &&
          (isActionsCondition || (isActionsEmpty && displayCondition))
        }
        ref={(r) => {
          if (this.props.selected === 0) {
            this.selectedItemRef = r;
            // this.updateToolboxDisplay();
          }
        }}
        toolbox={isAddContentSelected && toolbox}
      />
    );

    const s = {
      overflow: "hidden",
      margin: "0 8px 16px 8px",
    };
    if (actions && actions.length > 0) {
      const actionsDisplayed = isActionsCondition
        ? actions[0].children
        : actions;
      contentList = (
        <List style={s}>
          {actionsDisplayed.map((action, index) => {
            const selected = index === this.props.selected - 1;
            return (
              <ActionsItem
                containerName={name}
                action={action}
                onDrop={onDrop}
                key={`asi_${index}`}
                index={index}
                onActionChange={(newContent) => {
                  if (isActionsCondition) {
                    this.handleActionConditionChange(newContent, index);
                  } else {
                    this.handleActionChange(newContent, index);
                  }
                }}
                onSelectActionsComponent={onSelectActionsComponent}
                onDeleteActionClick={(e) => {
                  e.stopPropagation();
                  this.handleDeleteClick(index);
                }}
                isCondition={isActionsCondition}
                isSelected={selected}
                className={selected ? "selectedActionItem" : null}
                ref={(r) => {
                  if (index === selected) {
                    this.selectedItemRef = r;
                    // this.updateToolboxDisplay();
                  }
                }}
                toolbox={selected && toolbox}
              />
            );
          })}
        </List>
      );
    } else {
      contentList = <List style={s} />;
    }
    const st = {
      paddingTop: "12px",
      paddingRight: "4px",
      marginLeft: "-8px",
    };
    if (name === "output") {
      st.color = "transparent";
      st.backgroundImage = "url(../images/opla-avatar.png)";
      st.backgroundSize = "20px";
      st.backgroundRepeat = "no-repeat";
      st.backgroundPositionY = "14px";
      st.backgroundPositionX = "2px";
    }
    const title = (
      <div style={{ display: "flex", fontWeight: "900" }}>
        <Icon name="account_circle" style={st} />
        {name}
        <Icon
          name="help"
          className="help_icon"
          onClick={(e) => {
            onHelp(name);
            e.stopPropagation();
          }}
        />
      </div>
    );
    return (
      <ExpansionPanel
        label={title}
        className="zui-color--white editItemContainer"
        style={{ margin: "12px" }}
        elevation={0}
      >
        {addContent}
        {contentList}
      </ExpansionPanel>
    );
  }
}

ActionsList.defaultProps = {
  actions: [],
  onSelect: null,
  onDrop: null,
  onAction: () => {},
  onHelp: () => {},
  intentId: null,
  onSelectActionsComponent: () => {},
  onNewActionsChange: () => {},
  onDeleteActionClick: () => {},
};

ActionsList.propTypes = {
  name: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  ),
  onSelect: PropTypes.func,
  onDrop: PropTypes.func,
  onAction: PropTypes.func,
  onHelp: PropTypes.func,
  displayCondition: PropTypes.bool,
  intentId: PropTypes.string,
  newAction: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  onSelectActionsComponent: PropTypes.func.isRequired,
  onNewActionsChange: PropTypes.func.isRequired,
  onDeleteActionClick: PropTypes.func.isRequired,
  onChangeToolbox: PropTypes.func,
  selected: PropTypes.number,
};

export default ActionsList;

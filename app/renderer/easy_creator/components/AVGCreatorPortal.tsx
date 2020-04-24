/** @format */

import * as React from "react"
import { ProjectListItem } from "./ProjectListItem"

import "./AVGCreatorPortal.less"
import { Empty } from "antd"
import { PanelStack } from "@blueprintjs/core"
import { ProjectListMainPanel } from "./ProjectListMainPanel"
import store from "../../redux/store"
import { render } from "react-dom"
import { AVGCreatorReducer, AVGCreatorInitialState } from "../../redux/reducers/avg-creator-reducers"
import { AVGCreatorActionType } from "../../redux/actions/avg-creator-actions"

// export interface ProjectListState {
//   projects: any[]
//   isShowPanelHeader: boolean
// }

export const AVGCreatorPortal = () => {
  const [state, dispatch] = React.useReducer(AVGCreatorReducer, AVGCreatorInitialState)

  const renderProjectList = () => {
    return (
      <div className="list-container">
        {state.projects.length === 0 && (
          <Empty
            image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
            imageStyle={{
              height: 160,
            }}
            description={<div className="empty-list-hint">呐，暂时没有项目呢！</div>}
          >
            <button className="bp3-button bp3-icon-add">新建项目</button>
          </Empty>
        )}

        {state.projects.map((p) => {
          return <ProjectListItem key={p.key} name={p.name} description={p.description} />
        })}

        <div className="running-status-info-bar">
          <p className="info">正在监听 http://localhost:2335, 点击打开</p>
        </div>
      </div>
    )
  }

  const onPanelOpen = () => {
    // this.setState({
    //   isShowPanelHeader: true,
    // })

    dispatch(AVGCreatorActionType.OpenSettingPanel)
  }

  const onPanelClose = () => {
    // this.setState({
    //   isShowPanelHeader: false,
    // })
    dispatch(AVGCreatorActionType.CloseSettingPanel)

    // store.dispatch(AVGCreatorAction.closeSettingPanel());
  }

  return (
    <PanelStack
      className="panel-stack"
      showPanelHeader={state.isShowPanelHeader}
      initialPanel={{ component: ProjectListMainPanel }}
      onOpen={onPanelOpen}
      onClose={onPanelClose}
    />
  )
}

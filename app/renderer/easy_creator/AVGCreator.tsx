/** @format */

import * as React from "react"
// import { dialog } from "electron"

import "./AVGCreator.less"

import { AVGCreatorPortal } from "./components/AVGCreatorPortal"

// import { message } from "antd"
import { Button, Popover, Dialog, FormGroup, FileInput } from "@blueprintjs/core"

import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"
import { IconNames } from "@blueprintjs/icons"

import { AppContext } from "./hooks/context"
import { useReducer, useState, useEffect, FormEvent } from "react"
import { AVGCreatorReducer, AVGCreatorInitialState } from "../redux/reducers/avg-creator-reducers"
import { AVGCreatorActionType } from "../redux/actions/avg-creator-actions"
import { InputGroup } from "@blueprintjs/core"

const AVGCreator = () => {
  const [state, dispatch] = useReducer(AVGCreatorReducer, AVGCreatorInitialState)
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false)
  const [projectDir, setProjectDir] = useState("")

  const handleNewProject = () => {
    // message.info("This is a normal message")
    // setIsCreateProjectDialogOpen(!isCreateProjectDialogOpen)
    setIsCreateProjectDialogOpen(true)
  }

  const handleCreateDialogClose = () => {
    setIsCreateProjectDialogOpen(false)
  }

  const handleInputProjectDirectoryChanged = (e: FormEvent<HTMLLabelElement>) => {
    const files = (e.target as any).files
    const selectedFile = files[0].path

    const dir = path.dirname(selectedFile)

    console.log("current selected dir", dir)

    dialog.showOpenDialogSync({})

    setProjectDir(dir)
  }

  // const handleInputProjectDirectoryChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log("on input change ", e)
  // }

  useEffect(() => {
    dispatch(AVGCreatorActionType.CloseSettingPanel)
  }, [state.isSettingPanelOpen])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="bp3-dialog-container avg-window-container">
        <div className="bp3-dialog avg-window-dialog">
          <div className="bp3-dialog-header avg-window-header">
            <h4 className="bp3-heading avg-window-header-title">AVGPlus GUI</h4>
          </div>

          <div className="bp3-dialog-body avg-window-body">
            <div className="body-content">
              <AVGCreatorPortal />
            </div>
          </div>
          {!state.isSettingPanelOpen && (
            <div className="bp3-dialog-header avg-creator-footer">
              <div className="bp3-button-group .modifier">
                <Dialog
                  className={"create-project-dialog"}
                  icon="info-sign"
                  onClose={handleCreateDialogClose}
                  title="创建项目"
                  isOpen={isCreateProjectDialogOpen}
                  usePortal={true}
                  hasBackdrop={false}
                  transitionDuration={0}
                  canEscapeKeyClose={true}
                >
                  <div className="container">
                    <FormGroup inline={false} label={"目录名称"} labelFor="text-input">
                      <InputGroup disabled={false} leftIcon={IconNames.CUBE_ADD} placeholder="输入你的项目名称" />
                    </FormGroup>
                  </div>
                </Dialog>
                <Button icon={IconNames.ADD} onClick={handleNewProject}>
                  新建项目
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default AVGCreator

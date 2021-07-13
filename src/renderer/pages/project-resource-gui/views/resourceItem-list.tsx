import { InputGroup } from "@blueprintjs/core";
import { Col, Row } from "antd/lib/grid";
import React from "react";
import { ProjectResourceType, ProjectResourceService, ResourceItem } from "../project-resource-page.service";
import "./resourceItem-list.less";
interface currentList {
    list: ResourceItem[],
    resourceType: ProjectResourceType
}

export const ResourceItemList = (list: currentList) => {
    return (
        <div>
            <Row style={{ height: "100%" }}>
                <Col flex={"70%"} style={{ backgroundColor: "#fff", padding: "10px" }}>
                    <div className="head-wrapper">
                        <span className="head">
                            {list.resourceType.name}
                        </span>
                        <InputGroup className="search" placeholder="搜索..." small />
                    </div>
                    <div className="head-name">
                        <span className="file">文件</span>
                        <span className="file-type">资源类型</span>
                        <span className="action">操作</span>
                    </div>

                </Col>
                <Col flex={"30%"} style={{ backgroundColor: "#f9f9f9" }}>

                </Col>
            </Row>
        </div >
    )
}
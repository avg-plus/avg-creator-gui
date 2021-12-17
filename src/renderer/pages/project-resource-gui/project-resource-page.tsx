// import React, { useState } from "react";
// // import { Col, Row } from "antd/lib/grid";
// import {
//   MenuDivider,
//   Menu,
//   MenuItem,
//   IconName,
//   MaybeElement,
//   Icon,
//   Button,
//   AnchorButton,
//   Classes,
//   Dialog,
//   InputGroup,
//   ContextMenu,
//   Alert,
//   Intent,
//   Toaster,
//   Position,
//   NumericInput
// } from "@blueprintjs/core";
// import "./project-resource-page.less";
// import {
//   ProjectResourceService,
//   ResourceItem,
//   ProjectResourceType
// } from "./project-resource-page.service";
// import { useMount } from "react-use";
// import classNames from "classnames";
// import { ResourceTypeContextMenu } from "../../components/context-menus/resource-type-menus";

// export const ProjectResourcePage = () => {
//   /**
//    * 活动分类id
//    */
//   const [activeMenuItem, setActiveMenuItem] = useState<string>("");
//   /**
//    * 资源集
//    */
//   const [resourcItems, setReseourceItems] = useState<ResourceItem[]>([]);
//   /**
//    * 已分类 上方
//    */
//   const [classified, setClassified] = useState<ProjectResourceType[]>([]);
//   /**
//    * 未分类 下方
//    */
//   const [unclassified, setUnclassified] = useState<ProjectResourceType[]>([]);
//   /**
//    * 打开 添加窗口
//    */
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   /**
//    * 打开 删除窗口
//    */
//   const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

//   const [editOrAdd, setEditOrAdd] = useState<string>("编辑");
//   // /**
//   //  * 需要添加的分类名（临时、编辑也用）
//   //  */
//   // const [addTypeName, setAddTempName] = useState<string>("");
//   // /**
//   //  * 添加的是否分类状态
//   //  */
//   // const [isClassified, setIsclassified] = useState<string>("");
//   /**
//    * 当前选中的分类
//    */
//   const [selectType, setSelectType] = useState<ProjectResourceType>({
//     id: "",
//     name: "",
//     icon: "",
//     type: "",
//     index: -1
//   });
//   /**
//    * 重置 selectType
//    */
//   const resetSelectType = () => {
//     setSelectType({
//       id: "",
//       name: "",
//       icon: "",
//       type: "",
//       index: -1
//     });
//   };

//   useMount(async () => {
//     await reloadResourceTypeList();
//   });

//   const renderType = (list: ProjectResourceType[]) => {
//     return list.map((item) => {
//       return (
//         <div onContextMenu={(event) => handleContextMenu(event, item)}>
//           <MenuItem
//             className={classNames({
//               selected: activeMenuItem === item.id
//             })}
//             id={item.id}
//             text={item.name}
//             icon={item.icon as IconName | MaybeElement}
//             onMouseDown={() => setActiveMenuItem(item.id)}
//           />
//         </div>
//       );
//     });
//   };

//   const handleContextMenu = (
//     event: React.MouseEvent<HTMLDivElement, MouseEvent>,
//     item: ProjectResourceType
//   ) => {
//     ContextMenu.show(
//       <ResourceTypeContextMenu
//         onEdit={() => {
//           setEditOrAdd("编辑");
//           setIsOpen(true);
//           setSelectType(item);
//         }}
//         onDelete={() => {
//           setSelectType(item);
//           setIsDeleteOpen(true);
//         }}
//       />,
//       {
//         left: event.clientX,
//         top: event.clientY
//       }
//     );
//   };

//   const reloadResourceTypeList = async () => {
//     const typeList = await ProjectResourceService.loadProjectMenuList();
//     setActiveMenuItem(typeList.classified[0].id);
//     setClassified([...typeList.classified]);
//     setUnclassified([...typeList.unclassified]);
//   };

//   const openAddTypeDialog = (isClassified: string) => {
//     let temp = selectType;
//     temp.type = isClassified;
//     setSelectType(temp);
//     setIsOpen(true);
//   };

//   const submitTypeName = () => {
//     if (selectType.name === "") {
//       return;
//     }
//     if (selectType.type === "") {
//       return;
//     }
//     if (editOrAdd === "添加") {
//       ProjectResourceService.insertResourceType(
//         selectType.name,
//         selectType.type,
//         selectType.index
//       ).then(() => {
//         reloadResourceTypeList();
//         setIsOpen(false);
//         resetSelectType();
//         Toaster.create({
//           className: "recipe-toaster",
//           position: Position.TOP
//         }).show({ message: "添加成功~" });
//       });
//     } else if (editOrAdd === "编辑") {
//       ProjectResourceService.updateResourceType(selectType).then(() => {
//         reloadResourceTypeList();
//         setIsOpen(false);
//         resetSelectType();
//         Toaster.create({
//           className: "recipe-toaster",
//           position: Position.TOP
//         }).show({ message: "修改成功~" });
//       });
//     }
//   };

//   return (
//     <Row style={{ height: "100%" }}>
//       <Col flex={"20%"}>
//         <div key="side-menu">
//           <div className="side-menu">
//             <Menu>
//               <Button
//                 style={{ margin: "10px 0 10px 0", padding: "5px" }}
//                 rightIcon="add"
//                 text="素材集合"
//                 alignText="left"
//                 minimal
//                 fill
//                 onClick={() => {
//                   openAddTypeDialog("classified");
//                   setEditOrAdd("添加");
//                 }}
//               />
//               {renderType(classified)}
//               <Button
//                 style={{
//                   margin: "10px 0 10px 0",
//                   padding: "5px",
//                   borderTop: "1px solid #F0F0F0"
//                 }}
//                 rightIcon="add"
//                 text="智能分类"
//                 alignText="left"
//                 onClick={() => {
//                   openAddTypeDialog("unclassified");
//                   setEditOrAdd("添加");
//                 }}
//                 minimal
//                 fill
//               />{" "}
//               {renderType(unclassified)}
//             </Menu>
//           </div>
//         </div>
//       </Col>
//       <Col flex={"79%"}>
//         <div>asdasd</div>
//       </Col>
//       {/* 以下为弹出框 */}
//       {/* 添加弹出框 */}
//       <Dialog
//         icon="add"
//         title={editOrAdd}
//         isOpen={isOpen}
//         onClose={() => {
//           setIsOpen(false);
//           resetSelectType();
//         }}
//       >
//         <div className={Classes.DIALOG_BODY}>
//           <InputGroup
//             asyncControl={true}
//             large
//             leftIcon="filter"
//             fill
//             onChange={(v) => {
//               let temp = selectType;
//               temp.name = v.target.value;
//               setSelectType(temp);
//             }}
//             placeholder="请输入分类名"
//             value={selectType.name}
//           />
//           <div style={{ width: "100%", height: "10px" }}></div>
//           <NumericInput
//             asyncControl={true}
//             large
//             leftIcon="changes"
//             fill
//             onValueChange={(v) => {
//               let temp = selectType;
//               temp.index = v;
//               setSelectType(temp);
//             }}
//             placeholder="请输入序号，越小顺序越靠前~"
//             value={selectType.index}
//           />
//         </div>
//         <div className={Classes.DIALOG_FOOTER}>
//           <div className={Classes.DIALOG_FOOTER_ACTIONS}>
//             <AnchorButton onClick={() => submitTypeName()}>提交</AnchorButton>
//           </div>
//         </div>
//       </Dialog>
//       {/* 删除分类提示 */}
//       <Alert
//         cancelButtonText="取消"
//         confirmButtonText="确认删除"
//         icon="trash"
//         intent={Intent.DANGER}
//         isOpen={isDeleteOpen}
//         onCancel={() => {
//           setIsDeleteOpen(false);
//           resetSelectType();
//         }}
//         onConfirm={() => {
//           ProjectResourceService.deleteResourceType(selectType.id).then(
//             (num) => {
//               if (num > 0) {
//                 setIsDeleteOpen(false);
//                 resetSelectType();
//                 Toaster.create({
//                   className: "recipe-toaster",
//                   position: Position.TOP
//                 }).show({ message: "删除成功~" });
//                 reloadResourceTypeList();
//               }
//             }
//           );
//         }}
//       >
//         <p>
//           是否删除 <b>{selectType?.name}</b> 分类?
//         </p>
//       </Alert>
//     </Row>
//   );
// };

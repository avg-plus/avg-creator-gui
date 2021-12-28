import classNames from "classnames";
import React, { ReactNode, useRef, useState } from "react";
import { useMount, useUnmount } from "react-use";
import { useForceUpdate } from "../../hooks/use-forceupdate";

import "./index.less";
interface ITabProps {
  key: string;
  icon?: JSX.Element;
  showClose?: boolean;
  title: JSX.Element | string;
  children?: JSX.Element | JSX.Element[] | string | null | undefined | boolean;
}

interface ITabsProps {
  onTabSwitch?(index: number): void;
  onTabClose?(index: number): void;
  onTabPositionChange?(a: number, b: number): void;
  onTabAdd?(): void;
  active: number;
  color?: string;
  showAdd?: boolean;
  draggable?: boolean;

  children?: Array<ReactNode>;
}

interface IDragTarget {
  target: HTMLElement;
  x: number;
  left: string;
  mouseX: number;
  index: number;
}

export const Tabs = (props: ITabsProps) => {
  const [dragTarget, setDragTarget] = useState<IDragTarget | null>(null);
  const [tooltipTimeout, setTooltipTimeout] = useState<number>();
  const tabs = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const forceUpdate = useForceUpdate();

  if (!props.children) {
    props.children = [];
  }

  useMount(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  });

  useUnmount(() => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  });

  const switchTab = (index: number) => {
    props.onTabSwitch && props.onTabSwitch(index);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setDragTarget({
      target: event.currentTarget,
      x: event.currentTarget.offsetLeft,
      left: event.currentTarget.offsetLeft + "px",
      mouseX: event.pageX,
      index: getIndexByLeft(event.currentTarget.offsetLeft)
    });
  };

  const handleMouseUp = () => {
    setDragTarget(null);
  };

  const handleMouseMove = (event: {
    preventDefault: () => void;
    stopPropagation: () => void;
    pageX: number;
  }) => {
    if (dragTarget) {
      event.preventDefault();
      event.stopPropagation();

      const one = tabs.current!.offsetWidth / 100;
      const maxLeft = one + one * singleTabWidth * (tabTotal - 1);

      let left = dragTarget.x + event.pageX - dragTarget.mouseX;

      if (left < one) {
        left = one;
      }

      if (left > maxLeft) {
        left = maxLeft;
      }

      let index = getIndexByLeft(left);

      if (index != dragTarget.index) {
        const a = index,
          b = dragTarget.index;

        props.onTabPositionChange && props.onTabPositionChange(a, b);

        dragTarget.index = index;
      }

      dragTarget.left = left + "px";

      hideTooltip();
      forceUpdate();
    }
  };

  const handleClose = (
    index: number,
    event: { preventDefault: () => void; stopPropagation: () => void }
  ) => {
    event.preventDefault();
    event.stopPropagation();
    props.onTabClose && props.onTabClose(index);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    props.onTabAdd && props.onTabAdd();
  };

  const getLeftByIndex = (index: number) => {
    return 1 + singleTabWidth * index;
  };

  const getIndexByLeft = (left: number) => {
    let one = tabs.current!.offsetWidth / 100;
    return Math.round((left - one) / (one * singleTabWidth));
  };

  const showTooltip = (event) => {
    const text =
      event.currentTarget.getElementsByClassName("text")[0].innerText;
    const left = event.currentTarget.offsetLeft;

    if (!tooltipTimeout) {
      setTooltipTimeout(
        window.setTimeout(() => {
          tooltipRef.current!.innerText = text;
          tooltipRef.current!.style.display = "block";
          tooltipRef.current!.style.left = left + 30 + "px";
        }, 800)
      );
    }
  };

  const hideTooltip = () => {
    window.clearTimeout(tooltipTimeout);
    setTooltipTimeout(0);
    tooltipRef.current!.style.display = "none";
  };

  const tabTotal = props.children.length;
  const singleTabWidth = 98 / tabTotal;

  const renderTabs = () => {
    return props.children?.map((tab: { props: ITabProps }, index) => {
      let style = {};
      let position = index;
      let icon: JSX.Element = <></>;

      if (tab.props.icon) {
        if (typeof tab.props.icon === "string") {
          icon = <TabIcon type={tab.props.icon}></TabIcon>;
        } else {
          icon = tab.props.icon;
        }
      }

      style["zIndex"] = tabTotal - position;
      style["left"] = getLeftByIndex(position) + "%";
      style["width"] = singleTabWidth + "%";

      if (dragTarget && dragTarget.index == position) {
        style["left"] = dragTarget.left;
      }

      return (
        <div
          key={index}
          className={"tab-button" + (props.active == index ? " active" : "")}
          style={style}
          onMouseDown={(e) => {
            handleMouseDown(e);

            if (e.button === 0) {
              switchTab(index);
            }
          }}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        >
          <div
            className="tab"
            style={props.color ? { borderColor: props.color } : {}}
          ></div>
          <div className={"text" + (tab.props.showClose ? " with-close" : "")}>
            {icon}
            {tab.props.title}
          </div>
          {tab.props.showClose ? (
            <div
              className="close"
              onClick={(e) => {
                handleClose(index, e);
              }}
            ></div>
          ) : null}
        </div>
      );
    });
  };

  const renderPanels = () => {
    if (!props.children || !Array.isArray(props.children)) {
      return <></>;
    }

    return props.children.map((panel, index) => {
      // if (index !== props.active) {
      //   return null;
      // }

      return <div className={classNames("panel", "active")}>{panel}</div>;
    });
  };

  return (
    <div className="r-a-t">
      <div
        className={"tab-wrapper" + (props.showAdd ? " with-add" : "")}
        ref={tabs}
      >
        {renderTabs()}
      </div>
      {props.showAdd ? (
        <div
          className="add-wrapper"
          onClick={(e) => {
            handleAdd(e);
          }}
        ></div>
      ) : null}
      <div
        className="panel-wrapper"
        style={props.color ? { borderColor: props.color } : {}}
      >
        {renderPanels()}
      </div>
      <div className="tooltip" ref={tooltipRef}></div>
    </div>
  );
};

const Tab = (props: ITabProps) => {
  return <div>{props.children}</div>;
};

const TabIcon = ({ type }) => {
  return (
    <div className={"icon " + type}>
      {type == "loading" ? <div className="mask"></div> : null}
    </div>
  );
};

export default Tabs;
export { Tab };

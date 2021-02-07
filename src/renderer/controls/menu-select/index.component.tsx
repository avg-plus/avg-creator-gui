import React, { useState } from "react";
import { MenuItem } from "@blueprintjs/core";

import "./index.less";
import { FlatButton } from "../flat-button/index.component";
import { IItemRendererProps, Select } from "@blueprintjs/select";

interface IMenuSelectProps<T> {
  items: T[];
  displayField: string;
  onItemSelect?: (item: T, event?: React.SyntheticEvent<HTMLElement>) => void;
}

export function MenuSelect<T>(props: IMenuSelectProps<T>) {
  const TypeSelect = Select.ofType<T>();
  const [selectedItem, setSelectedItem] = useState<T>(props.items[0]);

  const renderOptions = (item: T, itemProps: IItemRendererProps) => {
    const itemClicked = () => {
      setSelectedItem(item);
    };

    return (
      <MenuItem
        key={itemProps.index}
        text={item[props.displayField]}
        onClick={itemClicked}
        shouldDismissPopover={true}
      />
    );
  };

  return (
    <TypeSelect
      itemRenderer={renderOptions}
      items={props.items}
      filterable={false}
      popoverProps={{ minimal: true }}
      onItemSelect={props.onItemSelect ?? ((item) => {})}
    >
      <FlatButton
        minimal={true}
        text={selectedItem![props.displayField]}
        rightIcon="double-caret-vertical"
      />
    </TypeSelect>
  );
}

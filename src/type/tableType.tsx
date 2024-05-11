import * as React from "react";

export interface Data {
  id: number;
  number: number;
  name: string;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string | JSX.Element;
}

export interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
  selected: number[];
  handleAddRow: () => void;
  handleDeleteAll: () => void;
}

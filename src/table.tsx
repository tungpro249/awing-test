import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Checkbox, TextField } from "@mui/material";
import { Data, EnhancedTableProps, HeadCell } from "./type/tableType";
import { Ad } from "./type/campaignType";

function createData(
  id: number,
  name: string,
  number: number,
): Data {
  return {
    id,
    name,
    number,
  };
}

const headCells: HeadCell[] = [
  {
    id: 'name',
    disablePadding: true,
    label: 'Tên quảng cáo*',
  },
  {
    id: 'number',
    disablePadding: false,
    label: 'Số lượng*',
  }
];

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount, handleAddRow, handleDeleteAll, selected } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" width="60px">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {
          rowCount > 0 && numSelected === rowCount ?
            <>
              <TableCell align="left">
                <Button onClick={handleDeleteAll}>
                  <DeleteIcon />
                </Button>
              </TableCell>
            </> : <>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={"left"}
                  width={headCell.id === "number"? "38%" : ""}
                >
                  {headCell.label}
                </TableCell>
              ))}
              <TableCell
                align={"right"}
                width={"120px"}
              >
                <Button onClick={handleAddRow}>Thêm</Button>
              </TableCell>
            </>
        }
      </TableRow>
    </TableHead>
  );
}

export default function DataTable(
  {
    isSubmit,
    data,
    selectedBox,
    setRowsDataCampaign,
  }: {
    isSubmit: boolean;
    data: any;
    selectedBox: number;
    setRowsDataCampaign: (data: any) => void;
}) {
  const [selected, setSelected] = React.useState<number[]>([]);
  const [rows, setRows] = React.useState(data.ads.map((item: any) =>
    createData(item.id, item.name, item.number)
  ));

  const [newRow, setNewRow] = React.useState(() => {
    const initialId = 2;
    return {
      id: initialId,
      name: `Quảng cáo ${initialId}`,
      number: 0,
    };
  });

  const handleAddRow = () => {
    const subCampaignIndex = selectedBox;
    const newAds = {
      name: `Quảng cáo ${rows.length + 1}`,
      quantity: 0,
    };

    //@ts-ignore
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows.push(createData(newRow.id, newRow.name, newRow.number));
      return newRows;
    });

    setNewRow((prevRow) => ({
      id: prevRow.id + 1,
      name: `Quảng cáo ${rows.length + 2}`,
      number: 0,
    }));

    //@ts-ignore
    setRowsDataCampaign((prevData) => {
      const newData = [...prevData];
      const subCampaigns = [...newData[0].subCampaigns];
      const ads = [...subCampaigns[subCampaignIndex].ads];
      ads.push(newAds);
      subCampaigns[subCampaignIndex] = {
        ...subCampaigns[subCampaignIndex],
        ads: ads,
      };
      newData[0] = {
        ...newData[0],
        subCampaigns: subCampaigns,
      };
      return newData;
    });
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.ads.map((item: Ad, index: number) => {
        return index
      });
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleDelete = (index: number) => {
    //@ts-ignore
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows.splice(index, 1);
      return newRows;
    });
    //@ts-ignore
    setRowsDataCampaign((prevData) => {
      const newData = [...prevData];
      const subCampaigns = [...newData[0].subCampaigns];
      const ads = [...subCampaigns[selectedBox].ads];
      ads.splice(index, 1);
      subCampaigns[selectedBox] = {
        ...subCampaigns[selectedBox],
        ads: ads,
      };
      newData[0] = {
        ...newData[0],
        subCampaigns: subCampaigns,
      };
      return newData;
    });
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const handleTextChange = (
    event: any,
    index: number,
  ) => {
    const { value } = event.target;
    //@ts-ignore
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = {
        ...newRows[index],
        name: value,
      };
      return newRows;
    });
    //@ts-ignore
    setRowsDataCampaign((prevData) => {
      const newData = [...prevData];
      const subCampaigns = [...newData[0].subCampaigns];
      const ads = [...subCampaigns[selectedBox].ads];
      ads[index] = {
        ...ads[index],
        name: value,
      };
      subCampaigns[selectedBox] = {
        ...subCampaigns[selectedBox],
        ads: ads,
      };
      newData[0] = {
        ...newData[0],
        subCampaigns: subCampaigns,
      };
      return newData;
    });
  };

  const handleNumberChange = (
    event: any,
    index: number,
  ) => {
    const value = parseInt(event.target.value);
    //@ts-ignore
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = {
        ...newRows[index],
        name: value,
      };
      return newRows;
    });
    //@ts-ignore
    setRowsDataCampaign((prevData) => {
      const newData = [...prevData];
      const subCampaigns = [...newData[0].subCampaigns];
      const ads = [...subCampaigns[selectedBox].ads];
      ads[index] = {
        ...ads[index],
        quantity: value,
      };
      subCampaigns[selectedBox] = {
        ...subCampaigns[selectedBox],
        ads: ads,
      };
      newData[0] = {
        ...newData[0],
        subCampaigns: subCampaigns,
      };
      return newData;
    });
  };

  const handleDeleteAll = () => {
    //@ts-ignore
    setRowsDataCampaign((prevData) => {
      const newData = [...prevData];
      const subCampaigns = [...newData[0].subCampaigns];
      console.log(subCampaigns[selectedBox])
      subCampaigns[selectedBox] = {
        ...subCampaigns[selectedBox],
        ads: [],
      };
      newData[0] = {
        ...newData[0],
        subCampaigns: subCampaigns,
      };
      return newData;
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={data.ads.length}
              selected={selected}
              handleAddRow={handleAddRow}
              handleDeleteAll={handleDeleteAll}
            />
            <TableBody>
              {data.ads.map((item: Ad, index: number) => {
                const isItemSelected = isSelected(index);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                        onClick={(event) => handleClick(event, index)}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <TextField
                        required
                        id="standard-required"
                        label=""
                        type="text"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={item.name}
                        onChange={(event) => handleTextChange(event, index)}
                        variant="standard"
                        error={isSubmit && item.name === ''}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="left">
                      <TextField
                        id="standard-number"
                        label=""
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={item.quantity}
                        onChange={(event) => handleNumberChange(event, index)}
                        variant="standard"
                        error={isSubmit && item.quantity <= 0}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button onClick={() => handleDelete(index)}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

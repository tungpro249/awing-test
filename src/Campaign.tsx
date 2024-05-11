import { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import * as React from "react";
import { Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DataTable from "./table";
import { Ad, Campaigns, initCampaign, SubCampaign } from "./type/campaignType";

const Campaign = () => {
  const [value, setValue] = React.useState('1');
  const [selectedBox, setSelectedBox] = useState(0);

  const [errorName, setErrorName] = useState("");

  const [rowsDataCampaign, setRowDataCampaign] = useState<Array<Campaigns>>(initCampaign);
  const [subCampaignStatus, setSubCampaignStatus] = useState(rowsDataCampaign[0].subCampaigns.map((subCampaign: SubCampaign) => subCampaign.status));

  const [isSubmit, setIsSubmit] = useState(false);

  const valid = () => {
    let isValid = true;
    rowsDataCampaign.forEach((item: Campaigns) => {
      if (item.information.name === "") {
        setErrorName("Dữ liệu không hợp lệ");
        isValid = false;
      }
      item.subCampaigns.forEach((subItem) => {
        const hasEmptyName = subItem.ads.some((item: Ad) => item.name.trim() === "");
        const hasZeroQuantity = subItem.ads.some((item: Ad) => item.quantity === 0);
        if (hasEmptyName || hasZeroQuantity) {
          setErrorName("Dữ liệu không hợp lệ");
          isValid = false;
        }
      });
    });
    return isValid;
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleAddItem = () => {
    const newItemName = `Chiến dịch con ${rowsDataCampaign[0].subCampaigns.length + 1}`;
    const newSubCampaign = {
      name: newItemName,
      status: true,
      ads: [
        {
          name: 'Quảng cáo 1',
          quantity: 0,
        },
      ],
    };

    setRowDataCampaign((prevState) => {
      const updatedCampaign = { ...prevState[0] };
      updatedCampaign.subCampaigns.push(newSubCampaign);
      return [updatedCampaign];
    });
  };

  const handleClickCampaign = (index: number) => {
    setSelectedBox(index);
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setIsSubmit(true);
    if (valid()) {
      let alertMessage = JSON.stringify({
        campaigns: rowsDataCampaign.map((campaign: Campaigns) => ({
          information: {
            name: campaign.information.name,
            describe: campaign.information.describe || null
          },
          subCampaigns: campaign.subCampaigns.map((subCampaign: SubCampaign) => ({
            name: subCampaign.name,
            status: subCampaign.status,
            ads: subCampaign.ads.map((ad: Ad) => ({
              name: ad.name,
              quantity: ad.quantity
            }))
          }))
        }))
      });
      alert(alertMessage);
    } else {
      alert("Vui lòng điền đúng và đầy đủ thông tin");
    }
  };

  const hasError = (item: SubCampaign): boolean => {
    const hasEmptyName = item.ads.some((ad: Ad) => ad.name.trim() === "");
    const hasZeroQuantity = item.ads.some((ad: Ad) => ad.quantity <= 0);
    return item.name.trim() === "" || hasEmptyName || hasZeroQuantity;
  };

  return (
    <>
      <Box sx={{paddingTop: "20px"}}>
        <Box sx={{
          display: "flex",
          padding: "10px 20px",
          justifyContent: "flex-end",
        }}>
          <Button
            style={{background: "#3f51b5", color: "#fff"}}
            onClick={(event) => handleSubmit(event)}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <hr/>
      <TabContext value={value}>
        <Box sx={{ boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"}}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChangeTab} >
              <Tab label="Thông tin" value="1" />
              <Tab label="Chiên dịch con" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <TextField
              required
              id="name"
              label="Tên chiến dịch"
              variant="standard"
              onChange={(event) => {
                const newData = [...rowsDataCampaign];
                newData[0].information.name = event.target.value;
                setRowDataCampaign(newData);
              }}
              error={!!errorName}
              helperText={errorName ? errorName : ""}
              fullWidth
            />
            <TextField
              id="describe"
              label="Mô tả"
              variant="standard"
              onChange={(event) => {
                const newData = [...rowsDataCampaign];
                newData[0].information.describe = event.target.value;
                setRowDataCampaign(newData);
              }}
              fullWidth
            />
          </TabPanel>
          <TabPanel value="2">
            <Box sx={{display: "flex", overflowY: "hidden", padding: "24px"}}>
              <Button
                sx={{
                  background: "rgb(237, 237, 237)",
                  padding: "12px",
                  borderRadius: "50%",
                  overflow: "visible",
                  fontSize: "1.5rem",
                  height: "58px"
                }}
                onClick={handleAddItem}>
                <AddIcon style={{color: "#f50057"}}/>
              </Button>
              <Box display={"flex"}>
              {rowsDataCampaign[0].subCampaigns.map((item: SubCampaign, index: number) => (
                <Box
                  key={index}
                  sx={{
                    width: "210px",
                    height: "120px",
                    marginLeft: "16px",
                    cursor: "pointer",
                    border: `2px solid ${selectedBox === index ? "blue" : "rgb(250, 250, 250)"}`,
                    boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)"
                  }}
                  onClick={() => handleClickCampaign(index)}
                >
                  <Box
                    sx={{
                      padding: "8px 8px 4px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <h6
                      style={{
                        fontSize: "1.25rem",
                        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                        fontWeight: 500,
                        lineHeight: 1.6,
                        letterSpacing: "0.0075em",
                        margin: 0,
                        color: hasError(item) && isSubmit ? "red" : "unset"
                      }}
                    >
                      {item.name}
                    </h6>
                    <CheckCircleIcon
                      style={{
                        color: `${item.status ? "rgb(0, 128, 0)" : "unset"}`,
                        fontSize: "14px",
                        paddingLeft: "8px"
                      }}
                    />
                  </Box>
                  <Typography sx={{ textAlign: "center" }} fontWeight="400" fontSize="1.5rem" title="Số lượng">
                    {item.ads.reduce((totalQuantity, ad) => totalQuantity + ad.quantity, 0)}
                  </Typography>
                </Box>
              ))}
              </Box>
            </Box>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    required
                    id="standard-required"
                    label="Tên chiến dịch con"
                    value={rowsDataCampaign[0].subCampaigns[selectedBox].name || ''}
                    variant="standard"
                    fullWidth
                    onChange={(event) => {
                      const newData = [...rowsDataCampaign];
                      newData[0].subCampaigns[selectedBox].name = event.target.value;
                      setRowDataCampaign(newData);
                    }}
                  />
                </Grid>
                <Grid item xs={4} sx={{textAlign: "center"}}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rowsDataCampaign[0].subCampaigns[selectedBox].status}
                        onChange={() => {
                          const newStatus = [...subCampaignStatus];
                          newStatus[selectedBox] = !newStatus[selectedBox];
                          setSubCampaignStatus(newStatus);

                          const newData = [...rowsDataCampaign];
                          newData[0].subCampaigns[selectedBox].status = newStatus[selectedBox];
                          setRowDataCampaign(newData);
                        }}
                      />
                    }
                    label="Đang hoạt động"
                  />
                </Grid>
              </Grid>
              <Typography variant="h6" component="h6" mt={2} p={2}>
                DANH SÁCH QUẢNG CÁO
              </Typography>
              {selectedBox !== null && (
                <DataTable
                  isSubmit={isSubmit}
                  data={rowsDataCampaign[0].subCampaigns[selectedBox]}
                  selectedBox={selectedBox}
                  setRowsDataCampaign={setRowDataCampaign}
                />
              )}
          </TabPanel>
        </Box>
      </TabContext>
    </>
  )
}

export default Campaign;

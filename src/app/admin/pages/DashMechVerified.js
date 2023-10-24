"use-client";
import React, { useState, useEffect } from "react";
import "./DashBoard.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TextField,
} from "@mui/material";
import { MdBlock } from "react-icons/md";
import UpdateMech from "./UpdateMech";
import { SendMail } from "@/lib/SendMail";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashMechVerified = ({ MechDetails }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMechDetails, setFilteredMechDetails] = useState([]);

  const updateStatusBlock = (id, userEmail,userName) => {
    let value = "Block";
    UpdateMech(id, value);
    const mail = {
      Email:userEmail,
      Name:userName, 
    }
    handleSendEmail(mail);
  };

  const handleSendEmail = async (content) => {
    const emailSent = await SendMail({
      status: "verified",
      to: content.Email,
      subject: "Status: Blocked by RideFixr",
      text: `Dear ${content.Name},\n\nYou have been blocked by the RideFixr admin due to multiple negative remarks 
      and low ratings from users. We value your contributions but, unfortunately, we cannot continue your 
      service at this time.\n\nIf you have any questions or would like to discuss this further, 
      please feel free to contact us.\n\nThank you for considering RideFixr.\n\nBest regards, \nThe RideFixr Team`,
    });
  };

  // Function to filter data based on search query
  const filterMechDetails = (query) => {
    try {
      const filtered = MechDetails.filter(
        (item) =>
          item.Status === "Verified" &&
          (item.UserName.toLowerCase().includes(query.toLowerCase()) ||
            item.City.toLowerCase().includes(query.toLowerCase()) ||
            item.MechType.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredMechDetails(filtered);
    } catch (error) {
      toast.warning('Error in filtering mechanic!', {
        position: toast.POSITION.BOTTOM_CENTER
    });
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      // When the search query is empty, show all items with status "Verified"
      try{
        const verifiedMechanics = MechDetails.filter((item) => item.Status === "Verified");
      // Reverse the array to show it in reverse order
        setFilteredMechDetails(verifiedMechanics.reverse());
      } catch (error) {
        toast.warning('Error in filtering mechanic!', {
          position: toast.POSITION.BOTTOM_CENTER
      });
      }
    } else {
      filterMechDetails(searchQuery);
    }
  }, [searchQuery, MechDetails]);

  return (
    <div className="DashUsers">
      <div className="Search-bar">
      <input
            type="text"
            placeholder="Search by Name, MechType, City"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="table-data">
        {filteredMechDetails.length === 0 ? (
          <h1>No matching data found</h1>
        ) : (
          <TableContainer sx={{ maxHeight: 440}}  component={Paper}>
          <Table stickyHeader >
            <TableHead >
              <TableRow >
              <TableCell>S.NO</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Phone</TableCell>
                <TableCell align="center">Mech Type</TableCell>
                <TableCell align="center">City</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMechDetails.map((item, index) => (
                <TableRow key={index}>
                   <TableCell>{index+1}</TableCell>
                  <TableCell>{item.UserName}</TableCell>
                  <TableCell align="center">{item.Email}</TableCell>
                  {/* <TableCell align="center">{item.Password}</TableCell> */}
                  <TableCell align="center">{item.PhoneNo}</TableCell>
                  <TableCell align="center">{item.MechType}</TableCell>
                  <TableCell align="center">{item.City}</TableCell>
                  <TableCell align="center">
                    <MdBlock
                      className="icons"
                      onClick={() => updateStatusBlock(item._id, item.Email, item.UserName)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default DashMechVerified;

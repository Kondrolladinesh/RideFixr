"use-client"
import React, { useState } from "react";
import "./DashBoard.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
} from "@mui/material";

const DashUsers = ({ UserDetails }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter the UserDetails based on the searchQuery
  const filteredUsers = UserDetails.filter((user) =>
    user.UserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="DashUsers">
      {/* Search bar */}
      <div className="Search-bar">
        <input
            type="text"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <TableContainer sx={{ maxHeight: 440}}  component={Paper}>
          <Table stickyHeader >
        <TableHead>
          <TableRow>
          <TableCell>S.NO</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="center">Email</TableCell>
            {/* <TableCell align="center">Password</TableCell> */}
            <TableCell align="center">Phone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className="table">
          {Array.isArray(filteredUsers)
            ? filteredUsers.map((item,index) => (
                <TableRow
                  key={item._id}
                >
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{item.UserName}</TableCell>
                  <TableCell align="center">{item.Email}</TableCell>
                  {/* <TableCell align="center">{item.Password}</TableCell> */}
                  <TableCell align="center">{item.PhoneNo}</TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
      </TableContainer>
    </div>
  );
};

export default DashUsers;

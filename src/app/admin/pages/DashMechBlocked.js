"use-client";
import "./DashBoard.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import { FcApproval } from "react-icons/fc";
import { useState, useEffect } from "react";
import UpdateMech from "./UpdateMech";
import { SendMail } from "@/lib/SendMail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashMechBlocked = ({ MechDetails }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMechDetails, setFilteredMechDetails] = useState([]);

  const updateStatusActive = (id, userEmail, userName) => {
    let value = "Verified";
    UpdateMech(id, value);
    const mail = {
      Email: userEmail,
      Name: userName,
    };
    handleSendEmail(mail);
  };

  const handleSendEmail = async (content) => {
    const emailSent = await SendMail({
      status: "blocked",
      to: content.Email,
      subject: "Status: Blocked by RideFixr",
      text: `Congratulations ${content.Name}!!,\n\nYou have been unblocked and verified by the RideFixr admin
       after providing valid documentation and reasons. You're all set to continue providing your valuable 
       services to our users.\n\nThank you for joining us again!\n\nBest regards, \nThe RideFixr Team`,
    });
  };

  // Function to check if an item matches the search query
  const isItemMatchingSearchQuery = (item, searchQuery) => {
    const keywords = searchQuery.toLowerCase().split(" ");
    return keywords.every((keyword) =>
      [
        item.UserName.toLowerCase(),
        item.Email.toLowerCase(),
        item.MechType.toLowerCase(),
        item.City.toLowerCase(),
      ].some((field) => field.includes(keyword))
    );
  };

  // Filter MechDetails based on the search query and "Block" status
  useEffect(() => {
    // Filter the MechDetails based on the search query and status "Pending"
    try {
      const filteredData = MechDetails.filter((item) => {
        return (
          item.Status === "Block" &&
          isItemMatchingSearchQuery(item, searchQuery)
        );
      });
      setFilteredMechDetails(filteredData.reverse());
    } catch (error) {
      toast.warning("Error in filtering mechanic!", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  }, [MechDetails, searchQuery]);

  return (
    <div className="DashUsers">
      <div className="Search-bar">
        <input
          type="text"
          placeholder="Search by Name, MechType, City"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
      </div>
      <div className="table-data">
        {filteredMechDetails.length === 0 ? (
          <p>No data found.</p>
        ) : (
          <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>S.NO</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  {/* <TableCell align="center">Password</TableCell> */}
                  <TableCell align="center">Phone</TableCell>
                  <TableCell align="center">Mech Type</TableCell>
                  <TableCell align="center">City</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMechDetails.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.UserName}</TableCell>
                    <TableCell align="center">{item.Email}</TableCell>
                    {/* <TableCell align="center">{item.Password}</TableCell> */}
                    <TableCell align="center">{item.PhoneNo}</TableCell>
                    <TableCell align="center">{item.MechType}</TableCell>
                    <TableCell align="center">{item.City}</TableCell>
                    <TableCell align="center">
                      <FcApproval
                        className="icons"
                        onClick={() =>
                          updateStatusActive(
                            item._id,
                            item.Email,
                            item.UserName
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default DashMechBlocked;

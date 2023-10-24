"use client";
import { useState, useEffect } from "react";
import "./DashBoard.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper
} from "@mui/material";
import { FcApproval, FcFinePrint } from "react-icons/fc";
import { MdBlock } from "react-icons/md";
import Modal from "react-modal";
import PDFViewer from "./PDFViewer";
import UpdateMech from "./UpdateMech";
import { SendMail } from "@/lib/SendMail";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashMechPending = ({ MechDetails }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [activeProfile, setActiveProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMechDetails, setFilteredMechDetails] = useState([]);

  useEffect(() => {
    // Filter the MechDetails based on the search query and status "Pending"
    try{
      const filteredData = MechDetails.filter(
        (item) => item.Status === "Pending" && isItemMatchingSearchQuery(item)
      );
      setFilteredMechDetails(filteredData.reverse());
    }catch(error){
      toast.warning('Error in filtering mechanic!', {
        position: toast.POSITION.BOTTOM_CENTER
    });
    }
  }, [MechDetails, searchQuery]);

  const isItemMatchingSearchQuery = (item) => {
    const searchKeywords = searchQuery.toLowerCase().split(" ");
    return searchKeywords.every((keyword) =>
      [
        item.UserName.toLowerCase(),
        item.City.toLowerCase(),
        item.MechType.toLowerCase(),
      ].some((field) => field.includes(keyword))
    );
  };

  const handleSendEmail = async (content) => {
    let emailSubject = content.Value === "Verified" ? 'Verified By RideFixr' : 'Registration Update';
    let emailText = content.Value === "Verified"
      ? `Congratulations ${content.Name}!!,\n\nYou are now a verified mechanic on RideFixr. You're all set to provide 
      your valuable services to our users.\n\n Thank you for joining us! \n\nBest regards, \nThe RideFixr Team`
      : `Dear ${content.Name},\n\nWe regret to inform you that your registration as a mechanic on RideFixr 
      has not been approved at this time. We appreciate your interest and encourage you to contact us 
      if you have any questions. \n\nThank you for considering RideFixr.\n\nBest regards, \nThe RideFixr Team`;
  
    const emailSent = await SendMail({
      status: "pending",
      to: content.Email,
      subject: emailSubject,
      text: emailText,
    });
  }

  const updateStatusActive = (id, userEmail,userName) => {
    let value = "Verified";
    UpdateMech(id, value);
    const mail = {
      Email:userEmail,
      Name:userName, 
      Value: value
    }
    handleSendEmail(mail);
  };
  const updateStatusBlock = (id, userEmail,userName) => {
    let value = "Block";
    UpdateMech(id, value);
    const mail = {
      Email:userEmail,
      Name:userName, 
      Value: value
    }
    handleSendEmail(mail);
  };

  const handlePdfClose=()=>{
    setActiveProfile(!activeProfile);
  }

  const FindPDFOfMech = async (mech_id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/mechanicPDF/${mech_id}`);
      const userData = await response.json();
      if (userData.success) {
        viewDocument(userData.result.UploadFile);
      } else {
        console.error("Data retrieval was not successful");
      }
    } catch (error) {
      console.error("Error in getUserDetails:", error);
      throw error;
    }
  };

  const viewDocument = (base64Data) => {
    // Split the data URL by ","
    const parts = base64Data.split(",");

    if (parts.length === 2) {
      // Extract the MIME type
      const mimeType = parts[0].match(/:(.*?);/)[1];

      // Extract the base64 data
      const base64 = parts[1];

      // Convert base64 to Uint8Array
      const uint8Array = new Uint8Array(
        atob(base64)
          .split("")
          .map((char) => char.charCodeAt(0))
      );

      // Create a Blob with the Uint8Array data
      const blob = new Blob([uint8Array], { type: mimeType });

      // Create a URL for the Blob
      setPdfUrl(URL.createObjectURL(blob));
      setActiveProfile(!activeProfile);
    } else {
      console.error("Invalid base64 data URL format");
      return null;
    }
  };

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
          <TableContainer sx={{ maxHeight: 440}}  component={Paper}>
          <Table stickyHeader={activeProfile ? false : true}>
            <TableHead>
              <TableRow>
              <TableCell>S.NO</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Phone</TableCell>
                <TableCell align="center">Mech Type</TableCell>
                <TableCell align="center">City</TableCell>
                <TableCell align="center">View</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredMechDetails)
                ? filteredMechDetails.map((item,index) => (
                    <TableRow key={item._id}>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{item.UserName}</TableCell>
                      <TableCell align="center">{item.Email}</TableCell>
                      <TableCell align="center">{item.PhoneNo}</TableCell>
                      <TableCell align="center">{item.MechType}</TableCell>
                      <TableCell align="center">{item.City}</TableCell>
                      <TableCell align="center">
                        <FcFinePrint
                          className="icons"
                          onClick={() => FindPDFOfMech(item._id)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <div className="status-icons">
                          <FcApproval
                            className="icons"
                            onClick={() => updateStatusActive(item._id, item.Email, item.UserName)}
                          />
                          <MdBlock
                            className="icons"
                            onClick={() => updateStatusBlock(item._id, item.Email, item.UserName)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
          </TableContainer>
        )}
      </div>
      <Modal
        backdrop="transparent"
        isOpen={activeProfile}
        onRequestClose={() => setActiveProfile(!activeProfile)}
        className="pdf-modal"
      >
        <PDFViewer pdfData={pdfUrl} onPdfClose={handlePdfClose} />
      </Modal>
      <ToastContainer/>
    </div>
  );
};

export default DashMechPending;

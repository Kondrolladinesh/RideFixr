"use client";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./DashBoard.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  AiOutlineDownload,
  AiOutlineLeftCircle,
  AiOutlineRightCircle,
  AiOutlineZoomIn,
  AiOutlineZoomOut,
  AiOutlineCloseSquare,
} from "react-icons/ai";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfData, onPdfClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);


  const handleDownload = () => {
    if (pdfData) {
      const a = document.createElement("a");
      a.href = pdfData;
      a.download = "document.pdf";
      a.click();
    }
  };

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const handleZoomChange = (newZoom) => {
    setZoom(newZoom);
  };

  return (
    <div className="pdf-container">
      <div className="pdf-control-buttons">
        <div className="panel1">
          <button onClick={() => handleZoomChange(zoom - 0.1)}>
            Zoom Out <AiOutlineZoomOut className="icons" />
          </button>
          <button onClick={() => handleZoomChange(zoom + 0.1)}>
            Zoom In <AiOutlineZoomIn className="icons" />
          </button>
        </div>
        <div className="panel1">
          <button onClick={handleDownload}>
            Download PDF <AiOutlineDownload className="icons" />
          </button>
          <AiOutlineCloseSquare className="cancle-icon" onClick={()=>{onPdfClose()}}/>
        </div>
      </div>
      <div className="pdf-view">
        <Document file={pdfData} onLoadSuccess={handleDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={zoom} renderMode="canvas" />
        </Document>
      </div>
      <div className="pdf-control-buttons">
        <div className="panel1">
          <button
            onClick={() =>
              handlePageChange(pageNumber > 1 ? pageNumber - 1 : pageNumber)
            }
          >
            <AiOutlineLeftCircle className="icons" /> Previous Page
          </button>
          <button
            onClick={() =>
              handlePageChange(
                pageNumber < numPages ? pageNumber + 1 : pageNumber
              )
            }
          >
            Next Page <AiOutlineRightCircle className="icons" />
          </button>
        </div>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    </div>
  );
};

export default PDFViewer;

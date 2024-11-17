import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";

function Add() {
  const [fileName, setFileName] = useState("Select FB2 File");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("Select FB2 File");
    }
  };

  const uploadFile = async () => {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("fb2", file);

    try {
      const response = await fetch(
        "https://sharpleaf.biz.ua/avalanche2/upload.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.text();
      window.location.reload();
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <div data-theme="light">
      <Navbar isBordered>
        <NavbarBrand>
          <div className="logo">AVALANCHE BOOKS V.2</div>
        </NavbarBrand>
        <NavbarContent
          className="hidden sm:flex gap-4"
          justify="center"
        ></NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <NavLink to="/" className="navbar-item">
              Books
            </NavLink>
          </NavbarItem>
          <NavbarItem>
            <NavLink to="/add" className="navbar-item">
              Add Book
            </NavLink>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="main-add-books">
        <div className="dot"></div>
        <div className="container">
          <div className="add-box">
            <input
              id="fileInput"
              type="file"
              className="custom-input"
              accept=".fb2"
              onChange={handleFileChange}
            />
            <div className="custom-input-info">{fileName}</div>
          </div>
          <div className="add-fb2-container">
            <Button onClick={uploadFile}>Add Book</Button>
          </div>
        </div>
      </div>
      <div className="footer">Malignant Corporation 2023-2024</div>
    </div>
  );
}

export default Add;

import "../src/App";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";

function Books() {
  async function fetchData() {
    try {
      const response = await fetch(
        "https://avalanche.books.sharpleaf.biz.ua/nodeapi"
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then((data) => {
        if (data) {
          setBooks(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-theme="light">
      <Navbar isBordered className="iwilllosenavbar">
        <NavbarBrand></NavbarBrand>
        <NavbarContent className=" sm:flex gap-4" justify="center">
          <div className="logo">AVALANCHE BOOKS</div>
        </NavbarContent>
        <NavbarContent justify="end">
          {/* <NavbarItem>
            <NavLink to="/" className="navbar-item">
              Books
            </NavLink>
          </NavbarItem> */}
          {/* <NavbarItem>
            <NavLink to="/add" className="navbar-item">
              Add Book
            </NavLink>
          </NavbarItem> */}
        </NavbarContent>
      </Navbar>
      <div className="main-all-books">
        <div className="container">
          {loading ? (
            <div>
              <span className="loader"></span>
            </div>
          ) : books && books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="book">
                <div className="book-container">
                  <div className="top-box">
                    <div className="info-box">
                      <div className="book-title">{book.title}</div>
                      <div className="book-author">{book.author}</div>
                      <NavLink to={`/read/${book.id}`} className="read-btn">
                        READ
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No books available</div>
          )}
        </div>
      </div>
      <div className="footer">Malignant Corporation 2023-2024</div>
    </div>
  );
}

export default Books;

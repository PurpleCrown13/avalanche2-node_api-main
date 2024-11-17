import "../src/App";
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../css/Read.css";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Progress } from "@nextui-org/react";
import { Slider } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { themes } from "../components/themes";
function ReadTwoColumns() {
  const {
    isOpen: isContentModalOpen,
    onOpen: onContentModalOpen,
    onOpenChange: onContentModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isColorModalOpen,
    onOpen: onColorModalOpen,
    onOpenChange: onColorModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isFontModalOpen,
    onOpen: onFontModalOpen,
    onOpenChange: onFontModalOpenChange,
  } = useDisclosure();
  const [bookChapters, setBookChapters] = useState([]);
  const containerRef = useRef(null);
  const [progressText, setProgressText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalColumns, setTotalColumns] = useState(0);
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch(
          `https://avalanche.books.sharpleaf.biz.ua/nodeapi?id=${id}`
        );
        const data = await response.json();
        const foundBook = data[id - 1];
        if (foundBook) {
          setBook(foundBook.fb2path);
          setTitle(foundBook.title);
        } else {
          console.log("Book not found");
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    }

    fetchBook();
  }, [id]);
  useEffect(() => {
    const container = document.querySelector(".two-columns-container");
    if (container) {
      const columnWidth =
        container.clientWidth + parseInt(getComputedStyle(container).columnGap);
      const updateTotalColumns = () => {
        const totalColumns = Math.ceil(container.scrollWidth / columnWidth);
        setTotalColumns(totalColumns);
        const text = `Page ${currentPage} of ${totalColumns}`;
        setProgressText(text);
      };

      const updateProgressText = () => {
        const currentPage = Math.ceil(container.scrollLeft / columnWidth) + 1;
        setCurrentPage(currentPage);
        const text = `Page ${currentPage} of ${totalColumns}`;
        setProgressText(text);
      };

      const handleWheelScroll = (event) => {
        const container = document.querySelector(".two-columns-container");
        const columnWidth =
          container.clientWidth +
          parseInt(getComputedStyle(container).columnGap);
        container.scrollLeft += event.deltaY > 0 ? columnWidth : -columnWidth;
      };

      container.addEventListener("wheel", handleWheelScroll);
      container.addEventListener("scroll", updateProgressText);
      window.addEventListener("resize", updateTotalColumns);
      updateProgressText();
      updateTotalColumns();

      return () => {
        container.removeEventListener("scroll", updateProgressText);
        container.removeEventListener("wheel", handleWheelScroll);
        window.removeEventListener("resize", updateTotalColumns);
      };
    }
  }, [currentPage, bookChapters, totalColumns]);

  const getSavedTheme = () => {
    return localStorage.getItem("selectedTheme") || "default";
  };
  const getSavedFont = () => {
    return localStorage.getItem("selectedFont") || "main-font-light";
  };
  const getSavedChapter = () => {
    const savedChapter = localStorage.getItem(`selectedChapter_${id}`);
    return savedChapter !== null ? parseInt(savedChapter) : 0;
  };
  const [selectedTheme, setSelectedTheme] = useState(getSavedTheme);
  const [selectedFont, setSelectedFont] = useState(getSavedFont());
  const [selectedChapter, setSelectedChapter] = useState(getSavedChapter());
  const handleChangeTheme = (event) => {
    const theme = event.target.value;
    setSelectedTheme(theme);
    localStorage.setItem("selectedTheme", theme);
  };
  const handleChangeFont = (event) => {
    const font = event.target.value;
    setSelectedFont(font);
    localStorage.setItem("selectedFont", font);
  };
  const hasNextChapter = selectedChapter < bookChapters.length - 1;
  const handleChangeChapter = (index) => {
    setSelectedChapter(index);
    localStorage.setItem(`selectedChapter_${id}`, index);
    const container = document.querySelector(".two-columns-container");
    container.scrollLeft = 0;
  };
  const handleChangeFontSize = (value) => {
    setFontSize(value);
    localStorage.setItem("fontSize", value);
  };
  const handleChangeContainerSize = (value) => {
    setContainerSize(value);
    localStorage.setItem("containerSize", value);
  };
  const themeStyles = themes[selectedTheme];
  const handleNextPage = () => {
    const container = document.querySelector(".two-columns-container");
    const columnWidth =
      container.clientWidth + parseInt(getComputedStyle(container).columnGap);
    container.scrollLeft += columnWidth;
  };

  const handlePreviousPage = () => {
    const container = document.querySelector(".two-columns-container");
    const columnWidth =
      container.clientWidth + parseInt(getComputedStyle(container).columnGap);
    container.scrollLeft -= columnWidth;
  };

  const getSavedFontSize = () => {
    return localStorage.getItem("fontSize") || 18;
  };
  const getSavedContainerSize = () => {
    return localStorage.getItem("containerSize") || "800";
  };
  const [fontSize, setFontSize] = useState(getSavedFontSize());
  const [containerSize, setContainerSize] = useState(getSavedContainerSize());
  useEffect(() => {
    if (!book) return;
    fetch(`https://sharpleaf.biz.ua/${book}`)
      .then((response) => response.text())
      .then((fb2Text) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(fb2Text, "text/xml");
        const images = xmlDoc.querySelectorAll("image");
        if (images.length > 0) {
          console.log("Found image tags");
          images.forEach((image) => {
            const href = image.getAttribute("l:href");
            const binary = xmlDoc.querySelector(
              `binary[id="${href.replace("#", "")}"]`
            );
            if (binary) {
              const contentType = binary.getAttribute("content-type");
              if (contentType && contentType.startsWith("image")) {
                const imageData = binary.textContent.trim();
                const base64Image = `data:${contentType};base64,${imageData}`;
                const img = document.createElement("img");
                img.src = base64Image;
                img.classList.add("variable-image");
                image.parentElement.replaceChild(img, image);
              }
            }
          });
        }
        const sections = xmlDoc.getElementsByTagName("section");
        const chapters = [];
        if (sections) {
          for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const title = section.getElementsByTagName("title")[0];
            const chapterNumber = i + 1;
            const chapterTitle = title
              ? title.textContent.trim()
              : `Chapter ${chapterNumber}`;

            // Извлекаем параграфы, исключая <title> теги
            const paragraphs = Array.from(section.getElementsByTagName("p"))
              .filter((p) => !p.closest("title"))
              .map((p) => p.outerHTML);

            // Обрабатываем изображения
            const contentWithImages = paragraphs
              .join("")
              .replace(/<image l:href="#([^"]+)"\/>/g, (match, id) => {
                const binary = xmlDoc.querySelector(`binary[id="${id}"]`);
                if (binary) {
                  const contentType = binary.getAttribute("content-type");
                  if (contentType && contentType.startsWith("image")) {
                    const imageData = binary.textContent.trim();
                    const base64Image = `data:${contentType};base64,${imageData}`;
                    return `<img src="${base64Image}" class="chapter-image" />`;
                  }
                }
                return match;
              });

            chapters.push({
              number: chapterNumber,
              title: chapterTitle,
              content: contentWithImages,
            });
          }
          setBookChapters(chapters);
        }
      })
      .catch((error) => console.error("Error loading fb2 file:", error))
      .finally(() => setLoading(false));
  }, [book, currentPage, totalColumns]);

  useEffect(() => {
    const savedChapter = localStorage.getItem(`selectedChapter_${id}`);
    if (savedChapter !== null) {
      setSelectedChapter(parseInt(savedChapter));
    }
  }, []);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    function handleResize() {
      const navbarHeight = document.querySelector(".bashka").clientHeight;
      const pageProgressHeight =
        document.querySelector(".page-progress").clientHeight;
      const windowHeight = document.documentElement.clientHeight;
      const maxHeight = windowHeight - navbarHeight - pageProgressHeight - 1;
      setMaxHeight(maxHeight);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const highlightQuotedText = (content) => {
    // Регулярное выражение для поиска текста в типографских и обычных кавычках
    const regex = /“([^”]*)”|\"([^\"]*)\"/g;

    // Очищаем текст от XML-тегов, оставляя только внутренний текст
    const cleanText = content.replace(/<[^>]+>/g, "");

    // Применяем выделение только к тексту внутри кавычек
    return cleanText.replace(regex, (match, p1, p2) => {
      const quotedText = p1 || p2;
      return `<span class="highlight-quote">"${quotedText}"</span>`;
    });
  };

  // Пример использования функции для рендера главы
  const renderChapterContent = (content) => {
    return (
      content
        // Удаляем содержимое внутри <title>...</title>, чтобы оно не дублировалось
        .replace(/<title>.*?<\/title>/gs, "")
        .split(/<\/?p>/g) // Разделяем текст на параграфы
        .filter((text) => text.trim()) // Убираем пустые строки
        .map((text, index) => (
          <p
            key={index}
            dangerouslySetInnerHTML={{ __html: highlightQuotedText(text) }}
          />
        ))
    );
  };

  return (
    <div style={themeStyles}>
      <Navbar
        shouldHideOnScroll
        isBordered
        maxWidth="2xl"
        style={themeStyles}
        className="bashka"
      >
        <NavbarContent className="iwillwinnavbar">
          <NavbarContent className="iwlillwin-mini-box">
            <NavbarItem>
              <Button className="defect-button">
                <NavLink to={`/read/${id}`} className="navbar-item-defect">
                  <img src="/icon5.svg" alt="SVG Icon" />
                </NavLink>
              </Button>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent className="center-two-column-box">
            <div className="read-book-title">
              {bookChapters.length === 1
                ? ""
                : bookChapters.length > 0 &&
                  bookChapters[selectedChapter] &&
                  `(${bookChapters[selectedChapter].number})`}
              &nbsp;
              {bookChapters.length === 1
                ? ""
                : bookChapters.length > 0 &&
                  bookChapters[selectedChapter] &&
                  bookChapters[selectedChapter].title}{" "}
            </div>
            <p className="read-book-title">
              {bookChapters.length < 2 ? "" : title}
            </p>
            <p className="read-book-title">
              {bookChapters.length < 2 ? (
                ""
              ) : (
                <div className="read-book-title">{progressText}</div>
              )}
            </p>
          </NavbarContent>
          <NavbarContent className="iwlillwin-mini-box">
            <NavbarItem>
              {bookChapters.length < 2 ? (
                <div className="read-book-title">{progressText}</div>
              ) : (
                <Button className="burger-button" onClick={onContentModalOpen}>
                  <img src="/icon2.svg" alt="SVG Icon" />
                </Button>
              )}
            </NavbarItem>
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      <Modal
        isOpen={isContentModalOpen}
        onOpenChange={onContentModalOpenChange}
        scrollBehavior="inside"
        style={themeStyles}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 next-mod-header">
            Table of Contents
          </ModalHeader>
          <ModalBody>
            <ul>
              {bookChapters.map((chapter, index) => (
                <li key={index}>
                  <Button
                    onClick={() => {
                      setSelectedChapter(index);
                      handleChangeChapter(index);
                    }}
                    className={`table-content-item ${
                      selectedChapter === index ? "current-chapter" : ""
                    }`}
                  >
                    ({chapter.number}) {chapter.title}
                  </Button>
                </li>
              ))}
            </ul>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <div style={themeStyles} className="page-progress">
        <Progress
          value={currentPage}
          maxValue={totalColumns}
          className="max-w-min"
          size="sm"
          color="secondary"
        />
      </div>
      <div
        className="two-columns-main-read"
        ref={containerRef}
        style={{
          ...themeStyles,
          fontFamily: selectedFont,
        }}
      >
        <button
          className="page-change-btn"
          onClick={handlePreviousPage}
          style={themeStyles}
        >
          <img src="/icon8.svg" alt="SVG Icon" />
        </button>
        <div
          className="two-columns-container"
          style={{
            fontSize: `${fontSize}px`,
            width: `${containerSize}px`,
            maxHeight: `${maxHeight}px`,
          }}
        >
          {loading ? (
            <div className="loader-two-column-container ">
              <span className="loader"></span>
            </div>
          ) : bookChapters[selectedChapter] ? (
            <div>
              <p className="chapter">
                {bookChapters.length < 2
                  ? title
                  : bookChapters[selectedChapter].title}
              </p>
              <p>
                {bookChapters[selectedChapter].titleParagraph ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: bookChapters[selectedChapter].titleParagraph,
                    }}
                  />
                ) : null}
              </p>

              <div>
                {bookChapters[selectedChapter] &&
                  renderChapterContent(bookChapters[selectedChapter].content)}
              </div>
              {hasNextChapter ? (
                <div className="read-two-columns-btn-container">
                  <Button
                    onClick={() => handleChangeChapter(selectedChapter + 1)}
                    className="navbar-item "
                  >
                    Next Chapter
                    <img
                      src="/icon7.svg"
                      alt="SVG Icon"
                      style={{ marginLeft: "4px" }}
                    />
                  </Button>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ) : (
            <p>No chapters available</p>
          )}
        </div>
        <button
          className="page-change-btn"
          onClick={handleNextPage}
          style={themeStyles}
        >
          <img src="/icon9.svg" alt="SVG Icon" />
        </button>
      </div>
    </div>
  );
}
export default ReadTwoColumns;

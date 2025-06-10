import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import { FiEdit3, FiActivity, FiClock } from "react-icons/fi";
import styles from "./RealTimeEditor.module.css";
import conf from "../../conf/conf";

// Content cleaning utility
const cleanHTMLContent = (htmlContent) => {
  if (!htmlContent) return "";

  return (
    htmlContent
      // Remove unwanted data attributes
      .replace(/data-start="[^"]*"/g, "")
      .replace(/data-end="[^"]*"/g, "")
      .replace(/data-col-size="[^"]*"/g, "")
      .replace(/tabindex="-1"/g, "")
      // Remove generated class names with underscores
      .replace(/class="_[^"]*_[^"]*"/g, "")
      .replace(/class="[^"]*group flex[^"]*"/g, "")
      // Remove wrapper divs that aren't semantic
      .replace(/<div[^>]*_tableContainer[^>]*>/g, "")
      .replace(/<div[^>]*_tableWrapper[^>]*>/g, "")
      .replace(/<div[^>]*sticky end-[^>]*>/g, "")
      .replace(/<div[^>]*absolute end-[^>]*>&nbsp;<\/div>/g, "")
      // Clean up extra whitespace and empty tags
      .replace(/\s+/g, " ")
      .replace(/<([^>]+)>\s*<\/\1>/g, "")
      .trim()
  );
};

// Content validation
const validateContent = (value, maxLength = 45000) => {
  if (!value || value.trim().length === 0) {
    return "Content is required";
  }

  const cleanedContent = cleanHTMLContent(value);
  if (cleanedContent.length > maxLength) {
    return `Content is too long (${cleanedContent.length}/${maxLength} characters). Please reduce the length.`;
  }

  return true;
};

export default function RealTimeEditor({
  name,
  control,
  defaultValue = "",
  error,
  maxLength = 45000,
  rules = {},
}) {
  // Check for dark-theme class
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark-theme") ||
      document.body.classList.contains("dark-theme") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const [contentLength, setContentLength] = useState(0);
  const [isContentValid, setIsContentValid] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  // Listen for dark-theme class changes
  useEffect(() => {
    const checkDarkMode = () => {
      const hasDarkClass =
        document.documentElement.classList.contains("dark-theme") ||
        document.body.classList.contains("dark-theme") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      setIsDarkMode(hasDarkClass);
    };

    // Create MutationObserver to watch for class changes
    const observer = new MutationObserver(checkDarkMode);

    // Watch for class changes on both html and body
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkDarkMode);

    // Initial check
    checkDarkMode();

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkDarkMode);
    };
  }, []);

  // Update content stats when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      const cleanedContent = cleanHTMLContent(defaultValue);
      setContentLength(cleanedContent.length);
      setIsContentValid(cleanedContent.length <= maxLength);

      const words = cleanedContent
        .replace(/<[^>]*>/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      setWordCount(words);
      setReadingTime(Math.ceil(words / 200));
    }
  }, [defaultValue, maxLength]);

  // Get content style based on dark mode
  const getContentStyle = () => {
    return isDarkMode
      ? `
        body { 
          font-family: Arial; 
          font-size: 16px;
          line-height: 1.7;
          color: #e5e7eb;
          padding: 24px;
          background: #1e2837;
        }
        h1, h2, h3, h4, h5, h6 { 
          color: #f3f4f6; 
          margin-top: 1.5em; 
          margin-bottom: 0.5em;
          font-weight: 700;
          line-height: 1.3;
        }
        p { 
          margin-bottom: 1.2em; 
          line-height: 1.7;
        }
        img { 
          max-width: 100%; 
          height: auto; 
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          margin: 1.5rem 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5rem 0;
          background: #2c3b4f;
          border-radius: 8px;
          overflow: hidden;
        }
        th, td {
          border: 1px solid #3a4a5f;
          padding: 12px;
          text-align: left;
        }
        th {
          background: #354056;
          font-weight: 600;
          color: #f9fafb;
        }
        td {
          background: #2c3b4f;
          color: #e5e7eb;
        }
        blockquote {
          border-left: 4px solid #6366f1;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #d1d5db;
          background: #2c3b4f;
          padding: 1rem;
          border-radius: 0 8px 8px 0;
        }
        ul, ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        li {
          margin-bottom: 0.5rem;
        }
        code {
          background: #2c3b4f;
          color: #f9fafb;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        }
        pre {
          background: #2c3b4f;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }
      `
      : `
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; 
          font-size: 16px;
          line-height: 1.7;
          color: #374151;
          padding: 24px;
          background: white;
        }
        h1, h2, h3, h4, h5, h6 { 
          color: #111827; 
          margin-top: 1.5em; 
          margin-bottom: 0.5em;
          font-weight: 700;
          line-height: 1.3;
        }
        p { 
          margin-bottom: 1.2em; 
          line-height: 1.7;
        }
        img { 
          max-width: 100%; 
          height: auto; 
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
          margin: 1.5rem 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5rem 0;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 12px;
          text-align: left;
        }
        th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        td {
          background: white;
          color: #374151;
        }
        blockquote {
          border-left: 4px solid #6366f1;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
          background: #f9fafb;
          padding: 1rem;
          border-radius: 0 8px 8px 0;
        }
        ul, ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        li {
          margin-bottom: 0.5rem;
        }
        code {
          background: #f3f4f6;
          color: #1f2937;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        }
        pre {
          background: #f3f4f6;
          color: #1f2937;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }
      `;
  };

  // Handle content change
  const handleContentChange = (content, onChange) => {
    const cleanedContent = cleanHTMLContent(content);
    setContentLength(cleanedContent.length);
    setIsContentValid(cleanedContent.length <= maxLength);

    const words = cleanedContent
      .replace(/<[^>]*>/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200));

    onChange(cleanedContent);
  };

  // Merge validation rules
  const validationRules = {
    required: "Content is required",
    validate: (value) => validateContent(value, maxLength),
    ...rules,
  };

  // Get stats status for styling
  const getStatsStatus = () => {
    if (contentLength > maxLength * 0.9) return "danger";
    if (contentLength > maxLength * 0.8) return "warning";
    return "success";
  };

  return (
    <div className={styles.rteContainer}>
      <Controller
        name={name || "content"}
        control={control}
        rules={validationRules}
        render={({ field: { onChange, value } }) => (
          <div
            className={`${styles.editorWrapper} ${
              isDarkMode ? styles.darkMode : ""
            }`}
          >
            <Editor
              apiKey={conf.editorApiKey}
              value={value || defaultValue}
              init={{
                height: 600,
                menubar: "file edit view insert format tools table help", 
                menu: {
                  file: {
                    title: "File",
                    items: "newdocument restoredraft | preview | export print",
                  },
                  edit: {
                    title: "Edit",
                    items: "undo redo | cut copy paste pastetext | selectall | searchreplace",
                  },
                  view: {
                    title: "View",
                    items: "code | visualaid visualchars visualblocks | spellchecker | preview fullscreen",
                  },
                  insert: {
                    title: "Insert",
                    items: "image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime",
                  },
                  format: {
                    title: "Format",
                    items: "bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat",
                  },
                  tools: {
                    title: "Tools",
                    items: "spellchecker spellcheckerlanguage | code wordcount",
                  },
                  table: {
                    title: "Table",
                    items: "inserttable | cell row column | tableprops deletetable",
                  },
                  help: { 
                    title: "Help", 
                    items: "help" 
                  },
                },
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                  "emoticons",
                  "codesample",
                  "hr",
                  "pagebreak",
                  "nonbreaking",
                  "toc",
                ],
                toolbar: "undo redo | blocks fontfamily | bold italic underline strikethrough forecolor backcolor | bullist numlist | alignleft aligncenter alignright alignjustify",
                toolbar_mode: "wrap",
                toolbar_sticky: true,
                toolbar_sticky_offset: 0,
                content_style: getContentStyle(),
                skin: isDarkMode ? "oxide-dark" : "oxide",
                content_css: isDarkMode ? "dark" : "default",
                branding: false,
                promotion: false,
                resize: true,
                statusbar: false,
                elementpath: false,
                setup: (editor) => {
                  editor.on("change keyup setcontent", () => {
                    const content = editor.getContent();
                    handleContentChange(content, onChange);
                  });
                },
              }}
              onEditorChange={(content) =>
                handleContentChange(content, onChange)
              }
            />

            <div
              className={`${styles.editorFooter} ${styles[getStatsStatus()]} ${
                isDarkMode ? styles.darkModeFooter : ""
              }`}
            >
              <div className={styles.footerContent}>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <FiEdit3 size={16} />
                    </div>
                    <div className={styles.statInfo}>
                      <div className={styles.statValue}>
                        {wordCount.toLocaleString()}
                      </div>
                      <div className={styles.statLabel}>WORDS</div>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <FiActivity size={16} />
                    </div>
                    <div className={styles.statInfo}>
                      <div
                        className={`${styles.statValue} ${
                          !isContentValid ? styles.invalid : ""
                        }`}
                      >
                        {contentLength.toLocaleString()}
                      </div>
                      <div className={styles.statLabel}>CHARACTERS</div>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <FiClock size={16} />
                    </div>
                    <div className={styles.statInfo}>
                      <div className={styles.statValue}>{readingTime}</div>
                      <div className={styles.statLabel}>MIN READ</div>
                    </div>
                  </div>
                </div>

                <div className={styles.progressSection}>
                  <div className={styles.progressInfo}>
                    <span className={styles.progressLabel}>Content Length</span>
                    <span
                      className={`${styles.progressValue} ${
                        !isContentValid ? styles.invalid : ""
                      }`}
                    >
                      {((contentLength / maxLength) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${
                        styles[getStatsStatus()]
                      }`}
                      style={{
                        width: `${Math.min(
                          (contentLength / maxLength) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  {!isContentValid && (
                    <div className={styles.warningMessage}>
                      <span className={styles.warningIcon}>⚠️</span>
                      Content exceeds maximum length of{" "}
                      {maxLength.toLocaleString()} characters
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      />

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
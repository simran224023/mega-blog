import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import styles from "./RealTimeEditor.module.css";
import conf from "../../conf/conf";

export default function RealTimeEditor({ name, control, defaultValue = "", error }) {
  // Check for dark-theme class
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark-theme') ||
    document.body.classList.contains('dark-theme')
  );
  
  // Listen for dark-theme class changes
  useEffect(() => {
    const checkDarkMode = () => {
      const hasDarkClass = 
        document.documentElement.classList.contains('dark-theme') ||
        document.body.classList.contains('dark-theme');
      
      setIsDarkMode(hasDarkClass);
    };
    
    // Create MutationObserver to watch for class changes
    const observer = new MutationObserver(checkDarkMode);
    
    // Watch for class changes on both html and body
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    // Initial check
    checkDarkMode();
    
    return () => observer.disconnect();
  }, []);

  // Get content style based on dark mode
  const getContentStyle = () => {
    return isDarkMode 
      ? `
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; 
          font-size: 16px;
          line-height: 1.7;
          color: #e5e7eb;
          padding: 24px;
          background: #1f2937;
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
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          margin: 1.5rem 0;
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
      `;
  };

  return (
    <div className={styles.rteContainer}>
      <Controller
        name={name || "content"}
        control={control}
        rules={{ required: "Content is required" }}
        render={({ field: { onChange, value } }) => (
          <div className={styles.editorWrapper}>
            <Editor
              apiKey={conf.editorApiKey}
              value={value || defaultValue}
              init={{
                height: 600,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | link image media table | code preview fullscreen | help',
                content_style: getContentStyle(),
                skin: isDarkMode ? 'oxide-dark' : 'oxide',
                content_css: isDarkMode ? 'dark' : 'default',
                branding: false,
                promotion: false,
                resize: true,
                statusbar: true,
                elementpath: false,
                setup: (editor) => {
                  editor.on('change', () => {
                    onChange(editor.getContent());
                  });
                }
              }}
              onEditorChange={onChange}
            />
          </div>
        )}
      />
      
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
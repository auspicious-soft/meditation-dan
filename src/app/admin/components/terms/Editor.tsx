"use client";
import { Editor } from "@tinymce/tinymce-react";
import React, { useRef, useState, useEffect } from "react";
import { Editor as TinyMCEEditor } from "tinymce";

interface TextEditorProps {
  value?: string;
  setDescription: (content: string) => void;
}

const TextEditor = ({ value = "", setDescription }: TextEditorProps) => {
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<TinyMCEEditor | null>(null);

  // Client-side rendering check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simple direct handler for editor changes
  const handleEditorChange = (content: string) => {
    setDescription(content);
  };

  if (!isClient) {
    return null;
  }

  return (
    <Editor
      apiKey="bfiif5l897h0tnz5633ntzuzxtnccbq360798pls2ilxjs0o"
      value={value}
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      init={{
        height: 300,
        width: "100%",
        menubar: false,
        statusbar: false,
        plugins: "table",
        toolbar:
          "fontfamily fontsizeinput blocks forecolor bold italic underline alignleft aligncenter alignright undo redo | table",
        toolbar_location: "top",
        content_css: "",
        font_family_formats:
          "Normal=arial,helvetica,sans-serif;" +
          "Sans Serif=sans-serif;" +
          "Serif=serif;" +
          "Monospace=monospace",
        content_style: `
                        body {
                          font-family: arial,helvetica,sans-serif;
                          font-size: 14px;
                          margin: 0;
                          padding: 16px;
                          background-color: #1A3F70 !important;
                          color: #e4e4e7;
                        }
                        table {
                          border-collapse: collapse;
                          width: 100%;
                          border-color: #4b5563;
                        }
                        th, td {
                          border: 1px solid #4b5563;
                          padding: 8px;
                        }
                        th {
                          background-color: #1A3F70;
                          color: #e4e4e7;
                        }
                        p, span, div {
                          color: #e4e4e7;
                        }
                      `,
        setup: (editor) => {
          editor.on("init", () => {
            const doc = document;
            const style = doc.createElement("style");
            style.textContent = `
  /* existing styles... */
  
  /* Dropdown styling */
  .tox .tox-selectfield select,
  .tox .tox-listbox,
  .tox .tox-collection__item,
  .tox .tox-menu,
  .tox .tox-collection__item--active,
  .tox .tox-collection__item--enabled {
    background-color: #1A3F70 !important;
    color: white !important;
    border: none !important;
  }

  .tox .tox-collection__item:hover,
  .tox .tox-collection__item--active:hover {
    background-color: #255c9b !important;
    color: white !important;
  }

  .tox .tox-listboxfield .tox-listbox--select {
    background-color: #1A3F70 !important;
    color: white !important;
  }

  .tox .tox-listboxfield .tox-listbox--select svg {
    fill: white !important;
  }

  /* Scrollbar styling for dropdown */
  .tox .tox-collection__group {
    scrollbar-color: #ffffff #1A3F70;
  }

  /* Remove dropdown shadows */
  .tox .tox-menu {
    box-shadow: none !important;
  }
`;

            doc.head.appendChild(style);
          });
        },
        browser_spellcheck: true,
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default TextEditor;

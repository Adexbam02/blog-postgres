const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    // [{ list: "ordered" }, { list: "bullet" }],
    [{ list: "ordered" }],
    ["blockquote", "code-block"],
    [{ color: [] }, { background: [] }],
    ['link', 'image'],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  // "bullet",
  "blockquote",
  "code-block",
  "color",
  "background",
  "link",
  "image",
];

export { modules, formats };




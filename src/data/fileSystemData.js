export const initialFileSystem = {
  id: "root",
  name: "root",
  type: "folder",
  children: [
    { id: "1", name: "index.js", type: "file" },
    {
      id: "2",
      name: "src",
      type: "folder",
      children: [
        { id: "3", name: "App.js", type: "file" },
        {
          id: "4",
          name: "components",
          type: "folder",
          children: []
        }
      ]
    }
  ]
};

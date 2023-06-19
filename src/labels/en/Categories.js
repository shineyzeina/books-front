export const BOOKSS = [
    { id: 'fwef', value: "Science Fiction" },
    { id: 'fwfewf12312', value: "Fantasy" },
    { id: 'fwef32', value: "Romance" },
    { id: 'fwef2f2', value: "Action" },
    { id: 'fwefw232f', value: "Horror" },
    { id: '23f2eqw', value: "Thriller" },
    { id: 'fwefcw1', value: "Documentary" }
  ];

const modifiedBook = {};
  
for (const obj of BOOKSS) {
  modifiedBook[obj.id] = obj.value;
}

export default modifiedBook;  
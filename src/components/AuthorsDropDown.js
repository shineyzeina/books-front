// import DropDown from "./DropDown";
// import { useEffect, useState } from "react";
// import { getAuthorLists } from "./AuthorsList";

// const testAuthors = [
//     'Fifi Abdo', 
//     'Myriam Klink',
//     'Adolf hitler',
//     'Che Gevara'
// ]

// const AuthorsDropDown = ({ value, onChange }) => {
//     const [authorsList, setAuthorsList] = useState(['Initial State']);

//     useEffect(() => {
// 		async function onReady() {
//             const full_list = await getAuthorLists();
//             console.log(full_list);
//             const authorNames = full_list.map(author => `${author.first_name} ${author.last_name}`);
//             console.log(authorsList);
// 			setAuthorsList(full_list);
//         }
// 		onReady()

// 	}, []);
//     console.log("Authors List", authorsList); 
//     return <DropDown value={value} onChange={onChange} options = {
//                                         authorsList
//                                     //  authorsList.map(author => `${author.first_name} ${author.last_name}`)
                                    
//     } />;
//   };
  

// export default AuthorsDropDown;
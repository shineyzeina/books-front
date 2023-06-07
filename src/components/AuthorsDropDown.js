import DropDown from "./DropDown";
import { useEffect, useState } from "react";
import { getAuthorLists } from "./AuthorsList";

const AuthorsDropDown = ({ value, onChange, label }) => {
    const [authorsList, setAuthorsList] = useState(['Initial State']);

    useEffect(() => {
		async function onReady() {
            const authors = await getAuthorLists();
            setAuthorsList(authors);
        }

        
		onReady()

	}, []);
    console.log("Authors List", authorsList); 


    return  (
        <div className="wrap-input100 validate-input m-b-18" style={{ display: 'flex', alignItems: 'center' }}>
            <label className="label-input100" style={{ marginRight: '10px' }}>{label}</label>
					<div style={{ flex: 1 }}>
                        <DropDown value={value} onChange={onChange} options = {
                                authorsList.map( (author) => ({
                                    value: author.id,
                                    label: `${author.first_name} ${author.last_name}` 
                                }))} />
                                
               </div>                 
        </div>
    )
  
}
  

export default AuthorsDropDown;

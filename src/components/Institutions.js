import React, { useState, useEffect } from "react";
import authHeader from "../services/auth-header";
import AuthorService from "../services/author.service";
import EventBus from "../common/EventBus";
import defaultProfile from "../images/profile.png";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { Link } from "react-router-dom";
import { getAuthorLists } from "./AuthorsList"

const currentUser = JSON.parse(localStorage.getItem('user'));

const Institutions = () => {
	const [error, setError] = useState("");
    const [institutions, setInstitutions] = useState([]);




    return (
        <div className="sub-container">
            <table border="0" width="100%" >
                <tr>
                    <td align="left">
                        <Form>
                            <div className="form-group">
                                <Input
                                    type="text"
                                    className="form-control half-width"
                                    name="searchKeyword"
                                    placeholder="search"
                                />
                            </div>
                        </Form>
                    </td>
                    <td align="right">
                        <Link to={"/institution/new"} className="link-brown">
                            Add Institution
                        </Link>
                    </td>
                </tr>
            </table>
			{error ? <header className="jumbotron"> <h3>{error}</h3>  </header> : null}
            {!error && institutions ? <>
            
                <h1>
                    Hello
                </h1>
            </>
            :<div> No record found. </div>   }

        </div>
    )
};

export default Institutions;
import React, { useState, useEffect , useRef} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import BookService from "../services/book.service";
import EventBus from "../common/EventBus";
import { makeStyles } from '@material-ui/core/styles';
import defaultProfile from "../images/profile.png";
import pdfIcon from "../images/pdf.jpg";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const currentUser = JSON.parse(localStorage.getItem('user'));
const Book = (props) => {
  const form = useRef();
  const checkBtn = useRef();
	
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [completeName, setCompleteName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState(""); 
  const [pic, setPic] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [payments, setPayments] = useState("");
  const [medication, setMedication] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const bookId = props.match.params.id;
  
 
   
  
   useEffect(() => {
    BookService.getBookById(bookId).then(
      (response) => {
		let p = response.data;
        setFirstName(p.firstName);
		setLastName(p.lastName);
		setAddress(p.address);
		setPhone(p.phone);
		setPhone2(p.phone2);
		setEmail(p.email);
		setDescription(p.description);
		setPic(p.pic);
		setMedicalHistory(p.medicalHistory);
		setMedication(p.medication);
		setCompleteName(p.completeName);
		setPayments(p.payments);
		
		
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
		 alert(_content);
         setMessage(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);
	
	function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
	
	const generatePDF = () =>{
		BookService.createPDF(bookId).then(
		  (response) => {
			const newWindow = window.open(BookService.loadPdfUrl(completeName), '_blank', 'noopener,noreferrer')
			if (newWindow) newWindow.opener = null
		  },
		  (error) => {
			const _content =
			  (error.response &&
				error.response.data &&
				error.response.data.message) ||
			  error.message ||
			  error.toString();
			 alert(_content);
			 setMessage(_content);

			if (error.response && error.response.status === 401) {
			  EventBus.dispatch("logout");
			}
		  }
		);
		
	}
  
  
  
   const deleteBook = async (event, id) => {
   
        if(window.confirm("Are you sure you want to delete this book?")){
            BookService.deleteBook(id).then(
			  (response) => {
				
					alert("Book deleted!");
                    window.location.href = window.location.protocol + "//"+ window.location.host + "/books";	
					
				
			  },
			  (error) => {
				const _content =
				  (error.response &&
					error.response.data &&
					error.response.data.message) ||
				  error.message ||
				  error.toString();

				setError(_content);

				if (error.response && error.response.status === 401) {
				  EventBus.dispatch("logout");
				  
				}
			  }
			);
        }
    }
	
 
  return (
    <div className="col-md-12" id="bookProfile">
		
		
		 <table className="styled-table" style={{width:"100%"}}>
			<thead>
			  <tr>
				<th style={{width:"25%"}}>Book Info</th> 
				<th colSpan={2}><div  style={{float:"right"}} ><a href="#"   className="text-light " onClick={(e) => generatePDF(e)}  >PDF</a> &nbsp;&nbsp;&nbsp;<a href={"/book/edit/" + bookId}  className="text-light ">Edit</a>&nbsp;&nbsp;&nbsp;<a href="#"  className="text-light" onClick={(e) => deleteBook(e, bookId)} >Delete</a></div></th>
			  </tr>
			</thead>
			<tbody>
				<tr className="white-background">
					<td valign="top">
						{pic && pic !="" ? (
							<div  className="Row">
								<span className="Filename">
									<img src={BookService.loadPic(pic)}  alt={firstName} className="profile_pic no-margin-top"  />
								</span>
							</div>
							):  <img src={defaultProfile}  alt={firstName} className="profile_pic no-margin-top"  /> }
									
								
							
					</td>
					<td valign="top">
						<table width="100%" >
						  <tbody>
							<tr className="white-background">
								<td>{firstName} {lastName}
									
								</td> 
								
							</tr>
							<tr className="white-background">
								<td>{phone} {phone2 ? " | "+ phone2 : ""}  {email ? " | "+ email : ""}</td> 
									
							</tr>
							<tr className="white-background">
									<td>  
										{address}
									</td>
							</tr>
						  </tbody>
					</table>
				  </td>
				  <td valign="top">
		  
				   <table className="styled-table" valign="top" style={{width:"100%", marginTop:"-2px"}}>
					<thead>
						<tr>
							<th style={{width:"50%"}}>Payments</th> 
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td colSpan={2} style={{width:"100%", whiteSpace: "pre-wrap"}} valign="top"><div style={{ height:"150px", overflow:"auto"}}>{payments}</div></td> 
							
						</tr>
						
					</tbody>
				  </table>
				</td>
				</tr>
				</tbody>
			</table>
			
		  
		   <table className="styled-table" style={{width:"100%"}}>
			<thead>
				<tr>
					<th style={{width:"50%"}}>Descritption</th> 
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td colSpan={2}>{description}</td>
				</tr>
				
				
			</tbody>
		  </table>
		   <table  style={{width:"100%" ,marginTop:"-30px"}} cellpadding="0" cellspacing="0">
			<tr>
				<td valign="top">
					   <table className="styled-table" style={{width:"100%"}}>
						<thead>
							<tr>
								<th style={{width:"50%"}}>Medical History</th> 
								<th></th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan={2} style={{width:"100%", whiteSpace: "pre-wrap"}} valign="top"><div style={{ height:"150px", overflow:"auto"}}>{medicalHistory}</div></td>
							</tr>
							
							
						</tbody>
					  </table>
				</td>
				<td>&nbsp;&nbsp;</td>
				<td valign="top">
		  
				   <table className="styled-table" style={{width:"100%"}}>
					<thead>
						<tr>
							<th style={{width:"50%"}} >Medication</th> 
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td colSpan={2} style={{width:"100%", whiteSpace: "pre-wrap"}} valign="top"><div style={{ height:"150px", overflow:"auto"}}>{medication}</div></td> 
							
						</tr>
						
					</tbody>
				  </table>
				</td>
			</tr>
		</table>
		   
		 
        
        
        
     
    </div>
  );
};

export default Book;

import styled from 'styled-components';
import FileInput from '../Components/FileInput';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {AddImage} from '../Redux/ImageSlice'
import { useNavigate } from 'react-router-dom';





function Upload(){
      
  const dispatch = useDispatch();
  const navigate = useNavigate();


    const[name,setName] = useState("")
   
    const[image,setImage] = useState(null)

    const {authorized} = useSelector((state)=>state.user)

    useEffect(() => {
      if (!authorized) {
        navigate("/Login", {
          state: { message: "Please sign in before upload your image!" }
        });
      }
    });
    
 

    const SubmitHandler = ()=>{
      console.log("Submitting...");
      if (!image) {
        alert("Please choose an image");
        return;
      }
      const formData = new FormData()

      formData.append("Name",name)
      formData.append("image",image)
    
      dispatch(AddImage(formData))
      navigate("/Profile")


    }

     

    return(
            <StyledWrapper style={{display:"flex",alignItems:"center",justifyContent:"center",alignItems:"center",padding:"2rem"}}>
              <form className="form" onSubmit={(e)=>{
                    e.preventDefault()
                    SubmitHandler()}} >
                <div className="title">Upload<br /><span>Publish your image now</span></div>
                <input className="input" name="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required/>
                
                <div  className="file-input-container" style={{width:"100%",padding:"1em"}}>
                <FileInput SetImage = {setImage} style={{width:"100%",}} />
                </div>
                <button className="button-confirm" type="submit">Upload</button>
              </form>
            </StyledWrapper>
        
          );
        }
    
        const StyledWrapper = styled.div`
          .form {
            --input-focus: #2d8cf0;
            --font-color: #323232;
            --font-color-sub: #666;
            --bg-color: beige;
            --main-color: black;
            padding: 20px;
            background: lightblue;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: 20px;
            border-radius: 5px;
            border: 2px solid var(--main-color);
            box-shadow: 4px 4px var(--main-color);
            margin-top:50px;
          }
        
          .title {
            color: var(--font-color);
            font-weight: 900;
            font-size: 20px;
            margin-bottom: 25px;
          }
        
          .title span {
            color: var(--font-color-sub);
            font-weight: 600;
            font-size: 17px;
          }
        
          .input {
            width: 250px;
            height: 40px;
            border-radius: 5px;
            border: 2px solid var(--main-color);
            background-color: var(--bg-color);
            box-shadow: 4px 4px var(--main-color);
            font-size: 15px;
            font-weight: 600;
            color: var(--font-color);
            padding: 5px 10px;
            outline: none;
          }
        
          .input::placeholder {
            color: var(--font-color-sub);
            opacity: 0.8;
          }
        
          .input:focus {
            border: 2px solid var(--input-focus);
          }
        
          .login-with {
            display: flex;
            gap: 20px;
          }
        
          .button-log {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 100%;
            border: 2px solid var(--main-color);
            background-color: var(--bg-color);
            box-shadow: 4px 4px var(--main-color);
            color: var(--font-color);
            font-size: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        
          .icon {
            width: 24px;
            height: 24px;
            fill: var(--main-color);
          }
        
          .button-log:active, .button-confirm:active {
            box-shadow: 0px 0px var(--main-color);
            transform: translate(3px, 3px);
          }
        
          .button-confirm {
            margin: 50px auto 0 auto;
            width: 120px;
            height: 40px;
            border-radius: 5px;
            border: 2px solid var(--main-color);
            background-color: var(--bg-color);
            box-shadow: 4px 4px var(--main-color);
            font-size: 17px;
            font-weight: 600;
            color: var(--font-color);
            cursor: pointer;
          }
              .custum-file-upload .icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        
          .custum-file-upload .icon svg {
            height: 80px;
            fill: black;
          }
        
          .custum-file-upload .text {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        
          .custum-file-upload .text span {
            font-weight: 400;
            color:black;
          }
        
          .custum-file-upload input {
            display: none;
          }`;




export default Upload
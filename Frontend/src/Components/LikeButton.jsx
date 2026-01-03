import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { LikeImage } from '../Redux/ImageSlice';
import { useNavigate } from 'react-router-dom';


const LikeButton = ({imageId,countLike,isLiked}) => {


  const dispath = useDispatch()

  const [isLike,setIsLike] = useState(isLiked)

   
  const [likes,SetLikes] = useState(countLike)

  const {authorized} = useSelector(state => state.user)

  const navigate = useNavigate();

  console.log("Count likes:"+likes)


  console.log("IS LIKED?" + isLike)

  const LikeHandler = async ()=>{
    console.log(authorized)
    if(!authorized){
      navigate("/Login")
    }
    else{
      const data = await dispath(LikeImage(imageId))
   
      const updatedLikes = data.payload; 
      console.log("updatedLikes", updatedLikes);
      SetLikes(updatedLikes)
      setIsLike(!isLike)
      
    }
    
  }
   
   
  return (
    <StyledWrapper>
      <div className="button-container">
        <input hidden id="checknumber" type="checkbox" onClick={LikeHandler} style={{display:"none"}} />
        <label htmlFor="checknumber" className="button">
          <div id="leftpart">
           <p>{likes}</p>
          </div>
          <div id="rightpart">
            <svg id="likeimg" strokeLinejoin="round" strokeLinecap="round" strokeWidth={3} stroke="#8e7cf3ff" fill="none" viewBox="0 0 24 24" height={24} width={24} xmlns="http://www.w3.org/2000/svg">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>

            <div id="fontlikebutton">{isLike?"Liked":"Like"}</div>
          </div>
        </label>
      </div>
    </StyledWrapper>



  



  );
}

const StyledWrapper = styled.div`
  .button-container {
    position: relative;
    display: inline-block;
    padding-left: 120px   
  }

  .button {
    cursor: pointer;
    width: 10em;
    height: 4em;
    display: flex;
    align-items: center;
    background-color: white;
    border: none;
    box-shadow: 0px 5px 0px rgba(45, 45, 45, 0.2);
    overflow: hidden;
    border-radius: 0.5em;
    transition: all 0.2s ease;
  }

  #fontlikebutton {
    font-family: "Trebuchet MS", sans-serif;
    font-weight: 600;
    font-size: 2em;
    color: #6366f1;
    margin-left: 0.2em;
  }

  .button:hover {
    background-color: #6366f1;
  }

  .button:hover svg {
    filter: brightness(0) invert(1);
    transform: scale(1.5) translateX(100%);

  }

  .button:hover #fontlikebutton {
    transform: translateX(200%);
  }

  .button:active {
    transform: scale(0.95) translateY(10%);
    box-shadow: 0px 2px 0px 0px rgb(0, 213, 255, 0.5);
  }

  .button:active svg {
    margin-bottom: 0.5em;
    transform: scale(1.5) translateX(85%) rotate(-30deg);
  }

  .button:active #fontlikebutton {
    transform: translateX(200%);

  }

  #likeimg {
    transition: all 0.2s ease;
    color: #6366f1;
  }

  #rightpart {
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #leftpart {
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    font-family: "Trebuchet MS", sans-serif;
    font-weight: 600;
    font-size: 2em;
    background-color: #6366f1;
    width: 38%;
    height: 100%;
    transition: all 0.2s ease;
  }

  .button:hover #leftpart {
    color: #6366f1;
    background: white;
  }

  #currentnumber {
    transform: translateY(50%);
    transition: all 0.2s ease;
  }

  #movenumber {
    transform: translateY(-200%);
    transition: all 0.2s ease;
  }

  #checknumber:checked ~ .button #currentnumber {
    transform: translateY(200%);
  }

  #checknumber:checked ~ .button #movenumber {
    transform: translateY(-50%);
  }`;

export default LikeButton

import { useEffect, useRef, useState } from "react"
import "../css/confirm.css"
import { useLocation, useNavigate } from "react-router-dom";




function Confirm(){
    
    

    const location = useLocation()

    const email  = location.state?.email;


    const[sendAgain,setAgain] = useState(false)

    const effectRan = useRef(false);

    const navigate = useNavigate();

    const input1 = useRef(null);
    const input2 = useRef(null);
    const input3 = useRef(null);
    const input4 = useRef(null);
    const input5 = useRef(null);
    const input6 = useRef(null);


   
    const [digit1,setDigit1] = useState("");
    const [digit2,setDigit2] = useState("");
    const [digit3,setDigit3] = useState("");
    const [digit4,setDigit4] = useState("");
    const [digit5,setDigit5] = useState("");
    const [digit6,setDigit6] = useState("");





    const  handleInput = (e,nextRef,prevRef)=>{
        
        if(e.target.value == ""){
            prevRef?.current?.focus()
            return;

        }
        

          
        nextRef.current.focus();
        

    }





       
    
    
    
    const sendMessage = async ()=>
    {
      
      
        const res = await fetch(import.meta.env.VITE_BASE_URL+"/User/SendConfirm",
            {
                 method:"POST",
                 headers:{
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(email)
            }
        )
            
     }
    

    const sendCode = async ()=>{


       const code = digit1 + digit2 + digit3 + digit4 + digit5 + digit6




          const res = await fetch(import.meta.env.VITE_BASE_URL+"/User/Confirm",
            {
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(code)
            }
        )

      
        if(res.ok)
        {
            navigate("/Login")
        }

       
    }

   

    useEffect(()=>{

    if (effectRan.current) return; 
    effectRan.current = true;
        
     sendMessage() 


    },[sendAgain])


    return(
      
        <div className="container" >

            <img src="https://cdn-icons-png.flaticon.com/512/3178/3178158.png" style={{width:"200px", height:"200px",paddingTop:"2em"}} alt="head-email"/>
            <h1 style={{textAlign:"center"}}>Email confirm</h1>

            <h3 style={{textAlign:"center"}}>We’ve sent you a confirmation email. <strong>{email != null?email:""}</strong>
           Please check your inbox (and spam/junk folder just in case) and click the link inside to verify your email address.</h3>
        
        <p>If you don’t see the email within a few minutes, try resending the confirmation or double-check that you entered the correct address.</p>

        
      <div className="six-digit-input">
      <input type="text" ref={input1} inputMode="numeric" value={digit1} onChange={(e)=>{setDigit1(e.target.value)}} onInput={(e)=>{handleInput(e,input2)}} maxLength="1" pattern="\d" /> 
      <input type="text" ref={input2} inputMode="numeric" value={digit2} onChange={(e)=>{setDigit2(e.target.value)}} onInput={(e)=>{handleInput(e,input3,input1)}} maxLength="1" pattern="\d"/>
      <input type="text" ref={input3}  inputMode="numeric"value={digit3} onChange={(e)=>{setDigit3(e.target.value)}} onInput={(e)=>{handleInput(e,input4,input2)}} maxLength="1" pattern="\d" />
      <input type="text" ref={input4}  inputMode="numeric"value={digit4} onChange={(e)=>{setDigit4(e.target.value)}} onInput={(e)=>{handleInput(e,input5,input3)}} maxLength="1" pattern="\d" />
      <input type="text" ref={input5}  inputMode="numeric"value={digit5} onChange={(e)=>{setDigit5(e.target.value)}} onInput={(e)=>{handleInput(e,input6,input4)}}maxLength="1" pattern="\d" />
      <input type="text" ref={input6}  inputMode="numeric"value={digit6} onChange={(e)=>{setDigit6(e.target.value)}} onInput={(e)=>{handleInput(e,input6,input5)}} maxLength="1" pattern="\d" />

  
    </div>
    <button className="btn btn warning" style={{marginTop:"50px"}} onClick={sendCode}>Send</button>

     


    </div>

    








    )








}
export default Confirm
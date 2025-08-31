// SignupForm.jsx
import React, { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css"
import { Navigate } from "react-router-dom";
import { set } from "mongoose";
export default function SignupForm() {
    const [form, setForm] = useState({
        name: "",
        dob: "",
        email: "",
        otp:""
       

    });
    const navi=useNavigate()

      const [message, setMessage] = useState("");
      


    const [hideOtp, setHideOtp] = useState(true);

    interface SignupFormState {
        name: string;
        dob: string;
        email: string;
    }

    interface SignupFormEvent extends React.ChangeEvent<HTMLInputElement> {}

    const handleChange = (e: SignupFormEvent) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(form.name=="" || form.dob=="" || form.email=="" ){
            alert("please fill all the fields")
            return;
        }
        

        const response=await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
        const data = await response.json();
        if(response.ok){
            console.log(data.token);
            alert("signup successful")
            localStorage.setItem("token", data.token);
            
            setTimeout(() => {
                navi("/welcome")
            }, 2000);
        }
        else{
            // setMessage(data.message);
            alert("signup failed")
        }
        
        
        
    };

    const sendotp=async()=>{
        const {email}=form

        if(form.name=="" || form.dob=="" || form.email=="" ){
            alert("please fill all the fields")
            return;
        }
        setHideOtp(false)
        const response=await fetch("http://localhost:5000/send-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email})
        })  
        const data=await response.json();
        console.log(data);
        if(data.success){
            alert("otp sent to your email")
            
            
        }
        else{
            alert("User Email already exists")
            setMessage(data.message);
            setTimeout(() => {
                window.location.reload()
                
            }, 3000);
        }
    }

    return (

        <div >
            <div className="container">
                <h2>Sign up</h2>
                <p>Sign up to enjoy the feature of HD</p>
            </div>
            <div className="auto_layout2">
                <form className="auto_layout1" onSubmit={handleSubmit} >
                    <div style={{ position: "relative" }}>
                        <label className={`label ${form.name ? "active" : ""}`}>Your Name</label>
                        <div className="input-box">
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Jonas Khanwald"
                                className="input-text"
                            />
                        </div>
                    </div>

                   
                    <div style={{ position: "relative" }}>
                        <label className={`label ${form.dob ? "active" : ""}`}>Date of Birth</label>
                        <div className="input-box">
                            <input
                                type="date"
                                name="dob"
                                value={form.dob}
                                onChange={handleChange}
                                className="input-text"
                            />
                        </div>
                    </div>

                  
                    <div style={{ position: "relative" }}>
                        <label className={`label ${form.email ? "active" : ""}`}>Email</label>
                        <div className="input-box active">
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="jonas_kahnwald@gmail.com"
                                className="input-text"
                            />
                        </div>
                    </div>

                    

                    {
                        !hideOtp ? (
                            <>
                            <div className="hide" style={{ position: "relative" }}>
                        <label className={`label ${form.email ? "active" : ""}`}>Enter OTP</label>
                        <div className="input-box active">
                            <input
                                type="otp"
                                name="otp"
                                value={form.otp}
                                onChange={handleChange}
                                placeholder="OTP"
                                className="input-text"
                            />
                        </div>
                    </div>
                            
                    <button className="button" type="submit">Signup</button>

                            </>
                        ) : (
                            <button style={{display:!hideOtp?"none":"block"}} onClick={sendotp}  className="button">
                                Get OTP
                            </button>
                        )
                    }
                    {/* {message && <p style={{ color: message.includes("exists") ? "red" : "green" }}>{message}</p>} */}
                    

                    

                    <p className="footer-text">Already have an account?<Link to="/login"> Sign in</Link></p>

                    
 
                
                </form>
                
                    
            </div>
        </div>
    );
}

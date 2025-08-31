// SignupForm.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css"
import { set } from "mongoose";
export default function Login() {
    const [form, setForm] = useState({
        
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

        if( form.otp=="" || form.email=="" ){
            alert("please fill all the fields")
            return;
        }
        

        const response=await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })  
        const data = await response.json();
        setMessage(data.message);
        console.log(data);
        console.log(data.token);

        
        if(data.user){
            alert("login successful")
                   localStorage.setItem("token", data.token);

            setTimeout(() => {
                navi("/welcome")
            }, 2000);
            
        }
        else{
            alert("login failed")
            setMessage(data.message);
            setTimeout(() => {
                window.location.reload()
                
            }, 3000);
        }
         
        
        
        
    };

    

    return (
        <div>
             <div className="container">
                <h2>Sign in</h2>
                <p>Please login to continue to your account</p>
            </div>

            <div className="auto_layout2">
                <form className="auto_layout1" onSubmit={handleSubmit} >
                   


                  
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

                        <div><input required type="checkbox" name="check" id="check" />Keep me logged in</div>
                    
                            
                    <button className="button" type="submit">Signin</button>
                    {message && <p style={{ color: "red" }}>{message}</p>}

                    <p className="footer-text">Already have an account?<Link to="/"> Sign up</Link></p>
                </form>
                
                    
            </div>
        </div>
    );
}

"use client";
import { signIn } from "next-auth/react";
import React, { useRef } from "react";
import 'bootstrap/dist/css/bootstrap.css'

const LoginPage = () => {
    const userName = useRef("");
    const pass = useRef("");

    const onSubmit = async () => {
        const result = await signIn("credentials", {
            username: userName.current,
            password: pass.current,
            redirect: true,
            callbackUrl: "/",
        });
    };
    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <div className=" py-4 shadow bg-white rounded-md d-flex flex-column">
                <input className="m-2" placeholder="Enter Your Email or Phone Number" onChange={(e) => (userName.current = e.target.value)} />
                <input className="m-2" placeholder="Enter Password" type={"password"} onChange={(e) => (pass.current = e.target.value)}
                />
                <button className='m-2 btn btn-secondary' onClick={onSubmit}>Login</button>
            </div>
        </div>
    );
};

export default LoginPage;
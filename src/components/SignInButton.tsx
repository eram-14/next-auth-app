"use client"
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

const SignInButton = () => {
    const { data: session } = useSession()
    
    if (session && session.user) {
        return (
            <div className='d-flex align-items-center'>
                <p className='px-3'>{session.user.name}</p>
                <button className='btn btn-dark' onClick={() => signOut()}>Sign Out</button>
            </div>
        )
    }
    else return <button className='btn btn-primary'  onClick={() => signIn()}>Sign In</button>

}

export default SignInButton

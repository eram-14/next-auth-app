import { cookies } from 'next/headers';
import { createHmac } from "crypto"
const smsKey = process.env.SMS_SECRET_KEY as string;
const jwt = require('jsonwebtoken');
import { NextRequest, NextResponse } from 'next/server'


const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

interface RequestBody {
    email_phone: string;
    hash: string;
    otp: number;
}
let refreshTokens = [];

export async function POST(request: NextRequest) {
    const body: RequestBody = await request.json();
    const email_phone = body.email_phone;
    const hash = body.hash;
    const otp = body.otp;
    let [hashValue, expires] = hash.split('.');
    let now = Date.now();
    if (now > parseInt(expires)) {
        return new Response(JSON.stringify({ msg: 'Timeout. Please try again' }), { status: 504 });
    }
    let data = `${email_phone}.${otp}.${expires}`;
    let newCalculatedHash = createHmac('sha256', smsKey).update(data).digest('hex');

    if (newCalculatedHash === hashValue) {
        console.log('user confirmed');
        const accessToken = jwt.sign({ data: email_phone }, JWT_AUTH_TOKEN, { expiresIn: '30s' });
        const refreshToken = jwt.sign({ data: email_phone }, JWT_REFRESH_TOKEN, { expiresIn: '1y' });
        // const response = NextResponse.next()
        refreshTokens.push(refreshToken);
        const response = NextResponse.json(
            { msg: 'Device verified' },
            { status: 200 }
        )
        response.cookies.set({
            name: 'accessToken',
            value: accessToken,
            httpOnly: true,
            sameSite: 'strict',
            expires: new Date(new Date().getTime() + 30 * 1000),
        },
        )
        response.cookies.set({
            name: 'refreshToken',
            value: refreshToken,
            expires: new Date(new Date().getTime() + 31557600000),
            sameSite: 'strict',
            httpOnly: true
        },
        )
        response.cookies.set({
            name: 'authSession',
            value: 'true',
            expires: new Date(new Date().getTime() + 30 * 1000),
            sameSite: 'strict'
        },
        )
        response.cookies.set({
            name: 'refreshTokenID',
            value: 'true',
            expires: new Date(new Date().getTime() + 31557600000),
            sameSite: 'strict'
        },
        )
        return response
        // return new Response(JSON.stringify({ msg: 'Device verified' }), { status: 200 });

    } else {
        console.log('not authenticated');
        return new Response(JSON.stringify({ verification: false, msg: 'Incorrect OTP' }), { status: 400 },);
    }
}

import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
    name: string;
    email_phone: string;
    password: string | null;
    provider: string;
}
var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
var validPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/gm

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    if (validRegex.test(body.email_phone) && body.provider === undefined) {
        body.provider = 'Email'
    } else if (validPhoneRegex.test(body.email_phone)) {
        body.provider = 'Phone'
    }
    var raw = JSON.stringify({
        "email_phone": "eram@iwebcode.dev"
    });

    await fetch("http://localhost:3000/api/sendOtp", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: raw,
        redirect: 'follow'
    })
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    const encryptedPassword = body.password !== null ? await bcrypt.hash(body.password, 10) : null
    // const user = await prisma.users.create({
    //     data: {
    //         name: body.name,
    //         email_phone: body.email_phone,
    //         password: encryptedPassword as str77777777777777777ing,
    //         provider: body.provider
    //     },
    // });

    // const { password, ...result } = user;
    // return new Response(JSON.stringify(result), { status: 200 });
    // return new Response(JSON.stringify("Incorrect Email or Phone Number"), { status: 401 });
}

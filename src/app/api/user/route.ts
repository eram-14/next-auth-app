import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
    name: string;
    email_phone: string;
    password: string|null;
    provider: string;
}
var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
var validPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/gm

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    if (validRegex.test(body.email_phone)  && body.provider===undefined) {
        body.provider = 'Email'
    } else if (validPhoneRegex.test(body.email_phone)) {
        body.provider = 'Phone'
    }
    
    const encryptedPassword = body.password !== null ?  await bcrypt.hash(body.password,10):null
    const user = await prisma.users.create({
        data: {
            name: body.name,
            email_phone: body.email_phone,
            password: encryptedPassword,
            provider: body.provider
        },
    });

    const { password, ...result } = user;
    return new Response(JSON.stringify(result), { status: 200 });
    // return new Response(JSON.stringify("Incorrect Email or Phone Number"), { status: 401 });
}

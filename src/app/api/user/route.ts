import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";

interface RequestBody {
    name: string;
    email: string;
    password: string;
    provider: string;
}
var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
var validPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/gm

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    if (validRegex.test(body.email)) {
        body.provider = 'Email'
    } else if (validPhoneRegex.test(body.email)) {
        body.provider = 'Phone'
    }

    if (body.provider) {
        const user = await prisma.users.create({
            data: {
                name: body.name,
                email: body.email,
                password: await bcrypt.hash(body.password, 10),
                provider: body.provider
            },
        });

        const { password, ...result } = user;
        return new Response(JSON.stringify(result), { status: 200 });
    }
    else {
        return new Response(JSON.stringify("Incorrect Email or Phone Number"), { status: 401 });
    }



}

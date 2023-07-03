import { createHmac } from "crypto" 
const smsKey = process.env.SMS_SECRET_KEY as string;

interface RequestBody {
    name: string;
    email_phone: string;
    password: string|null;
    provider: string;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    const email_phone = body.email_phone;
    console.log('hola',email_phone);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const ttl = 2 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${email_phone}.${otp}.${expires}`;
    const hash = createHmac('sha256', smsKey).update(data).digest('hex');
    const fullHash = `${hash}.${expires}`;

    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("api-key", "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");
    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify({
        "sender": {
            "name": "Eram",
            "email": "no-reply@health-destination.com"
        },
        "to": [
            {
                "email": `${body.email_phone}`,
                "name": `${body.name}`
            }
        ],
        "htmlContent": `<!DOCTYPE html> <html> <body> <h1>Hello ${body.name}</h1><p>Your One Time Login Password For Health Destination is ${otp}</p></body> </html>`,
        "subject": "Health Destination sent you an OTP"
    });

    console.log('data',raw);
    // fetch("https://api.brevo.com/v3/smtp/email", {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: 'follow'
    // })
    //     .then(response => response.text())
    //     .then(result => {
    //         console.log(result)
    //         return new Response(JSON.stringify(result), { status: 200 });
    //     })
    //     .catch(error => console.log('error', error));

    // client.messages
    //     .create({
    //         body: `Your One Time Login Password For CFM is ${otp}`,
    //         from: twilioNum,
    //         to: phone
    //     })
    //     .then((messages) => console.log(messages))
    //     .catch((err) => console.error(err));

    // res.status(200).send({ phone, hash: fullHash, otp });  // this bypass otp via api only for development instead hitting twilio api all the time
    return new Response(JSON.stringify({ email_phone, hash: fullHash ,otp}), { status: 200 });        
}


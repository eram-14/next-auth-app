import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const allUsers = await prisma.users.findMany({
        select: {
          email_phone: true,
        },
      })
    return new Response(JSON.stringify(allUsers), { status: 200 });
}

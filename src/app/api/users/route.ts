import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const createResponse = (data: any, status: number) => new NextResponse(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
});

const handleErrors = (err: any) => {
    console.error(err);
    return createResponse({ error: 'An error occurred while processing your request.' }, 500);
}

export const GET = async (req: NextRequest) => {
    try {
        const users = await db.user.findMany();
        return createResponse(users, 200);
    } catch (err) {
        return handleErrors(err);
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const { username, password } = await req.json();
        if (!password) return createResponse({ error: 'Password is required.' }, 400);

        let user = await db.user.findUnique({ where: { username } });
        if (!user) {
            user = await db.user.create({ data: { username, password } });
            return createResponse(user, 201);
        }

        return user.password === password ? createResponse(user, 200) : createResponse({ error: 'Invalid password.' }, 400);
    } catch (err) {
        return handleErrors(err);
    }
}
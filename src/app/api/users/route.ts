import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const createResponse = (data: any, status: number) => {
    return new NextResponse(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!password) {
            return createResponse({ error: 'Password is required.' }, 400);
        }

        let user = await db.user.findUnique({
            where: {
                username: username,
            },
        });

        if (!user) {
            user = await db.user.create({
                data: {
                    username: username,
                    password: password, // add password to user data
                },
            });
            return createResponse(user, 201);
        }

        else if (user.password === password) {
            return createResponse(user, 200);
        }

        else {
            return createResponse({ error: 'Invalid password.' }, 400);
        }

    } catch (err) {
        console.error(err);
        return createResponse({ error: 'An error occurred while processing your request.' }, 500);
    }
}

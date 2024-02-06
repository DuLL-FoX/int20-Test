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
        const { username } = await req.json();

        let user = await db.user.findUnique({
            where: {
                username: username,
            },
        });

        if (!user) {
            user = await db.user.create({
                data: {
                    username: username,
                },
            });
            return createResponse(user, 201);
        }

        return createResponse(user, 200);
    } catch (err) {
        console.error(err);
        return createResponse({ error: 'An error occurred while processing your request.' }, 500);
    }
}

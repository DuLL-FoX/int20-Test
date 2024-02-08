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



// import { hash } from "bcrypt";
// import { z } from 'zod';

// const userSchema = z.object({
//   email: z.string().min(1,'Email is required').email('Invalid email'),
//   username: z.string().min(1,'Email is required').max(30),
//   password: z.string().min(1,'Password is required').min(8),
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, username, password } = userSchema.parse(body);

//     const userExistsByEmail = await db.user.findUnique({
//       where: {
//         email: email,
//       },
//     });
//     if (userExistsByEmail) {
//       return NextResponse.json(
//         { user: null, massage: "Email already exists" },
//         { status: 409 }
//       );
//     }

//     const userExistsByUserName = await db.user.findUnique({
//       where: {
//         username: username,
//       },
//     });
//     if (userExistsByUserName) {
//       return NextResponse.json(
//         { user: null, massage: "User already exists" },
//         { status: 409 }
//       );
//     }

//     const hashedPassword = await hash(password, 10);

//     const newUser = await db.user.create({
//       data: {
//         email,
//         username,
//         password: hashedPassword,
//       },
//     });
//     const {password: newUserPassword, ...rest} = newUser

//     return NextResponse.json({
//       user: rest,
//       massage: "User created successfully",
//     },{status: 201});
//   } catch (error) {
//     return NextResponse.json(
//       { user: null, massage: error },
//       { status: 500 }
//     );
//   }
// }


// export function GET() {
//   return NextResponse.json({"data": "data"});
// }
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {getHasher} from 'cryptocipher';

const userSchema = z.object({
  username: z.string().min(1, "Username is required").max(30),
  password: z.string().min(1, "Password is required"),
});

async function hashPassword(password : string) {
  const hasher = getHasher('sha256');
  const hashed = await hasher.digest({
    content: password,
    digest: 'hex'
  });
  return hashed.content;
}

function createResponse(body: any, status: number) {
  return NextResponse.json(body, { status });
}

function handleErrors(err: any) {
  return NextResponse.json({ error: err.message }, { status: 500 });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const username = url.searchParams.get("username");
    let user;
    let message: string;

    if (id) {
      user = await db.user.findUnique({
        where: { id: Number(id) },
        select: { password: false },
      });
      message = user ? "User found by ID" : "User not found by ID";
    } else if (username) {
      user = await db.user.findUnique({
        where: { username,  },
        select: { password: false, id:true, username: true}
      });
      message = user ? "User found" : "User not found";
    } else {
      user = await db.user.findMany({
        select: { password: false, id:true, username: true},
      });
      message = "All users";
    }

    return createResponse({ user, message }, user ? 200 : 404);
  } catch (err) {
    return handleErrors(err);
  }
}

export async function POST(req : NextRequest) {
  try {
    const { username, password } = userSchema.parse(await req.json());
    const existingUser = await db.user.findUnique({ where: { username } });
    const hashedPassword = await hashPassword(password);

    if (existingUser) {
      // Only for updating the old users password to hashed
      if (password === existingUser.password) {
        const updatedUser = await db.user.update({
          where: { username },
          data: { password: hashedPassword },
        });
        const { password, ...userWithoutPassword } = updatedUser;
        return createResponse({ user: userWithoutPassword, message: "User password hashed" }, 200);
      }

      if (existingUser.password === hashedPassword) {
        const { password, ...userWithoutPassword } = existingUser;
        return createResponse({ user: userWithoutPassword, message: "User login successfully" }, 200);
      }
      return createResponse({ user: null, message: "User password is incorrect" }, 401);
    }

    const newUser = await db.user.create({
      data: { username, password: hashedPassword },
    });

    const { password : newPassword, ...newUserWithoutPassword } = newUser;

    return createResponse({ user: newUserWithoutPassword, message: "User created and login successfully" }, 201);
  } catch (err) {
    return handleErrors(err);
  }
}

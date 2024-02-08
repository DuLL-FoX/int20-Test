"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().min(1,'Email is required').email('Invalid email'),
  username: z.string().min(1,'Email is required').max(30),
  password: z.string().min(1,'Password is required').min(8),
});

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const storedUsers = Cookies.get("users");
    const storedSelectedUser = Cookies.get("selectedUser");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    if (storedSelectedUser) {
      setSelectedUser(storedSelectedUser);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const newUser = await response.json();
      console.log(newUser);

      const updatedUsers = [...users, newUser.username];
      setUsers(updatedUsers);
      Cookies.set("users", JSON.stringify(updatedUsers), { expires: 7 });
    } else {
      const error = await response.json();
      console.error(error);
    }
    router.back();
  };

  const handleSelectUser = (username: string) => {
    setSelectedUser(username);
    Cookies.set("selectedUser", username, { expires: 7 });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Увійти</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-fit">
        <DialogHeader>
          <DialogTitle>Попередні входи</DialogTitle>
          <DialogDescription>
            {users.length > 0 && (
              <ul className="flex text-muted-foreground space-x-2">
                {users.map((user, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectUser(user)}
                    style={{ cursor: "pointer" }}
                    className="border bg-background hover:bg-indigo-50 hover:text-indigo-700 rounded-md p-1"
                  >
                    {user}
                  </li>
                ))}
              </ul>
            )}
            {selectedUser && (
              <p className="text-muted-foreground">
                Вибраний користувач: {selectedUser}
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="flex items-center w-full">
            <Label htmlFor="username" className="w-full">
              Введіть нік
            </Label>
            <Input
              type="text"
              id="username"
              name="username"
              required
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              defaultValue={`${selectedUser}`}
            />
          </div>
          <div className="flex items-center w-full">
            <Label htmlFor="password" className="w-full">
              Введіть пароль
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline" className="w-full">
            Увійти чи створити користувача
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginForm;

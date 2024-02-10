"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedUsers = Cookies.get("users");
    const storedSelectedUser = Cookies.get("selectedUser");
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedSelectedUser) setSelectedUser(storedSelectedUser);
  }, [selectedUser]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(await response.json());
      return;
    }

    const { user } = await response.json();
    console.log(user);

    if (!users.includes(user.username)) {
      const updatedUsers = [...users, user.username];
      setUsers(updatedUsers);
      Cookies.set("users", JSON.stringify(updatedUsers), { expires: 7 });
    }

    setSelectedUser(user.username);
    Cookies.set("selectedUser", user.username, { expires: 7 });
  }

  async function handleSelectUser(username: string) {
    setSelectedUser(username);
    setUsername(username);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Увійти</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-fit">
        <DialogHeader>
          <DialogTitle>Попередні входи</DialogTitle>

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
              value={username}
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
          <DialogClose>
            <Button type="submit" variant="outline" className="w-full">
              Увійти чи створити користувача
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}

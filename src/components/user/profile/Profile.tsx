"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UpdateProfile } from "./UpdateProfile";
import { useForm } from "react-hook-form";
import {
  updateProfileValues,
  updateProfileSchema,
} from "@/lib/User/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { PopoverClose } from "@radix-ui/react-popover";

type UserProfileProps = {
  children: React.ReactNode;
  user: string;
};

export default function UserProfile({ children }: UserProfileProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedSelectedUser = Cookies.get("selectedUser");
    if (storedSelectedUser) setSelectedUser(storedSelectedUser);
    
  }, [selectedUser]);

  const form = useForm<updateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
  });

  const onSubmit = async (values: updateProfileValues) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (typeof value === "string") {
          formData.append(key, value);
        }
      }
    });

    try {
      await UpdateProfile(formData, selectedUser as string);
      setSelectedUser(form.getValues().username as string);
      Cookies.set("selectedUser", form.getValues().username as string, {
        expires: 7,
      });
    } catch (error) {
      alert(error);
    }
  };

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="cursor-pointer">
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Form {...form}>
          <form
            className="space-y-4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новий нік</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      placeholder="Ваш новий нік"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новий пароль</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      placeholder="Ваш новий пароль"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PopoverClose>
              <LoadingButton type="submit" loading={isSubmitting}>
                Підтвердити
              </LoadingButton>
            </PopoverClose>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

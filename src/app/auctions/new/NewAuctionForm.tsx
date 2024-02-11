"use client";
import H1 from "@/components/ui/h1";
import { useForm } from "react-hook-form";
import {
  createAuctionValues,
  createAuctionSchema,
} from "@/lib/Auction/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/RichTextEditor";
import { draftToMarkdown } from "markdown-draft-js";
import LoadingButton from "@/components/LoadingButton";
import { CreateAuctionPosting } from "@/app/api/auction/new/CreateAuction";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function NewAuctionForm() {
  const form = useForm<createAuctionValues>({
    resolver: zodResolver(createAuctionSchema),
  });

  const [username, setUsername] = useState("");

  useEffect(() => {
    const username = Cookies.get("selectedUser");
    setUsername(username as string);
  }, []);


  const onSubmit = async (values: createAuctionValues) => {
    console.log(form.formState.errors);
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (typeof value === "string") {
          formData.append(key, value);
        } else if (value instanceof File) {
          formData.append(key, value, value.name);
        } else if (value instanceof Date) {
          formData.append(key, value.toDateString());
        }
      }
    });

    try {
      await CreateAuctionPosting(formData);
    } catch (error) {
      alert(error);
    }
  };

  const {
    handleSubmit,
    control,
    setFocus,
    formState: { isSubmitting },
  } = form;

  return (
    <main className="max-w-3xl m-auto my-10 space-y-10">
      <div className="space-y-5 text-center">
        <H1>Створення нового аукціону</H1>
        <p className="text-muted-foreground">текст</p>
      </div>
      <div className="space-y-6 border rounded-lg p-4">
        <div>
          <h2 className="font-semibold">Деталі аукціону</h2>
          <p className="text-muted-foreground">Надайте опис та деталі</p>
        </div>
        <Form {...form}>
          <form
            className="space-y-4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва аукціону</FormLabel>
                  <FormControl>
                    <Input placeholder="Будь-яка ваша назва" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="auctionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Дата проведення аукціону</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "P", { locale: uk })
                            ) : (
                              <span>Виберіть дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="auctionLotLogo"
              render={({ field: { value, ...fieldValues } }) => (
                <FormItem>
                  <FormLabel>Логотип аукціону</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldValues}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        fieldValues.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер телефону для подальшого контакту</FormLabel>
                  <FormControl>
                    <Input
                      id="contactPhone"
                      placeholder="Номер телефону"
                      type=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="briefDescription"
              render={({ field }) => (
                <FormItem>
                  <Label onClick={() => setFocus("briefDescription")}>
                    Опис
                  </Label>
                  <FormControl>
                    <RichTextEditor
                      onChange={(draft) =>
                        field.onChange(draftToMarkdown(draft))
                      }
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={isSubmitting}>
              Підтвердити
            </LoadingButton>
          </form>
        </Form>
      </div>
    </main>
  );
}

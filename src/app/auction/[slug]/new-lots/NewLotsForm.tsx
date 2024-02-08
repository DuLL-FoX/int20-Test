"use client";
import H1 from "@/components/ui/h1";
import { useForm } from "react-hook-form";
import { createLotValues, createLotSchema } from "@/lib/Lots/validation";
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
import LoadingButton from "@/components/LoadingButton";
import { createLotPosting } from "@/app/api/lots/new/route";

export default function NewJobForm() {
  const form = useForm<createLotValues>({
    resolver: zodResolver(createLotSchema),
  });

  const onSubmit = async (values: createLotValues) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (typeof value === "string") {
          formData.append(key, value);
        } else if (value instanceof File) {
          formData.append(key, value, value.name);
        }
      }
    });

    try {
      await createLotPosting(formData);
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
    <main className="max-w-3xl m-auto my-10 space-y-10">
      <div className="space-y-5 text-center">
        <H1>Додавання лотів до аукціону</H1>
        <p className="text-muted-foreground">текст</p>
      </div>
      <div className="space-y-6 border rounded-lg p-4">
        <div>
          <h2 className="font-semibold">Деталі лоту</h2>
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
              name="naming"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва лоту</FormLabel>
                  <FormControl>
                    <Input placeholder="Будь-яка ваша назва" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="objectClassifier"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Класифікація об'єкта</FormLabel>
                  <FormControl>
                    <Input placeholder="Будь-яка ваша назва" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lotLogo"
              render={({ field: { value, ...fieldValues } }) => (
                <FormItem>
                  <FormLabel>Фото лоту</FormLabel>
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
              name="startPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Стартова ціна</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введіть стартову ціну"
                      type="number"
                      {...field}
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

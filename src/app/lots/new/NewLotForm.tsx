"use client";

import H1 from "@/components/ui/h1";
import {useForm} from "react-hook-form";
import {createLotSchema, createLotValues} from "@/lib/Lots/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {createLotPosting} from "@/app/api/lots/new/route";
import LoadingButton from "@/components/LoadingButton";

export default function NewLotForm() {
    const form = useForm<createLotValues>({
        resolver: zodResolver(createLotSchema),
    });

    const onSubmit = async (values: createLotValues) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== undefined) { // Check for null or undefined explicitly
                if (typeof value === "string" || value instanceof Blob) {
                    formData.append(key, value);
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
        formState: {isSubmitting},
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
            </div>
            <Form {...form}>
                <form
                    className="space-y-4"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <FormField
                        control={control}
                        name="objectClassifier"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Назва лоту</FormLabel>
                                <FormControl>
                                    <Input placeholder="Будь-яка ваша назва" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="startPrice"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Стартова ціна</FormLabel>
                                <FormControl>
                                    <Input placeholder="Стартова ціна" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="lotLogo"
                        render={({ field: { value, ...fieldValues } }) => (
                            <FormItem>
                                <FormLabel>Логотип лоту</FormLabel>
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
                    <LoadingButton type="submit" loading={isSubmitting}>
                        Підтвердити
                    </LoadingButton>
                </form>
            </Form>
        </main>
    );

}

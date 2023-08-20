'use client';
import React, {FC} from 'react';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UpdateLanguageSchema} from "@/lib/validation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/ui/form";
import {Button} from "@/ui/button";
import z from "zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/ui/select";
import {languages} from "@/lib/constants";
import {trpc} from "@/lib/trpc";
import {useToast} from "@/ui/use-toast";

type FormData = z.infer<typeof UpdateLanguageSchema>
const LanguageForm: FC<{
    defaultValues: FormData
}> = props => {

    const {toast} = useToast();

    const form = useForm<FormData>({
        resolver: zodResolver(UpdateLanguageSchema),
        defaultValues: props.defaultValues,
    });

    const updateMutation = trpc.account.updateLanguage.useMutation({
        onSuccess: () => {
            toast({
                title: '更新语言成功',
                description: `默认语言已改为${form.getValues('language')}`,
            });
        }
    });

    const onSubmit = (formData: FormData) => {
        updateMutation.mutate(formData);
    }
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="language"
                render={({field}) => {
                    return <FormItem>
                        <FormLabel>默认语言</FormLabel>
                        <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="请选择语言"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map(language => {
                                        return <SelectItem value={language.value}
                                                           key={language.value}>{language.label}</SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                }}
            />
            <Button type="submit" loading={updateMutation.isLoading}>更新</Button>
        </form>
    </Form>
};


export default LanguageForm;
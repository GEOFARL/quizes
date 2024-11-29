"use client";
import { RegisterPayload } from "@/types/auth/payload";
import { Dictionary } from "@/types/dictionary";
import { registerSchema } from "@/validations/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PasswordInput from "../common/PasswordInput";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type Props = {
  onSubmit: (payload: RegisterPayload) => void;
  translation: Dictionary;
};

const RegisterForm: React.FC<Props> = ({ onSubmit, translation }) => {
  const form = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <FormField
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {translation?.auth.register.form.fullName}
                </FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translation?.auth.register.form.email}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {translation?.auth.register.form.password}
                </FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          {translation?.auth.register.form.button}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;

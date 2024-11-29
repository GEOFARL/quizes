"use client";
import { LoginPayload } from "@/types/auth/payload";
import { loginSchema } from "@/validations/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import PasswordInput from "../common/PasswordInput";
import { Dictionary } from "@/types/dictionary";

type Props = {
  onSubmit: (payload: LoginPayload) => void;
  translation: Dictionary;
};

const LoginForm: React.FC<Props> = ({ onSubmit, translation }) => {
  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translation?.auth.login.form.email}</FormLabel>
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
                <FormLabel>{translation?.auth.login.form.password}</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          {translation?.auth.login.form.button}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;

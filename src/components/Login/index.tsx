"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginFormValues } from "@/models/schemas/auth";
import { login as userLogin } from "@/utils/api/auth";

//TODO - Add Zod validation, add react-hook-form client validation

export const LoginComponent: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      await userLogin(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Wrong email or password.";
      setError("root", { message });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-3 px-4 py-8 border rounded-lg border-border'
    >
      <div className='flex flex-col gap-1'>
        <label htmlFor='email' className='sr-only'>
          Email
        </label>
        <Input
          id='email'
          type='email'
          placeholder='Email'
          variant={errors.email ? "error" : "default"}
          {...register("email")}
        />
        <p className='error-text'>
          {errors.email && (
            <span className='field-error'>{errors.email.message}</span>
          )}
        </p>
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor='password' className='sr-only'>
          Password
        </label>
        <Input
          id='password'
          type='password'
          placeholder='Password'
          variant={errors.password ? "error" : "default"}
          {...register("password")}
        />
        <p className='error-text'>
          {errors.password && (
            <span className='field-error'>{errors.password.message}</span>
          )}
        </p>
      </div>

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

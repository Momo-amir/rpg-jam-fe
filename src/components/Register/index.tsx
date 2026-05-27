"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterFormValues, registerSchema } from "../../models/schemas/auth";
import { register as registerUser } from "@/utils/api/auth";

export const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  async function onSubmit(data: RegisterFormValues) {
    try {
      await registerUser(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      setError("root", { message });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-3 px-4 py-8 border rounded-lg border-border'
    >
      <div className='flex flex-col gap-1'>
        <label htmlFor='username' className='sr-only'>
          Username
        </label>
        <Input
          id='username'
          type='text'
          placeholder='Username'
          variant={errors.username ? "error" : "default"}
          {...register("username")}
        />
        <p className='error-text'>
          {errors.username && (
            <span className='field-error'>{errors.username.message}</span>
          )}
        </p>
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor='email' className='sr-only'>
          Email
        </label>
        <Input
          id='email'
          type='email'
          placeholder='Email address'
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

      <div className='flex flex-col gap-1'>
        <label htmlFor='confirmPassword' className='sr-only'>
          Confirm password
        </label>
        <Input
          id='confirmPassword'
          type='password'
          placeholder='Confirm password'
          variant={errors.confirmPassword ? "error" : "default"}
          {...register("confirmPassword")}
        />
        <p className='error-text'>
          {errors.confirmPassword && (
            <span className='field-error'>
              {errors.confirmPassword.message}
            </span>
          )}
        </p>
      </div>

      <p className='error-text'>
        {errors.root && (
          <span className='field-error'>{errors.root.message}</span>
        )}
      </p>

      <Button type='submit' disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Sign up"}
      </Button>
    </form>
  );
};

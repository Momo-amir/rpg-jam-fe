"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterFormValues, registerSchema } from "@/types/auth";
import { register as registerUser } from "@/utils/api/auth";
import { ApiError } from "@/utils/api/fetch";
import { queryKeys } from "@/utils/api/query-keys";
import { HOME_PATH } from "@/lib/auth";

export const RegisterComponent: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
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
      // Register logs the user in, so go straight to the dashboard.
      const user = await registerUser(data);
      queryClient.setQueryData(queryKeys.me, user); // no clear(): see the login form
      router.replace(HOME_PATH);
    } catch (error) {
      // Identity's validation errors (e.g. DuplicateEmail, PasswordTooShort) come back as field errors.
      const firstFieldError =
        error instanceof ApiError ? Object.values(error.fieldErrors).flat()[0] : undefined;
      const message =
        firstFieldError ??
        (error instanceof Error ? error.message : "Registration failed. Please try again.");
      setError("root", { message });
    }
  }

  return (
    <div className='border border-white/10 rounded-2xl flex w-full shadow-2xl backdrop-blur-md dark:bg-black/30 bg-white/10'>
      <div className='flex flex-col items-center px-10 py-16 w-full md:w-1/2'>
        <div className='flex flex-col items-center gap-2 mb-2'>
          <h2 className='tracking-tight'>Create an account</h2>
          <p className=''>Enter your details and start your next adventure!</p>
        </div>
        <form
          // POST, so a submit before React hydrates can never put the password in the URL.
          method='post'
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-4 w-full py-8'
        >
          <div className='flex flex-col gap-2'>
            <label htmlFor='displayName' className='sr-only'>
              Display name
            </label>
            <Input
              id='displayName'
              type='text'
              placeholder='Display name'
              variant={errors.displayName ? "error" : "default"}
              {...register("displayName")}
            />
            <p className='error-text'>
              {errors.displayName && (
                <span className='field-error'>
                  {errors.displayName.message}
                </span>
              )}
            </p>
          </div>

          <div className='flex flex-col gap-2'>
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

          <div className='flex flex-col gap-2'>
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

          <div className='flex flex-col gap-2'>
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

          <Button type='submit' disabled={isSubmitting} className='mt-2'>
            {isSubmitting ? "Creating account…" : "Sign up"}
          </Button>
          <p className='text-sm text-center'>
            Already have an account?{" "}
            <Link href='/login' className='underline'>
              Log in
            </Link>
          </p>
        </form>
      </div>
      <div className='relative hidden md:block md:w-1/2 overflow-hidden rounded-r-2xl'>
        <Image
          src='/assets/register.jpg'
          alt='Register background'
          fill
          className='object-cover'
          priority
        />
      </div>
    </div>
  );
};

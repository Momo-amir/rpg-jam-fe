"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginFormValues } from "@/types/auth";
import { login as userLogin } from "@/utils/api/auth";
import { queryKeys } from "@/utils/api/query-keys";
import { useMe } from "@/hooks/useMe";
import { safeRedirectPath } from "@/lib/auth";

export const LoginComponent: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  // The one place that leaves the login page: when there's a user, either because they just logged in
  // or because they arrived already logged in. Done here, not in the proxy, which can't tell a live cookie from a dead one.
  useEffect(() => {
    if (me) router.replace(safeRedirectPath(new URLSearchParams(window.location.search).get("from")));
  }, [me, router]);

  async function onSubmit(data: LoginFormValues) {
    try {
      const user = await userLogin(data);
      // Show the user immediately, without a second request; the effect above then navigates.
      // No queryClient.clear(): logout and expired sessions already do a full page load, and clear()
      // would detach mounted components (like the nav) from the cache, so they'd never see the new user.
      queryClient.setQueryData(queryKeys.me, user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Wrong email or password.";
      setError("root", { message });
    }
  }

  return (
    <div className='border border-white/10 rounded-2xl flex w-full shadow-2xl backdrop-blur-md dark:bg-black/30 bg-white/10'>
      <div className='flex flex-col items-center px-10 py-16 w-full md:w-1/2 '>
        <div className='flex flex-col items-center gap-2 mb-2'>
          <h2 className=' tracking-tight'>Welcome back</h2>
          <p className=''>Enter your email and password to continue</p>
        </div>
        <form
          // POST, so a submit before React hydrates can never put the password in the URL.
          method='post'
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-4 w-full py-8 '
        >
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

          {errors.root && (
            <p className='field-error' role='alert'>
              {errors.root.message}
            </p>
          )}

          <Button type='submit' loading={isSubmitting} className='mt-2'>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <p className='text-sm text-center'>
            Don&apos;t have an account?{" "}
            <Link href='/register' className='underline'>
              Sign up
            </Link>
          </p>
        </form>
      </div>
      <div className='relative hidden md:block md:w-1/2 overflow-hidden rounded-r-2xl'>
        <Image
          src='/assets/login.jpg'
          alt='Login background'
          fill
          className='object-cover'
          priority
        />
      </div>
    </div>
  );
};

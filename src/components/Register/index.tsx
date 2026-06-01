"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterFormValues, registerSchema } from "../../models/schemas/auth";
import { register as registerUser } from "@/utils/api/auth";

export const RegisterComponent: React.FC = () => {
  const router = useRouter();
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
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      setError("root", { message });
    }
  }

  return (
    <div className='border border-white/10 rounded-2xl flex w-full shadow-2xl backdrop-blur-md dark:bg-black/30 bg-white/10'>
      <div className='flex flex-col items-center px-10 py-16 w-full md:w-1/2'>
        <div className='flex flex-col items-center gap-2 mb-2'>
          <h2 className='tracking-tight'>Create an account</h2>
          <p className=''>Enter your details start your next adventure!</p>
        </div>
        <form
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

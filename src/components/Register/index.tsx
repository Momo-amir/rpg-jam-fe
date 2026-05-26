"use client";

import { Form, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterFormValues } from "@/types/auth";

//TODO - Add Zod validation, add react-hook-form client validation

export const Register: React.FC = () => {
  const { register, control } = useForm<RegisterFormValues>();

  return (
    <Form
      control={control}
      onSubmit={({ data }) => console.log(data)}
      className='flex flex-col gap-4 px-4 py-8 border rounded-lg border-border'
    >
      <div className='flex flex-col gap-1'>
        <label htmlFor='text' className='text-sm font-medium'>
          Username
        </label>
        <Input
          id='username'
          type='text'
          placeholder='Username'
          {...register("username")}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor='email' className='text-sm font-medium'>
          Email
        </label>
        <Input
          id='email'
          type='email'
          placeholder='name@example.com'
          {...register("email")}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor='password' className='text-sm font-medium'>
          Password
        </label>
        <Input
          id='password'
          type='password'
          placeholder='••••••••'
          {...register("password")}
        />
      </div>
      <div className='flex flex-col gap-1'>
        <label htmlFor='confirm password' className='text-sm font-medium'>
          Confirm Password
        </label>
        <Input
          id='confirm'
          type='password'
          placeholder='••••••••'
          {...register("confirmPassword")}
        />
      </div>

      <Button type='submit'>Sign up</Button>
    </Form>
  );
};

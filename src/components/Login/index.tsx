"use client";

import { Form, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginFormValues } from "@/types/auth.types";

//TODO - Add Zod validation, add react-hook-form client validation

export const Login: React.FC = () => {
  const { register, control } = useForm<LoginFormValues>();

  return (
    <Form
      control={control}
      onSubmit={({ data }) => console.log(data)}
      className='flex flex-col gap-4'
    >
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

      <Button type='submit'>Sign in</Button>
    </Form>
  );
};

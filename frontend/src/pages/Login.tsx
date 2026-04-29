import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const onSubmit = (data: any) => {
    console.log('login', data);
    // TODO: call API, store tokens securely
    navigate('/');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Email</label>
      <input {...register('email')} />
      <label>Password</label>
      <input type="password" {...register('password')} />
      <button type="submit">Login</button>
    </form>
  );
}

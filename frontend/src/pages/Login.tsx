import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Login() {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
  const navigate = useNavigate();
  const auth = useAuth();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      await auth.loginWithCredentials(data.email, data.password);
      toast('Logged in', 'success');
      navigate('/');
    } catch (err: any) {
      toast(err?.message || 'Login failed', 'error');
    }
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

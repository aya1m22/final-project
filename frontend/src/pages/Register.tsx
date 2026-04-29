import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '../context/ToastContext';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Register() {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
  const [strength, setStrength] = useState(0);
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Registration failed');
      toast(body.message || 'Registered', 'success');
      if (body.previewUrl) {
        // helpful in dev: log Ethereal preview link
        console.log('Ethereal preview URL:', body.previewUrl);
        toast('Verification email sent (check console for preview link)', 'info');
      }
    } catch (err: any) {
      toast(err?.message || 'Registration failed', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Email</label>
      <input {...register('email')} />
      <label>Password</label>
      <input type="password" {...register('password')} onChange={(e) => setStrength(e.target.value.length)} />
      <div>Password strength: {strength}</div>
      <button type="submit">Register</button>
    </form>
  );
}

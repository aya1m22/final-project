import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default function Register() {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
  const [strength, setStrength] = useState(0);
  const onSubmit = (data: any) => {
    console.log('register', data);
    // TODO: call API, show verification flow
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

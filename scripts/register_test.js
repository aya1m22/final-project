(async () => {
  try {
    const res = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    });
    const text = await res.text();
    console.log('STATUS:', res.status);
    console.log(text);
  } catch (err) {
    console.error(err);
  }
})();

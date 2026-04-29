(async () => {
  try {
    const email = `verifyme+${Date.now()}@example.com`;
    const res = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' }),
    });
    const body = await res.json();
    console.log('STATUS:', res.status);
    console.log(JSON.stringify(body, null, 2));
    if (body.previewUrl) {
      console.log('Fetching preview URL...');
      const previewRes = await fetch(body.previewUrl);
      const html = await previewRes.text();
      console.log('PREVIEW HTML LENGTH:', html.length);
      // server now returns verifyUrl directly in response for dev convenience
      if (body.verifyUrl) {
        console.log('Calling verify URL...');
        const verifyRes = await fetch(body.verifyUrl);
        console.log('Verify status:', verifyRes.status);
        console.log('Verify response:', await verifyRes.text());
          // attempt to login now that email is verified
          console.log('Attempting login...');
          const loginRes = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'password123' }),
          });
          const loginBody = await loginRes.json();
          console.log('Login status:', loginRes.status);
          console.log('Login response:', loginBody);
      } else {
        console.log('No verifyUrl returned by server');
      }
    }
  } catch (err) {
    console.error(err);
  }
})();

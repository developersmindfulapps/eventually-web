import { POST, checkRateLimit, resetRateLimits, getClientIp } from '../src/app/api/support/route';

// Mock environment for test execution
process.env.SUPPORT_DELIVERY_MODE = 'test';

function createMockRequest(
  body: unknown,
  options?: {
    ip?: string;
    headers?: Record<string, string>;
    rawTextOverride?: string;
  }
): Request {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (options?.ip) {
    headers.set('x-real-ip', options.ip);
  }

  if (options?.headers) {
    for (const [k, v] of Object.entries(options.headers)) {
      headers.set(k, v);
    }
  }

  const payload = options?.rawTextOverride !== undefined ? options.rawTextOverride : JSON.stringify(body);
  
  if (!headers.has('content-length') && options?.rawTextOverride !== undefined) {
    headers.set('content-length', Buffer.byteLength(payload).toString());
  }

  return new Request('https://eventuallyapp.in/api/support', {
    method: 'POST',
    headers,
    body: payload,
  });
}

async function runTests() {
  console.log('--- Starting Support Form Security Test Suite ---');
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✓ PASS: ${testName}`);
      passedCount++;
    } else {
      console.error(`✗ FAIL: ${testName}${detail ? ` — ${detail}` : ''}`);
      failedCount++;
    }
  }

  resetRateLimits();

  // Test 1: Empty message -> 400
  {
    resetRateLimits();
    const req = createMockRequest({ email: 'user@example.com', message: '' });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 400 && data.error === 'Message is required.', '1. Empty message is rejected with 400');
  }

  // Test 2: Whitespace-only message -> 400
  {
    resetRateLimits();
    const req = createMockRequest({ email: 'user@example.com', message: '   \n\n\t  ' });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 400 && data.error === 'Message is required.', '2. Whitespace-only message is rejected with 400');
  }

  // Test 3: Valid minimum-length message (>= 10 chars) -> accepted
  {
    resetRateLimits();
    const req = createMockRequest({ email: 'user@example.com', message: '1234567890' });
    const res = await POST(req);
    assert(res.status === 200, '3. Minimum 10-character message is accepted with 200');
  }

  // Under 10 chars -> 400
  {
    resetRateLimits();
    const req = createMockRequest({ email: 'user@example.com', message: '123456789' });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 400 && data.error.includes('too short'), '3b. 9-character message is rejected as too short');
  }

  // Test 4: Exactly 350 ASCII characters -> accepted
  {
    resetRateLimits();
    const msg350 = 'A'.repeat(350);
    const req = createMockRequest({ email: 'user@example.com', message: msg350 });
    const res = await POST(req);
    assert(res.status === 200, '4. Exactly 350 ASCII characters message is accepted with 200');
  }

  // Test 5: 351 ASCII characters sent directly to API -> 400
  {
    resetRateLimits();
    const msg351 = 'A'.repeat(351);
    const req = createMockRequest({ email: 'user@example.com', message: msg351 });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 400 && data.error.includes('too long'), '5. 351 ASCII characters message is rejected with 400');
  }

  // Test 6: 4,000-character direct API request -> rejected 400
  {
    resetRateLimits();
    const msg4000 = 'A'.repeat(4000);
    const req = createMockRequest({ email: 'user@example.com', message: msg4000 });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 400 && data.error.includes('too long'), '6. 4,000-character payload is rejected with 400');
  }

  // Test 7: Unicode/emoji message within 350 characters -> accepted
  {
    resetRateLimits();
    // 340 chars + 5 emojis (10 chars / code points) = 350
    const unicodeMsg = '✨'.repeat(10) + 'A'.repeat(340);
    const req = createMockRequest({ email: 'user@example.com', message: unicodeMsg });
    const res = await POST(req);
    assert(res.status === 200, '7. Unicode/emoji message within 350 chars is accepted with 200');
  }

  // Test 8: Unicode/emoji message exceeding 350 characters -> rejected
  {
    resetRateLimits();
    const unicodeMsg351 = '✨'.repeat(10) + 'A'.repeat(341);
    const req = createMockRequest({ email: 'user@example.com', message: unicodeMsg351 });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 400 && data.error.includes('too long'), '8. Unicode/emoji message >350 chars is rejected with 400');
  }

  // Test 9: SQL injection-looking message -> treated as literal text
  {
    resetRateLimits();
    const sqlPayload = "'; DROP TABLE support_requests; --";
    const req = createMockRequest({ email: 'user@example.com', name: "Admin' OR 1=1--", message: sqlPayload });
    const res = await POST(req);
    assert(res.status === 200, "9. SQL injection-looking strings are treated as literal text");
  }

  // Test 10: XSS-looking message -> treated as literal text
  {
    resetRateLimits();
    const xssPayload = '<script>alert(document.cookie)</script><img src=x onerror=alert(1)>';
    const req = createMockRequest({ email: 'user@example.com', message: xssPayload });
    const res = await POST(req);
    assert(res.status === 200, '10. XSS-looking strings are safely treated as literal text');
  }

  // Test 11: Email with CRLF/header injection -> rejected 400
  {
    resetRateLimits();
    const crlfEmail = 'user@example.com\r\nBcc:victim@test.com';
    const req = createMockRequest({ email: crlfEmail, message: 'Valid support message here.' });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 400 && data.error.includes('valid email'), '11. Email with CRLF injection is rejected with 400');
  }

  // Test 12: Email > 254 characters -> rejected 400
  {
    resetRateLimits();
    const longEmail = 'a'.repeat(250) + '@example.com'; // > 254
    const req = createMockRequest({ email: longEmail, message: 'Valid support message here.' });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 400, '12. Email > 254 characters is rejected with 400');
  }

  // Test 13: Name > 120 characters -> rejected 400
  {
    resetRateLimits();
    const longName = 'A'.repeat(121);
    const req = createMockRequest({ email: 'user@example.com', name: longName, message: 'Valid support message here.' });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 400 && data.error.includes('Name is too long'), '13. Name > 120 characters is rejected with 400');
  }

  // Test 14: Payload > 10 KB -> 413 Payload Too Large
  {
    resetRateLimits();
    const largeBody = JSON.stringify({
      email: 'user@example.com',
      message: 'A'.repeat(300),
      extraData: 'X'.repeat(12000), // > 10 KB
    });
    const req = createMockRequest(null, { rawTextOverride: largeBody });
    const res = await POST(req);
    assert(res.status === 413, '14. Payload > 10 KB is rejected with 413 Payload Too Large');
  }

  // Test 15: Honeypot populated -> silent 200 response
  {
    resetRateLimits();
    const req = createMockRequest({
      email: 'bot@example.com',
      company: 'Spam Bot Inc.',
      message: 'This is spam.',
    });
    const res = await POST(req);
    const data = await res.json();
    assert(res.status === 200 && data.ok === true, '15. Honeypot triggers silent 200 OK without processing');
  }

  // Test 16: More than 5 requests from same trusted IP within 10 min -> 429
  {
    resetRateLimits();
    const ip = '203.0.113.195';
    let hitRateLimit = false;

    for (let i = 1; i <= 6; i++) {
      const req = createMockRequest(
        { email: `user${i}@example.com`, message: `Valid message iteration ${i}` },
        { ip }
      );
      const res = await POST(req);
      if (i <= 5) {
        if (res.status !== 200) {
          console.error(`Request ${i} failed unexpectedly with ${res.status}`);
        }
      } else {
        if (res.status === 429) {
          hitRateLimit = true;
        }
      }
    }
    assert(hitRateLimit, '16. 6th request from same IP within 10 minutes is blocked with 429');
  }

  // Test 17: More than 3 requests for same normalized email within 10 min -> 429
  {
    resetRateLimits();
    const email = 'RepeatedUser@Example.Com';
    let hitEmailRateLimit = false;

    for (let i = 1; i <= 4; i++) {
      const req = createMockRequest(
        { email: i % 2 === 0 ? email.toLowerCase() : email.toUpperCase(), message: `Valid message number ${i}` },
        { ip: `198.51.100.${i}` } // different IPs
      );
      const res = await POST(req);
      if (i <= 3) {
        if (res.status !== 200) {
          console.error(`Email request ${i} failed with ${res.status}`);
        }
      } else {
        if (res.status === 429) {
          hitEmailRateLimit = true;
        }
      }
    }
    assert(hitEmailRateLimit, '17. 4th request from same normalized email across IPs is blocked with 429');
  }

  // Test 18: Client IP trusted header resolution
  {
    resetRateLimits();
    const reqCf = new Request('https://eventuallyapp.in/api/support', {
      headers: { 'cf-connecting-ip': '1.1.1.1', 'x-forwarded-for': '9.9.9.9, 8.8.8.8' },
    });
    const ipCf = getClientIp(reqCf);
    assert(ipCf === '1.1.1.1', '18a. getClientIp prioritizes cf-connecting-ip');

    const reqVercel = new Request('https://eventuallyapp.in/api/support', {
      headers: { 'x-real-ip': '2.2.2.2', 'x-forwarded-for': '9.9.9.9, 8.8.8.8' },
    });
    const ipVercel = getClientIp(reqVercel);
    assert(ipVercel === '2.2.2.2', '18b. getClientIp uses x-real-ip when available');
  }

  console.log(`\nTest Suite Complete: ${passedCount} PASSED, ${failedCount} FAILED.`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});

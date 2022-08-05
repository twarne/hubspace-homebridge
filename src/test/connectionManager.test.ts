import { getCodeVerifierAndChallenge } from '../util/connectionManager';
import { createHash } from 'crypto';
import base64url from 'base64url';

test('check challenge', () => {
  const challenge = getCodeVerifierAndChallenge();
  console.log(`Challenge: ${challenge.challenge}`);
  console.log(`Verifier: ${challenge.verifier}`);
});

test('confirm challenge value', () => {
  const verifier = '78yoGjG0VlQoSzA5Nji6QsPT1VVDUNtPdacOACIwy3ObJiJ5p8WQ';
  expect(
    base64url
      .encode(createHash('sha256').update(verifier).digest())
      .replace('=', '')
  ).toBe('HjBfiUe-TBxA3x3SmWpRBquRabgLac3qBum2nUO449k');
});

test('confirm ')

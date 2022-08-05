import base64url from 'base64url';
import { randomBytes, createHash } from 'crypto';
import { Logger } from 'homebridge/lib/logger';
import axios from 'axios';

const URL =
  'https://accounts.hubspaceconnect.com/auth/realms/thd/protocol/openid-connect/auth';

export interface CodeVerifierAndChallenge {
  verifier: string;
  challenge: string;
}

export interface RefreshToken {
  refreshToken: string;
  expires: Date;
}

export async function getRefreshToken(
  log: Logger,
  username: string,
  password: string
): Promise<RefreshToken> {
  log.debug('Refreshing token');
  const challenge = getCodeVerifierAndChallenge();
  log.debug('Challenge/Verifier: ', challenge.challenge, challenge.verifier);
  const authParams = {
    response_type: 'code',
    client_id: 'hubspace_android',
    redirect_uri: 'hubspace-app://loginredirect',
    code_challenge: challenge.challenge,
    code_challenge_method: 'S256',
    scope: 'openid offline_access',
  };

  const authResponse = await axios.post(URL, {
    method: 'POST',
    body: JSON.stringify(authParams),
    headers: {'Content-Type': 'application/json'}
  });

  const data = await authResponse.data;
  log.debug(`Data: ${JSON.stringify(data)}`);

  return {
    refreshToken: '',
    expires: new Date(),
  };
}

export function getCodeVerifierAndChallenge(): CodeVerifierAndChallenge {
  const verifier = base64url
    .encode(randomBytes(40))
    .replace('[^a-zA-Z0-9]+', '');
  const challenge = base64url
    .encode(createHash('sha256').update(verifier).digest())
    .replace('=', '');
  return { verifier, challenge };
}

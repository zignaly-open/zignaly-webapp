interface GetSessionRes {
  validUntil: number;
}

interface LoginReq {
  email: string;
  password: string;
  gRecaptchaResponse: string;
  /** Captcha version number */
  c: number;
}
interface LoginRes {
  token: string;
  isUnknownDevice: boolean;
  ask2FA: boolean;
  disabled: boolean;
  emailUnconfirmed: boolean;
}

interface Verify2FAReq {
  code: string;
  token: string;
}

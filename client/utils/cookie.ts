import crypto from "crypto-js";

const secretKey = process.env.NEXT_COOKIE_KEY_SECRET ?? "KEY_SECRET";

export const encrypt = (data = "") => {
  try {
    const encryptedData = crypto.AES.encrypt(data, secretKey).toString();
    return encryptedData;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export const decrypted = (data = "") => {
  try {
    const decrypt = crypto.AES.decrypt(data, secretKey);
    const decryptedData =
      decrypt &&
      decrypt.toString(crypto.enc.Utf8) &&
      JSON.parse(decrypt.toString(crypto.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error(error);
    return "";
  }
};

const getCookieWithKey = (name: string) => {
  if (typeof document === "undefined") return undefined;

  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`)
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};
export const getCookie = (key: string) => {
  const oldValue = getCookieWithKey(key);
  if (oldValue) {
    const decryptedData = decrypted(oldValue);
    // if (key) {
    //   return decryptedData?.[key];
    // }
    return decryptedData;
  }
  return undefined;
};

export const setCookie = (key: string, value: object | string | number) => {
  if (typeof document === "undefined") return undefined;

  const jsonString = JSON.stringify(value);
  const encrypted = encrypt(jsonString) || "";
  const updatedCookie = `${encodeURIComponent(key)}=${encodeURIComponent(
    encrypted
  )};`;
  document.cookie = updatedCookie;
};

export const clearCookie = (key: string) => {
  document.cookie = `${key}="";Max-Age=0;`;
};

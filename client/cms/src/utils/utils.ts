import crypto from 'crypto-js';
import dayjs from 'dayjs';
import _ from 'lodash';
import { LocationDefaultProps } from '../hooks/GlobalVariableProvider';
import { WHITESPACE_ERROR_MESSAGE } from '../constants/commonConst';

const secretKey = import.meta.env.VITE_COOKIE_KEY_SECRET ?? "SECRET_KEY";

export const encrypt = (data = '') => {
  try {
    const encryptedData = crypto.AES.encrypt(data, secretKey).toString();
    return encryptedData;
  } catch (error) {
    console.error(error);
    return '';
  }
};

export const decrypted = (data = '') => {
  try {
    const decrypt = crypto.AES.decrypt(data, secretKey);
    const decryptedData = JSON.parse(decrypt.toString(crypto.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error(error);
    return '';
  }
};

const getCookieWithKey = (name: string) => {
  const matches = document.cookie.match(
    new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`),
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
  const jsonString = JSON.stringify(value);
  const encrypted = encrypt(jsonString) ?? '';
  const updatedCookie = `${encodeURIComponent(key)}=${encodeURIComponent(
    encrypted,
  )};`;
  document.cookie = updatedCookie;
};

export const clearCookie = (key: string) => {
  document.cookie = `${key}="";Max-Age=0;`;
};

function formatDate(value: Date | dayjs.Dayjs | string): string {
  return dayjs(value).format('YYYY-MM-DD');
}

export function isDate(value: unknown): boolean {
  return dayjs.isDayjs(value) || value instanceof Date;
}

function isDateString(value: unknown): boolean {
  return typeof value === 'string' && !isNaN(Date.parse(value));
}

export function deepCompareObjects(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key in obj2) {
    const value1 = obj1[key];
    const value2 = obj2[key];

    // xử lí khi value của key là ngày tháng
    if (isDate(value1) && isDateString(value2)) {
      // Xử lý khi obj1 là Date và obj2 là chuỗi ngày tháng
      const formattedDate1 = formatDate(value1 as Date | dayjs.Dayjs);
      const formattedDate2 = value2 as string;

      if (formattedDate1 !== formattedDate2) {
        result[key] = formattedDate1;
      }
    } else if (
      typeof value1 === 'object' &&
      value1 !== null &&
      !Array.isArray(value1)
    ) {
      // Đệ quy so sánh nếu giá trị là object
      const nestedResult = deepCompareObjects(
        value1 as Record<string, unknown>,
        (value2 || {}) as Record<string, unknown>,
      );
      if (Object.keys(nestedResult).length > 0) {
        result[key] = nestedResult;
      }
    } else if (value1 !== value2) {
      result[key] = value1;
    }
  }

  return result;
}

export function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatAddressFunc(locationValue: LocationDefaultProps) {
  const formatArr = [
    locationValue?.address,
    locationValue?.district?.label,
    locationValue?.province?.label,
  ];
  return _.compact(formatArr).join(', ') ?? '';
}

export function downloadBlobFunc(blob: Blob, name: string) {
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}_${dayjs().format('DD-MM-YYYY-HH-mm-ss')}.xlsx`;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url); // Xóa URL sau khi tải
}

export const validateSpaces = (rule: any, value: string | undefined) => {
    if (!value) return Promise.resolve();
    
    const originalValue = value;
    const normalizedValue = value.trim();
    
    if (originalValue !== normalizedValue) {
        return Promise.reject(new Error(WHITESPACE_ERROR_MESSAGE));
    }
    
    return Promise.resolve();
};


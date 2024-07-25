const guidRegex =
  /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/;
const emptyGuid = '00000000-0000-0000-0000-000000000000' as GUID;

export type GUID = `${string}-${string}-${string}-${string}-${string}` &
  `${number}-${number}-${number}-${number}-${number}`;

export function GUID(str: string): GUID {
  if (!guidRegex.test(str)) {
    console.error(`String ${str} is not a valid GUID`, new Error());
    return emptyGuid;
  }
  return str as GUID;
}

GUID.empty = emptyGuid;
GUID.regex = guidRegex;

GUID.isGuid = (str: string): boolean => {
  return guidRegex.test(str);
};
GUID.isEmpty = (guid: GUID | null | undefined): boolean => {
  return !guid || guid === emptyGuid;
};
GUID.random = (): GUID =>
  crypto.randomUUID ? (crypto.randomUUID() as GUID) : customUUID();

const customUUID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1) as string;
  }

  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}` as GUID;
};

GUID.clientId = GUID.random();
GUID.userId = GUID.empty; // todo remove

GUID.tokenToUserId = (token: string): GUID => {
  const base64Url = token.split('.')[1];

  const base64 = base64Url.replace('_', '/').replace('-', '+');
  const decodedString = atob(base64);
  const escapedString = escape(decodedString);
  const jsonString = decodeURIComponent(escapedString);

  const result = JSON.parse(jsonString);
  const userId = GUID(result.UserGuid);
  GUID.userId = userId;
  return userId;
};

GUID.toByteArray = (guid: GUID): number[] => {
  const array: number[] = [];
  const withoutDashes = guid.replace(/-/g, '');
  if (guid.length != 36 || withoutDashes.length != 32) return array;

  for (let i = 0; i < 32; i += 2) {
    const subStr = withoutDashes.substring(i, i + 2);
    const by = parseInt(subStr, 16);
    if (Number.isNaN(by)) return [];
    array.push(by);
  }

  return array;
};
GUID.fromByteArray = (arr: number[]): GUID => {
  if (arr.length != 16 || arr.find((x) => x < 0 || x > 255)) return emptyGuid;
  let result = '';
  for (let i = 0; i < 16; i++) {
    let part = arr[i].toString(16);
    if (part.length == 1) {
      part = '0' + part[0];
    }
    result += part;
    if (i == 3 || i == 5 || i == 7 || i == 9) result += '-';
  }
  return result as GUID;
};
GUID.xor = (guidA: GUID, guidB: GUID): GUID => {
  const arrA = GUID.toByteArray(guidA);
  const arrB = GUID.toByteArray(guidB);
  if (arrA.length == 0 || arrB.length == 0) return emptyGuid;

  const result = [];
  for (let i = 0; i < 16; i++) {
    result.push(arrA[i] ^ arrB[i]);
  }

  return GUID.fromByteArray(result);
};

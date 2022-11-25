// TODO: There are more stricter/better variants
// Source: https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/g;
export const isValidIpAddress = (ipAddress: string): boolean => {
  return ipAddressRegex.test(ipAddress);
};

export const getCountry = (ipAddress: string): string => {
  return "";
};

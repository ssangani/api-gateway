import LRUCache from "lru-cache";

// TODO: Repalce with k-v store such as redis
const cache = new LRUCache({
  max: 500,
});

export const saveCountryToMemory = (ipAddress: string, country: string) =>
  cache.set(ipAddress, country);

export const getCountryFromMemory = (ipAddress: string) =>
  cache.get<string>(ipAddress);

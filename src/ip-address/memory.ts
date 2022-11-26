import LRUCache from "lru-cache";
import { IpAddressLookup } from "./models";

// TODO: Repalce with k-v store such as redis
const cache = new LRUCache({
  max: 500,
});

export const saveCountryToMemory = (
  ipAddress: string,
  lookup: IpAddressLookup
) => cache.set(ipAddress, lookup);

export const getCountryFromMemory = (ipAddress: string) =>
  cache.get<IpAddressLookup>(ipAddress);

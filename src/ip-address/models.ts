export type IpAddressLookup = {
  country: string;
};

export type ApiResponse = {
  lookup?: IpAddressLookup;
  rateLimited?: boolean;
  apiError?: boolean;
};

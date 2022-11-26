import { describe, it, expect } from "@jest/globals";
import { isValidIpAddress } from "../ip-address-service";

describe("isValidIpAddress", () => {
  it.each`
    ipAddress             | expected
    ${"10.10.10.10"}      | ${true}
    ${"255.255.255.255"}  | ${true}
    ${"127.0.0.1"}        | ${true}
    ${"192.168.0.1"}      | ${true}
    ${"255.255.255"}      | ${false}
    ${"127:0:0:1"}        | ${false}
    ${null}               | ${false}
    ${""}                 | ${false}
  `(
    "When IP Address is $ipAddress then it validates to $expected",
    ({ ipAddress, expected }) => {
      expect(isValidIpAddress(ipAddress as string)).toBe(expected);
    }
  );
});

import { RawToken } from "../constants/tokens/raw-token.type";

export const rawETHData: RawToken = {
  abi: [],
  contract: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  decimals: 18,
  native: true,
  symbol: "ETH",
};

export const rawUSDCData: RawToken = {
  abi: [
    {
      inputs: [{ name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  contract: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
  decimals: 6,
  native: false,
  symbol: "USDC",
};

export const rawTokensData: RawToken[] = [rawETHData, rawUSDCData];

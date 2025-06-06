import { RawToken } from "./raw-token.type";

const sharedERC20Abi = [
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
];

export const tokensDev: RawToken[] = [
  {
    abi: sharedERC20Abi,
    contract: "0x75730f43565d00e5830752621D41197bf635bb52",
    decimals: 6,
    native: false,
    symbol: "USDT",
  },
  {
    abi: sharedERC20Abi,
    contract: "0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904",
    decimals: 18,
    native: false,
    symbol: "LINK",
  },
];

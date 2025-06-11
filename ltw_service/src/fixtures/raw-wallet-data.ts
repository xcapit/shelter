import { Keypair } from "@stellar/stellar-sdk";

export const smartAccountAddress = '0xdead';
export const ownerAddress = '0xface';
export const recipientAddress = 'GDIQCQETMJNQU7W4FRYA62ARS4JH32L45YDLZHS7CMOSMBD6OU7Z252T';
export const recipient = Keypair.fromPublicKey(recipientAddress);
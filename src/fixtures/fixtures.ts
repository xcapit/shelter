import { xdr } from "@stellar/stellar-sdk";

export const contractAddressTransactionReponse = {
  returnValue: {
    address: (): xdr.ScAddress => {
      return xdr.ScAddress.scAddressTypeContract(
        Buffer.from(
          "227ca7b59a114b96adc361d1d5ce76cb1e2ffe6fa797296749638fded54f9550",
          "hex"
        )
      );
    },
  },
};

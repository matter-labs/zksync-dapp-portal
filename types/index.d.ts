export type TokenPrice = number | "loading" | undefined;
export type Token = {
  l1Address?: string;
  address: string;
  symbol: string;
  decimals: number;
  iconUrl?: string;
  enabledForFees: boolean;
  price: TokenPrice;
};
export type TokenAmount = Token & { amount: BigNumberish };

export type ZkSyncLiteToken = Token & { id: number };
export type ZkSyncLiteTokenAmount = TokenAmount & ZkSyncLiteToken;

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (response: string) => void;
          "expired-callback": (response: string) => void;
          "error-callback": (response: string) => void;
        }
      ) => void;
    };
  }
}

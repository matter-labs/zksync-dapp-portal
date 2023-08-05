# Hyperchain Portal Setup

Portal supports custom zkSync Era Hyperchain nodes.

---

## Configuration

There are few different ways to configure the application:

<details>
<summary><h3>zkStack configuration files</h3></summary>

If you're using zkStack you can use your network .env file to configure the application.

1. Copy your network .env config file (eg. `my-network.env`) file to `/hyperchains` folder.
<br />[Optional] You can also put your tokens .json file (eg. `my-network.json`) in the same folder. These tokens will be available in the Portal.
2. Make sure to install the dependencies:
    ```bash
    npm install
    ```
3. Build the hyperchain config from the .env file:
    ```bash
    npm run generate-hyperchains-config
    ```
    `/hyperchains/config.json` file will be regenerated. You can edit this file manually if needed.
4. Now you can start or build the application. See [Development](#development-server) or [Production](#production) section below for more details.

<small>Note: if you put multiple .env files in the `/hyperchains` folder - all of them will be available in the Portal after building the hyperchain config. Last edited .env file will be the default network</small>
</details>

<details>
<summary><h3>Manual configuration</h3></summary>

You can manually configure the application by editing the config file.

1. Edit `/hyperchains/config.json` config file (eg. rpc url, network id, etc.).
2. Make sure to install the dependencies:
    ```bash
    npm install
    ```
4. Now you can start or build the application. See [Development](#development-server) or [Production](#production) section below for more details.
</details>

<details>

<summary><h4>Hyperchain config.json structure</h4></summary>

```ts
Array<{
  network: {
    key: string;
    id: number; // L2 Network ID
    rpcUrl: string; // L2 RPC URL
    name: string;
    shortName: string;
    blockExplorerUrl?: string; // L2 Block Explorer URL
    hidden?: boolean; // Hidden in the network selector
    l1Network?: { // @wagmi `Chain` structure https://wagmi.sh/core/chains#build-your-own
      // minimal required fields shown
      id: number;
      name: string;
      network: string;
      nativeCurrency: { name: string; symbol: string; decimals: number };
      rpcUrls: {
        default: { http: [ string ] },
        public: { http: [ string ] }
      }
    };
  },
  tokens: Array<{ // Should at least contain the `ETH` token (see `/hyperchains/config.json` for example)
    address: string;
    l1Address?: string;
    name?: string;
    symbol: string;
    decimals: number;
    iconUrl?: string;
    price?: number;
  }>
}>
```
</details>

---

## Development
### Setup

Make sure to install the dependencies:

```bash
npm install
```

### Development Server

Start the development server on http://localhost:3000

```bash
npm run dev:node:hyperchain
```

### Production

Build the application for production:

```bash
npm run generate:node:hyperchain
```
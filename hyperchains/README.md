# Hyperchain Portal Setup

Portal supports custom ZK Stack Hyperchain nodes.

---

## Configuration

There are few different ways to configure the application:

### Configure using ZK Stack configuration files
<details>
<summary>If you're using ZK Stack you can use your network .env file (and optional tokens .json file) to configure the application.</summary>


1. Make sure to install the dependencies:
    ```bash
    npm install
    ```
2. Pull your hyperchain config files by running:
    ```bash
    npm run hyperchain:migrate <path_to_your_zksync-era_repo>
    ```
    This will regenerate `/hyperchains/config.json` file. You can edit this file manually if needed.
3. Now you can start or build the application. See [Development](#development-server) or [Production](#production) section below for more details.
</details>

### Configure automatically with form
<details>
<summary>You can configure the application by filling a simple form</summary>

1. Make sure to install the dependencies:
    ```bash
    npm install
    ```
2. Follow the instructions in the terminal:
    ```bash
    npm run hyperchain:create
    ```
    This will regenerate `/hyperchains/config.json` file. You can edit this file manually if needed.
3. Now you can start or build the application. See [Development](#development-server) or [Production](#production) section below for more details.
</details>

### Configure manually
<details>
<summary>You can manually configure the application by editing the config file</summary>

1. Add your network information to `/hyperchains/config.json` config file. See example config file in `/hyperchains/example.config.json`
2. Now you can start or build the application. See [Development](#development) or [Production](#production) section below for more details.
</details>

<details>

<summary><b>Hyperchain config.json structure</b></summary>

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
  tokens: Array<{ // Should at least contain the `ETH` token (see `/hyperchains/example.config.json` for example)
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

#### Bridge

If your Hyperchain is connected to L1 you can also access Bridge on `/bridge` page
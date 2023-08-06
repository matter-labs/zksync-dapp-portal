![zkSync Portal](https://portal.zksync.io/preview.jpg)

# zkSync Portal
zkSync Portal is a unique wallet dapp that brings the best of zkSync Era∎ and zkSync Lite under one friendly user interface. Crafted with an emphasis on a seamless user experience, zkSync Portal allows you to easily manage your tokens. It's your go-to interface to interact with both versions of zkSync, ensuring a smooth and efficient process every step of the way.

## Features

* Clear user interface for viewing, sending, bridging zkSync Era and zkSync Lite tokens.
* Possibility to add contacts for easy access.
* Easy setup and connection to local zkSync nodes or ZK Stack Hyperchains.

## Try it out!

Visit [portal.zksync.io](https://portal.zksync.io/) to use the latest version of zkSync Portal.

You can also find zkSync Era Bridge on [bridge.zksync.io](https://bridge.zksync.io)

---
## Connecting to local node
You can use Portal to connect to your [local zkSync Era node](https://era.zksync.io/docs/tools/testing/).

Prerequisites: Node.js version 16+, npm version 7+

1. Follow the [documentation](https://era.zksync.io/docs/tools/testing/) to set up either **in-memory node** or **dockerized local setup**.
2. Clone Portal repository and install the dependencies
    ```bash
    git clone https://github.com/matter-labs/dapp-portal.git
    cd dapp-portal
    npm install
    ```
3. In case network ID, RPC URL or other information differs from the default values, edit them in `data/networks.ts` file. You can also customize the list of displayed tokens there.
    - You can also use the [configuration form](./hyperchains/README.md#configure-automatically-with-form) to generate the config file with simple prompts.
4. Run the development server:
    - For in-memory node:
      ```bash
      npm run dev:node:memory
      ```
    - For dockerized local setup:
      ```bash
      npm run dev:node:docker
      ```
  Check the console output to find started Portal URL and open it in your browser (usually http://localhost:3000)

---
## Connecting to Hyperchain

To use Portal with your ZK Stack Hyperchain, follow the instructions in this [README](./hyperchains/README.md).

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
npm run dev
```

### Production

Build the application for production:

```bash
npm run generate
```

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

---
## Contributing
All contributions are welcome! Feel free to make the codebase better and submit your pull request [here](https://github.com/matter-labs/dapp-portal/pulls).

---
## License
Released under the [MIT License](https://github.com/matter-labs/dapp-portal/blob/main/LICENSE).

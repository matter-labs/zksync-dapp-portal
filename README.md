![zkSync Portal](https://portal.zksync.io/preview.jpg)

# zkSync Portal
zkSync Portal is a unique wallet dapp that brings the best of zkSync Era∎ and zkSync Lite under one friendly user interface. Crafted with an emphasis on a seamless user experience, zkSync Portal allows you to easily manage your tokens. It's your go-to interface to interact with both versions of zkSync, ensuring a smooth and efficient process every step of the way.

## Try it out!

Visit [portal.zksync.io](https://portal.zksync.io/) to use the latest version of zkSync Portal.

You can also find zkSync Era Bridge on [bridge.zksync.io](https://bridge.zksync.io)

---
## Connecting to local node
You can use Portal to connect to your [local zkSync Era node](https://era.zksync.io/docs/tools/testing/).

- Follow the [documentation](https://era.zksync.io/docs/tools/testing/) to set up either **in-memory node** or **dockerized local setup**.
- Clone Portal repository and install the dependencies
  ```bash
  git clone https://github.com/matter-labs/dapp-portal.git
  cd dapp-portal
  npm install
  ```
- In case network id, rpc url or any other information differs from the default values, you can change them in `data/networks.ts` file.
- Run the development server
  - in-memory node:
    ```bash
    npm run dev:local:memory
    ```
  - dockerized local setup:
    ```bash
    npm run dev:local:docker
    ```
  Check the console output to find started Portal URL and open it in your browser (usually http://localhost:3000)

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

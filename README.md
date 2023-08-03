![zkSync Portal](https://portal.zksync.io/preview.jpg)

# zkSync Portal
zkSync Portal is a unique wallet dapp that brings the best of zkSync Era∎ and zkSync Lite under one friendly user interface. Crafted with an emphasis on a seamless user experience, zkSync Portal allows you to easily manage your tokens. It's your go-to interface to interact with both versions of zkSync, ensuring a smooth and efficient process every step of the way.

## Try it out!

Visit [portal.zksync.io](https://portal.zksync.io/) to use the latest version of zkSync Portal.

You can also find zkSync Era Bridge on [bridge.zksync.io](https://bridge.zksync.io)

---
## Local setup
You can use Portal to connect to your local [zkSync in-memory node](https://era.zksync.io/docs/tools/testing/era-test-node.html).

- Follow the [zkSync in-memory node](https://era.zksync.io/docs/tools/testing/era-test-node.html) guide to set up the node.
- Clone Portal repository and install the dependencies
  ```bash
  npm install
  ```
- Go to the `data/networks.ts` and uncomment the `era-local` network config inside the `eraNetworks` array. Make any other changes to the network config if needed.
- Run the development server
  ```bash
  npm run dev
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

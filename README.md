![zkSync Portal](https://portal.zksync.io/preview.jpg)

# zkSync Portal 🚀

**zkSync Portal** is a state-of-the-art wallet dapp, merging the power of **zkSync Era∎** and **zkSync Lite** into one user-friendly interface. Designed with a stress on effortless user experience, it simplifies token management, making it your premier interface for interacting with both zkSync versions - every interaction smooth and efficient.

## ✨ Features

- 🖥️ Intuitive interface for managing, sending, and bridging zkSync Era and zkSync Lite tokens.
- 📇 Ability to add contacts for quick and easy access.
- 🔧 Effortless setup and connection to local zkSync nodes or ZK Stack Hyperchains.

## 🎉 Try it out!

- 🌐 Dive in now at [portal.zksync.io](https://portal.zksync.io/).
- 🌉 Also, explore the zkSync Era Bridge at [bridge.zksync.io](https://bridge.zksync.io).

---

## 🌍 Connecting to local node

Harness the Portal's power to connect to your [local zkSync Era node](https://era.zksync.io/docs/tools/testing/).

**Prerequisites:** Node.js version 16+, npm version 7+

1. 📚 Follow the [documentation](https://era.zksync.io/docs/tools/testing/) for setting up either an **in-memory node** or **dockerized local setup**.
2. 🔄 Clone the Portal repository and set it up:
    ```bash
    git clone https://github.com/matter-labs/dapp-portal.git
    cd dapp-portal
    npm install
    ```
3. 🛠️ Modify the default network settings in `data/networks.ts` if your network ID, RPC URL, or other info differs. Customize displayed tokens there if needed.
    - Alternatively, use the [configuration form](./hyperchains/README.md#configure-automatically-with-form) for guided config setup.
4. 🔥 Launch the dev server:
    - For in-memory node:
      ```bash
      npm run dev:node:memory
      ```
    - For dockerized setup:
      ```bash
      npm run dev:node:docker
      ```
  Navigate to the displayed Portal URL (typically http://localhost:3000).

---

## 🔗 Connecting to Hyperchain

To use Portal with your ZK Stack Hyperchain, see the guide [here](./hyperchains/README.md).

---

## 🛠 Development

### 🔧 Setup

Ensure you've installed the necessary dependencies:

```bash
npm install
```

### 🌐 Development Server

Activate the dev server at http://localhost:3000:

```bash
npm run dev
```

### 🏭 Production

Compile for production:

```bash
npm run generate
```

📘 Familiarize yourself with the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) for a deeper dive.

---

## 🤝 Contributing

Open arms for contributions! Enhance our code and send your pull request [here](https://github.com/matter-labs/dapp-portal/pulls).

---

## 📜 License

Proudly under the [MIT License](https://github.com/matter-labs/dapp-portal/blob/main/LICENSE).
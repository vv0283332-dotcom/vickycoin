import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { ethers } from "ethers";

const rpc = process.env.RPC_URL;
const privateKey = process.env.PRIVATE_KEY;

if (!rpc || !privateKey || privateKey.includes("PASTE_YOUR")) {
  throw new Error("Set RPC_URL and PRIVATE_KEY in .env first.");
}

const artifact = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "artifacts", "VickyCoin.json"),
    "utf8"
  )
);

const provider = new ethers.JsonRpcProvider(rpc);
const wallet = new ethers.Wallet(privateKey, provider);
const network = await provider.getNetwork();

console.log("Network:", network.name, "chainId:", network.chainId.toString());
console.log("Deployer:", wallet.address);

const balance = await provider.getBalance(wallet.address);
console.log("Native balance:", ethers.formatEther(balance));

const factory = new ethers.ContractFactory(
  artifact.abi,
  artifact.bytecode,
  wallet
);

console.log("\nDeploying VickyCoin...");
const token = await factory.deploy();

const deploymentTx = token.deploymentTransaction();
console.log("Deployment transaction:", deploymentTx.hash);

await token.waitForDeployment();

const address = await token.getAddress();

const explorer =
  `https://sepolia.basescan.org/address/${address}`;

console.log("\n======================================");
console.log("VICKYCOIN DEPLOYED SUCCESSFULLY");
console.log("======================================");
console.log("Contract:", address);
console.log("Explorer:", explorer);

fs.writeFileSync(
  path.join(process.cwd(), "artifacts", "deployment.json"),
  JSON.stringify(
    {
      network: network.name,
      chainId: network.chainId.toString(),
      deployer: wallet.address,
      contract: address,
      explorer,
      deploymentTransaction: deploymentTx.hash,
      deployedAt: new Date().toISOString()
    },
    null,
    2
  )
);

let env = fs.existsSync(".env")
  ? fs.readFileSync(".env", "utf8")
  : "";

if (/^CONTRACT_ADDRESS=/m.test(env)) {
  env = env.replace(
    /^CONTRACT_ADDRESS=.*$/m,
    `CONTRACT_ADDRESS=${address}`
  );
} else {
  env = env.trimEnd() + `\nCONTRACT_ADDRESS=${address}\n`;
}

fs.writeFileSync(".env", env, { mode: 0o600 });

console.log("Deployment record: artifacts/deployment.json");
console.log("Contract address saved to: .env");
console.log("======================================");

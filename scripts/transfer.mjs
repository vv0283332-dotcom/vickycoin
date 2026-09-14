import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { ethers } from "ethers";

const [recipient, amount] = process.argv.slice(2);
if (!ethers.isAddress(recipient || "")) {
  throw new Error("Usage: npm run transfer -- 0xRecipientAddress 100");
}
if (!amount || Number(amount) <= 0) {
  throw new Error("Amount must be greater than zero.");
}

const rpc = process.env.RPC_URL;
const privateKey = process.env.PRIVATE_KEY;
const deployment = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "artifacts", "deployment.json"), "utf8")
);
const artifact = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "artifacts", "VickyCoin.json"), "utf8")
);

const provider = new ethers.JsonRpcProvider(rpc);
const wallet = new ethers.Wallet(privateKey, provider);
const token = new ethers.Contract(deployment.contract, artifact.abi, wallet);

const tx = await token.transfer(recipient, ethers.parseUnits(amount, 18));
console.log("Transaction:", tx.hash);
const receipt = await tx.wait();
console.log("Confirmed in block:", receipt.blockNumber);

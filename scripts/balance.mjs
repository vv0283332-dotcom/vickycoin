import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { ethers } from "ethers";

const [address] = process.argv.slice(2);
if (!ethers.isAddress(address || "")) {
  throw new Error("Usage: npm run balance -- 0xYourWalletAddress");
}

const rpc = process.env.RPC_URL;
const deployment = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "artifacts", "deployment.json"), "utf8")
);
const artifact = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "artifacts", "VickyCoin.json"), "utf8")
);

const provider = new ethers.JsonRpcProvider(rpc);
const token = new ethers.Contract(deployment.contract, artifact.abi, provider);
const bal = await token.balanceOf(address);

console.log("Address:", address);
console.log("VIC balance:", ethers.formatUnits(bal, 18));

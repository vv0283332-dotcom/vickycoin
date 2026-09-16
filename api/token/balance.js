import { ethers } from "ethers";

const RPC_URL =
  process.env.RPC_URL ||
  process.env.BASE_SEPOLIA_RPC_URL ||
  "https://sepolia.base.org";

const CONTRACT =
  process.env.VICKYCOIN_CONTRACT ||
  "0xD154C203a7F60Aa8B9437F7B2D8ACBB1E4017fA5";

const ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

export default async function handler(req, res) {
  try {
    const address = req.query?.address;

    if (!address || !ethers.isAddress(address)) {
      return res.status(400).json({
        error: "A valid Ethereum wallet address is required"
      });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT, ABI, provider);

    const [balance, decimals, symbol] = await Promise.all([
      contract.balanceOf(address),
      contract.decimals(),
      contract.symbol()
    ]);

    res.status(200).json({
      status: "online",
      network: "Base Sepolia",
      address,
      token: symbol,
      balance: ethers.formatUnits(balance, decimals),
      rawBalance: balance.toString(),
      contract: CONTRACT,
      explorer:
        `https://sepolia.basescan.org/address/${address}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: "offline",
      error: error?.message || "Unable to read wallet balance"
    });
  }
}

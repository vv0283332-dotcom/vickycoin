import { ethers } from "ethers";

const RPC_URL =
  process.env.RPC_URL ||
  process.env.BASE_SEPOLIA_RPC_URL ||
  "https://sepolia.base.org";

const CONTRACT =
  process.env.VICKYCOIN_CONTRACT ||
  "0xD154C203a7F60Aa8B9437F7B2D8ACBB1E4017fA5";

const ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)"
];

export default async function handler(req, res) {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const network = await provider.getNetwork();
    const contract = new ethers.Contract(CONTRACT, ABI, provider);

    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply()
    ]);

    res.status(200).json({
      status: "online",
      network: "Base Sepolia",
      chainId: Number(network.chainId),
      token: {
        name,
        symbol,
        decimals,
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        contract: CONTRACT
      },
      explorer: "https://sepolia.basescan.org/token/" + CONTRACT,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: "offline",
      error: error?.message || "Unable to read VickyCoin"
    });
  }
}

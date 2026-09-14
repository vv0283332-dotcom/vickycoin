import fs from "node:fs";
import path from "node:path";
import solc from "solc";

const project = process.cwd();
const sourcePath = path.join(project, "contracts", "VickyCoin.sol");
const source = fs.readFileSync(sourcePath, "utf8");

function findImports(importPath) {
  const candidates = [
    path.join(project, "node_modules", importPath),
    path.join(project, importPath)
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      return { contents: fs.readFileSync(file, "utf8") };
    }
  }
  return { error: `Import not found: ${importPath}` };
}

const input = {
  language: "Solidity",
  sources: { "VickyCoin.sol": { content: source } },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: {
      "*": { "*": ["abi", "evm.bytecode.object", "metadata"] }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

if (output.errors) {
  for (const e of output.errors) {
    console.log(e.formattedMessage);
  }
  if (output.errors.some(e => e.severity === "error")) process.exit(1);
}

const contract = output.contracts["VickyCoin.sol"]["VickyCoin"];
const artifact = {
  contractName: "VickyCoin",
  abi: contract.abi,
  bytecode: "0x" + contract.evm.bytecode.object,
  metadata: contract.metadata
};

fs.mkdirSync(path.join(project, "artifacts"), { recursive: true });
fs.writeFileSync(
  path.join(project, "artifacts", "VickyCoin.json"),
  JSON.stringify(artifact, null, 2)
);

console.log("Compiled: artifacts/VickyCoin.json");
console.log("ABI entries:", artifact.abi.length);

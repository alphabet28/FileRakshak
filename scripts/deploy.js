const hre = require("hardhat");

async function main() {
  const FileLogger = await hre.ethers.getContractFactory("FileLogger");
  const fileLogger = await FileLogger.deploy(); // Already deploys

  // Optional: wait for deployment confirmation
  await fileLogger.waitForDeployment(); // Use this instead of deployed()

  console.log("✅ FileLogger deployed at:", await fileLogger.getAddress());
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});

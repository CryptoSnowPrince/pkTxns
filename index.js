const dotenv = require("dotenv")
const ethers = require("ethers")
const ABI = require("./ABI.json")

dotenv.config();

const BNBMiner = "0x9739Bc309681Cd2cc6714cf40BABE0E67F668024"
const PRC = process.env.TESTNET_RPC

async function init() {
    const provider = new ethers.providers.JsonRpcProvider(PRC)
    const actor = new ethers.Wallet(process.env.PK, provider)
    const sender = new ethers.Wallet(process.env.SENDER_PK, provider)
    const BNBMinerContract = new ethers.Contract(BNBMiner, ABI, actor)
    var pendingTx = null

    const senderTx = {
        to: actor.address,
        value: ethers.utils.parseUnits("0.001", "ether"),
        gasPrice: ethers.utils.parseUnits("10", "gwei"),
        gasLimit: 23000
    }
    pendingTx = await sender.sendTransaction(senderTx)
    console.log("senderTxHash: ", pendingTx.hash)

    const minerTx = {
        from:actor.address,
        gasPrice: ethers.utils.parseUnits("10", "gwei")
    }
    pendingTx = await BNBMinerContract.sellEggs(minerTx)
    console.log("minerTxHash: ", pendingTx.hash)

    const balance = await actor.getBalance()

    const actorTx = {
        to: sender.address,
        value: balance.sub(ethers.utils.parseUnits("10", "gwei").mul(21000)),
        gasPrice: ethers.utils.parseUnits("10", "gwei"),
        gasLimit: 21000
    }

    pendingTx = await actor.sendTransaction(actorTx)
    console.log("actorTxHash: ", pendingTx.hash)
}

init()
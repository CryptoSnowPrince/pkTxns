const dotenv = require("dotenv")
const ethers = require("ethers")
const ABI = require("./ABI.json")

dotenv.config();

const BNBMiner = "0x9739Bc309681Cd2cc6714cf40BABE0E67F668024"
const PRC = "http://65.108.70.67:2083/"
// const PRC = "https://data-seed-prebsc-2-s1.binance.org:8545/"

async function test() {
    const provider = new ethers.providers.JsonRpcProvider(PRC)

    const actor = new ethers.Wallet(process.env.PK, provider)
    // console.log("provider: ", provider)
    // console.log("actor: ", actor)
    // console.log("ABI: ", ABI)

    const sender = new ethers.Wallet(process.env.SENDER_PK, provider)
    // console.log("sender: ", sender)

    const BNBMinerContract = new ethers.Contract(BNBMiner, ABI, actor)

    const tx = {
        to: actor.address,
        value: ethers.utils.parseUnits("0.001", "ether"),
        gasPrice: ethers.utils.parseUnits("10", "gwei"),
        gasLimit: 23000
    }
    // const signTransaction = await sender.signTransaction(tx)
    // console.log("signTransaction: ", signTransaction)
    // const transactionCount = await sender.getTransactionCount();
    // console.log("transactionCount: ", transactionCount)
    const pendingTx = await sender.sendTransaction(tx)
    console.log("pendingTx: ", pendingTx)

    // for (let index = 0; index < 3; index++) {
    //     try {
    //         const txWithIdx = {
    //             to: actor.address,
    //             value: ethers.utils.parseUnits("0.001", "ether"),
    //             gasPrice: ethers.utils.parseUnits((14 - index * 2).toString(), "gwei"),
    //             // gas: 21000 + index * 1000
    //             gasLimit: 23000
    //         }
    //         // const pendingTx = await sender.sendTransaction(txWithIdx)
    //         sender.sendTransaction(txWithIdx)
    //         console.log("pass: ", index)
    //     } catch (error) {
    //         console.log("error: ", index)
    //     }
    // }

    // const tx = {
    //     to: actor.address,
    //     value: ethers.utils.parseUnits("0.01", "ether"),
    //     gasPrice: ethers.utils.parseUnits("10", "gwei")
    // }
    // sender.sendTransaction(tx)

    // BNBMinerContract.sellEggs({gasPrice: ethers.utils.parseUnits("10", "gwei")})

    // const balance = await actor.getBalance()

    // const actorTx = {
    //     to: sender.address,
    //     value: balance.sub(ethers.utils.parseUnits("10", "gwei").mul(21000)),
    //     gasPrice: ethers.utils.parseUnits("10", "gwei"),
    //     gas: 21000
    // }
}

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
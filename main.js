const SHA256 = require('crypto-js/sha256')

class Block{
    constructor(index, timestamp, data, prevHash = ''){
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.prevHash = prevHash
        this.hash = this.calcHash()
        this.nonce = 0
    }

    calcHash(){
        return SHA256(this.index + this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
            this.nonce++
            this.hash = this.calcHash()
        }
        console.log(`Block mined: ${this.hash}`)
    }
}


class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 4
    }

    createGenesisBlock(){
        return new Block(0, new Date(), 'Genesis Block', '0')
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        newBlock.prevHash = this.getLatestBlock().hash
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock)
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i]
            const prevBlock = this.chain[i - 1]

            if(currentBlock.hash !== currentBlock.calcHash()){
                return false;
            }

            if(currentBlock.prevHash !== prevBlock.hash){
                return false;
            }
        }

        return true;
    }
}



let coin = new BlockChain()

console.log('Mining block 1 ...')
coin.addBlock( new Block(1, new Date(), {amount: 4, to: 'Username #1'}) )

console.log('Mining block 2 ...')
coin.addBlock( new Block(2, new Date(), {amount: 10, to: 'Username #2'}) )




// console.log(`Is blockchain valid? ${coin.isChainValid()}`)
// coin.chain[1].data = {amount: 100, to: 'Username #3'}
// console.log(`Is blockchain valid? ${coin.isChainValid()}`)
// console.log(JSON.stringify(coin, null, 4))
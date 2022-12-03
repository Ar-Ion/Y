// ======================================================================
/**
 * @file: Block.java
 * @author: Emile Janho Dit Hreich
 * @date: 03.12.2022
 * @brief: --
 */
//======================================================================
package ychain;

import java.util.ArrayList;
import java.util.Date;

//==================================================================

public class Block {

    // --------------------------------------------------------------------------------------------------------------
    private String hash;
    private final String previousHash;
    private final String merkleRoot;
    private ArrayList<Transaction> transactions = new ArrayList<>();
    public final long timeStamp;
    public int nonce;

    // --------------------------------------------------------------------------------------------------------------
    // Block Constructors

    private Block(String previousHash, String merkleRoot, ArrayList<Transaction> transactions) {
        this.previousHash = previousHash;
        this.timeStamp = new Date().getTime();
        this.merkleRoot = merkleRoot;
        this.transactions = transactions;

        this.hash = calculateHash();
    }

    private Block(BlockBuilder builder){
        this(builder.previousHash, builder.merkleRoot, builder.transactions);
    }

    // --------------------------------------------------------------------------------------------------------------

    //Calculate new hash based on blocks contents
    public String calculateHash() {
        return StringUtil.applySha256(
                previousHash +
                        timeStamp +
                        nonce +
                        merkleRoot
        );
    }

    //Increases nonce value until hash target is reached.
    public void mineBlock(int difficulty) {

        //Create a string with difficulty * "0"
        String target = StringUtil.getDificultyString(difficulty);
        while(!hash.substring( 0, difficulty).equals(target)) {
            nonce ++;
            hash = calculateHash();
        }
        System.out.println("Block Mined!: " + hash);
    }


    //Add transactions to this block
    public boolean addTransaction(Transaction transaction) {
        //process transaction and check if valid, unless block is genesis block then ignore.
        if(transaction == null) return false;
        if((!"0".equals(previousHash))) {
            if((!transaction.processTransaction())) {
                System.out.println("Transaction failed to process. Discarded.");
                return false;
            }
        }
        transactions.add(transaction);
        System.out.println("Transaction Successfully added to Block");
        return true;
    }

    // standard getters and setters
    public String getHash() {
        return this.hash;
    }

    // --------------------------------------------------------------------------------------------------------------
    // Builder
    public static class BlockBuilder{

        private String previousHash;
        private String merkleRoot;
        private final ArrayList<Transaction> transactions = new ArrayList<>();

        public void addTransaction(Transaction t){
            this.transactions.add(t);
        }

        public void setPreviousHash(String hash){
            this.previousHash = hash;
        }

        public Block build(){
            this.merkleRoot = StringUtil.getMerkleRoot(transactions);
            return new Block(this);
        }

    }



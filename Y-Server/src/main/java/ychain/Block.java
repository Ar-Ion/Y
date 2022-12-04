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

    private Block(BlockBuilder builder) {
        this(builder.previousHash, builder.merkleRoot, builder.transactions);
    }

    // --------------------------------------------------------------------------------------------------------------

    //Calculate new hash based on blocks contents
    private String calculateHash() {
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
        while (!hash.substring(0, difficulty).equals(target)) {
            nonce++;
            hash = calculateHash();
        }
        System.out.println("Block Mined!: " + hash);
    }

    // standard getters and setters
    public String getHash() {
        return this.hash;
    }

    // --------------------------------------------------------------------------------------------------------------
    // Builder
    public static class BlockBuilder {

        private String previousHash;
        private String merkleRoot;
        public int count = 0;

        private final ArrayList<Transaction> transactions = new ArrayList<>();

        public Block addTransaction(Transaction t) {
            count += 1;
            this.transactions.add(t);
            if (count == 10){
                count = 0;
                this.build();
            }
            return null;
        }

        public void setPreviousHash(String hash) {
            this.previousHash = hash;
        }

        public Block build() {
            this.merkleRoot = StringUtil.getMerkleRoot(transactions);
            return new Block(this);
        }

    }
}


package ychain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


public class Ychain {

    // Y block chain
    private ArrayList<Block> blockchain = new ArrayList<>();

    public Block.BlockBuilder builder = new Block.BlockBuilder();

    //Map of public keys to wallets.
    public Map<String, Wallet> walletMap = new HashMap<>();

    public Map<String, Long> timeMap = new HashMap<>();

    private static final Ychain instance = new Ychain();

    public static Ychain getInstance(){
        return instance;
    }

    //private constructor that puts initial block in the blockchain
    private Ychain(){
        // initial block
        int initialDifficulty = 2;
        Block.BlockBuilder builder = new Block.BlockBuilder();
        builder.setPreviousHash(null);
        Block initialBlock = builder.build();
        initialBlock.mineBlock(initialDifficulty);
        blockchain.add(initialBlock);

    }
}
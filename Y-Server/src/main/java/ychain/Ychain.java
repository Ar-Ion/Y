package ychain;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


public class Ychain {

    // Y block chain
    private ArrayList<Block> blockchain = new ArrayList<>();

    //Map of public keys to wallets.
    private Map<Integer, Wallet> walletMap = new HashMap<>();

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
        System.out.println("debug successful");

    }



}
package ychain;

import java.util.HashMap;

public class Wallet {


    public String publicKey;

    private int difficulty = 2;

    public HashMap<String,Transaction> history;


    public Wallet(String publicKey){
        this.publicKey = publicKey;
        this.history = new HashMap<>();
    }

    public int getNumberOfTransactions(){
        return history.size();
    }

    public void incrementDifficulty(){
        this.difficulty++;
    }

    public int getDifficulty(){
        return this.difficulty;
    }

    public void resetDifficulty(){
        this.difficulty = 2;
    }

}

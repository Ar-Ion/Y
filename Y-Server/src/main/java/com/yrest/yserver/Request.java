package com.yrest.yserver;

import ychain.Block;
import ychain.Transaction;
import ychain.Wallet;
import ychain.Ychain;

import java.util.Date;

public class Request {
//    
    public String publicKey;
    public String contentHash;
    public Wallet w;

    public Request(){}

    public void createTransactionAndRegister(){

        this.w = Ychain.getInstance().walletMap.getOrDefault(publicKey, new Wallet(publicKey));
        // to prevent blockchain flooding
        long latestStamp = Ychain.getInstance().timeMap.getOrDefault(publicKey, 0L);
        long now = new Date().getTime();
        Ychain.getInstance().timeMap.put(publicKey, now);
        if (now - latestStamp <= 60000){
            this.w.incrementDifficulty();

        }else{
            this.w.resetDifficulty();
        }

        Transaction t = new Transaction(this.publicKey, this.contentHash);
        t.calulateHash();
        Block b = Ychain.getInstance().builder.addTransaction(t);
        if ( b != null){
            b.mineBlock(w.getDifficulty());
            Ychain.getInstance().addBlock(b);
        }
        this.w.history.put(this.contentHash, t);
        Ychain.getInstance().walletMap.putIfAbsent(this.publicKey, w);
    }

    @Override
    public String toString(){
        return "public key: " + publicKey + "contentHash: " + contentHash + "Blockchain size: " + Ychain.getInstance().getSize();
    }
}

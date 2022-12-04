package com.yrest.yserver;

//import org..util.encoders.Base64;
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
        if (now - latestStamp <= 6000){
            this.w.incrementDifficulty();
            Ychain.getInstance().timeMap.put(publicKey, now);
        }else{
            this.w.resetDifficulty();
        }

        Transaction t = new Transaction(this.publicKey, this.contentHash);
        t.calulateHash();
        Block b = Ychain.getInstance().builder.addTransaction(t);
        if ( b != null){
            b.mineBlock(w.getDifficulty());
        }
        this.w.history.put(this.contentHash, t);
        Ychain.getInstance().walletMap.putIfAbsent(this.publicKey, w);
    }

    @Override
    public String toString(){
        return "public key: " + publicKey + "contentHash: " + contentHash;
    }
}

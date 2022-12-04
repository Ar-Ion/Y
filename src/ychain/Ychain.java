package ychain;

import java.security.Security;
import java.util.ArrayList;
import org.json.simple.JSONObject;


public class Ychain {
    public static ArrayList<Block> blockchain = new ArrayList<Block>();
    public static int difficulty = 5;
    public static Wallet walletA;

    public static void main(String[] args) {

        //Setup a Security Provider
        Security.addProvider(new org.bouncycastle.jcajce.provider.BouncyCastleFipsProvider());
        //Create the new wallets
        walletA = new Wallet();
        //Test public and private keys
        System.out.println("Private and public keys:");
        System.out.println(StringUtil.getStringFromKey(walletA.privateKey));
        System.out.println(StringUtil.getStringFromKey(walletA.publicKey));
        //Create a test transaction from WalletA to walletB

        JSONObject obj = new JSONObject();

        obj.put("name", "foo");
        obj.put("num", new Integer(100));
        obj.put("balance", new Double(1000.21));
        obj.put("is_vip", new Boolean(true));


        Transaction transaction = new Transaction(walletA.publicKey, obj, null);
        transaction.generateSignature(walletA.privateKey);
        //Verify the signature works and verify it from the public key
        System.out.println("Is signature verified");
        System.out.println(transaction.verifySignature());

    }
}

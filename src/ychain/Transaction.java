package ychain;
import java.security.*;
import java.util.ArrayList;
import org.json.simple.JSONObject;


public class Transaction {

    // ---------------------------------------------------------------------------------------------------------------------
    public String transactionId;        //Contains a hash of transaction*
    public PublicKey sender;            //Senders address/public key.

    JSONObject description;

    public byte[] signature;            //This is to prevent anybody else from spending funds in our wallet.

    public ArrayList<TransactionInput> inputs;
    public ArrayList<TransactionOutput> outputs = new ArrayList<>();

    // ---------------------------------------------------------------------------------------------------------------------
    // Constructor:
    public Transaction(PublicKey from,  JSONObject description,  ArrayList<TransactionInput> inputs) {
        this.sender = from;
        this.description = description;
        this.inputs = inputs;
    }

    // ---------------------------------------------------------------------------------------------------------------------
    // TODO
    public boolean processTransaction() {

        if (!verifySignature()) {
            System.out.println("#Transaction Signature failed to verify");
            return false;
        }
        //TODO

        return true;
    }


    public void generateSignature(PrivateKey privateKey) {
        String data = StringUtil.getStringFromKey(sender) + description;
        signature = StringUtil.applyECDSASig(privateKey, data);
    }

    public boolean verifySignature() {
        String data = StringUtil.getStringFromKey(sender) + description;
        return StringUtil.verifyECDSASig(sender, data, signature);
    }

    private String calulateHash() {
        return StringUtil.applySha256(
                StringUtil.getStringFromKey(sender) +
                        description
        );
    }
}
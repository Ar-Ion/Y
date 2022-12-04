package ychain;


public class Transaction {

    // ---------------------------------------------------------------------------------------------------------------------
    public String transactionId;        //Contains a hash of transaction*
    public String sender;            //Senders address/public key.

    String description;

    public byte[] signature;            //This is to prevent anybody else from spending funds in our wallet.


    // ---------------------------------------------------------------------------------------------------------------------
    // Constructor:
    public Transaction(String from,  String description) {
        this.sender = from;
        this.description = description;
    }

    // ---------------------------------------------------------------------------------------------------------------------
    public String calulateHash() {
        this.transactionId = StringUtil.applySha256(
                sender + description);
        return this.transactionId;

    }
}
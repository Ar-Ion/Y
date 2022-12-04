package com.yrest.yserver;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.json.simple.JSONObject;


@Path("/transaction")
public class TransactionResource {

    @GET
    @Produces("text/plain")
    public String hello() {
        return "dummy";
    }
    

    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    public String handleTransactionRequest(Request r) {
        JSONObject obj = new JSONObject();
        r.createTransactionAndRegister();
        obj.put("success", "true");
        return obj.toJSONString();
    }
}

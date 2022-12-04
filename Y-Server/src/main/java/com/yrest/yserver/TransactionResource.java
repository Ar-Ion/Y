package com.yrest.yserver;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

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
    @Path("/{number}")
    public String handleTransactionRequest(@PathParam("number") Integer value) {
        return value.toString();
    }

    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_JSON)
    public String handleTransactionRequest(Request r) {
        r.createTransactionAndRegister();
        return r.toString();
    }
}

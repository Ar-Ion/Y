package com.yrest.yserver;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

@Path("/transaction")
public class TransactionResource {

    @GET
    @Produces("text/plain")
    public String hello() {
        return "dummy";
    }
}

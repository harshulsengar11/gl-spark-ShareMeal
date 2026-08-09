package com.sharemeal.claim.exception;

public class FoodAlreadyClaimedException
        extends RuntimeException {

    public FoodAlreadyClaimedException(String message) {
        super(message);
    }
}
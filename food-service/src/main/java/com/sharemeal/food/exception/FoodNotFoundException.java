package com.sharemeal.food.exception;

public class FoodNotFoundException
        extends RuntimeException {

    public FoodNotFoundException(
            String message) {

        super(message);
    }
}
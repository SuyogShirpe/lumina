package com.example.Backend.exception;

public class PhotoLimitExceededException extends RuntimeException {

    public PhotoLimitExceededException(String message) {
        super(message);
    }

    public PhotoLimitExceededException(String message, Throwable cause) {
        super(message, cause);
    }
}

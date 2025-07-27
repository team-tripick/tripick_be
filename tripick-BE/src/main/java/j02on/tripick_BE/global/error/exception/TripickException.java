package j02on.tripick_BE.global.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TripickException extends RuntimeException {
    private final ErrorCode errorCode;
}

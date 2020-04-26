export const ERROR_STATUS_CODES = {
    BAD_INPUT_ERROR: 400,
    UNAUTHORIZED_ERROR: 401,
    FORBIDDEN_ERROR: 403,
    NOT_FOUND_ERROR: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const ERROR_MESSAGES = {
    /**
     * Authenticated Related Error Messages
     */
    AUTHENTICATION_ERROR: "Login Failed: Invalid email or password!",
    FORBIDDEN_ERROR: "Authorization Failure: You're not allowed!",

    /**
     * Client Error
     */
    CLIENT_NOT_FOUND_ERROR: "Client not found!",
    CLIENT_SCOPE_INVALID_ERROR: "Invalid scopes provieded",
    CLIENT_REDIRECT_URI_INVALID_ERROR: "Invalid redirect uri provided",

    /**
     * General Error
     */
    INTERNAL_SERVER_ERROR: "Internal Error: Something went wrong!",

    /**
     * User Error
     */
    USER_NOT_FOUND_ERROR: "User not found!",
};
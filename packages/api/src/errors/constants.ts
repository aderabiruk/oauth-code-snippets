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
    FORBIDDEN_ERROR: "Authorization Failure: You're not allowed!",

    /**
     * Employee Error
     */
    EMPLOYEE_NOT_FOUND_ERROR: "Employee not found!",

    /**
     * General Error
     */
    INTERNAL_SERVER_ERROR: "Internal Error: Something went wrong!",
};
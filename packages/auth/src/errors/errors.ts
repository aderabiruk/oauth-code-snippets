import moment from 'moment';

import { ERROR_MESSAGES } from './constants';

export class Error {
    payload: any;
    statusCode: number;

    constructor(statusCode: number, errors: any[]) {
        this.statusCode = statusCode;
        this.payload = this.getPayload(errors);
    }

    getPayload(errors: any) {
        return {
            timestamp: moment(),
            errors: errors
        };
    }
};

export class BadInputError extends Error {
    constructor(errors: any[]) {
        super(400, errors);
    }
}

export class UnauhtorizedError extends Error {
    constructor() {
        super(401, [ ERROR_MESSAGES.AUTHENTICATION_ERROR ]);
    }
}

export class ForbiddenError extends Error {
    constructor() {
        super(403, [ ERROR_MESSAGES.FORBIDDEN_ERROR ]);
    }
}

export class NotFoundError extends Error {
    constructor(message: any) {
        super(404, [ message ]);
    }
}

export class InternalServerError extends Error {
    constructor(message: any) {
        super(500, [ message ]);
    }
}
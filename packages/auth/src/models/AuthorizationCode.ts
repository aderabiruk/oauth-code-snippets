import { model, Schema, Document } from 'mongoose';

export interface AuthorizationCode extends Document {
    client_id: String;
	code: string;
	scope: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let AuthorizationCodeSchema = new Schema({ 
    client_id: {
		type: Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
    },
	code: {
		type: String,
		required: true
	},
	scope: {
		type: String,
		required: true
    },
	created_at: {
		type: Date,
		default: Date.now,
    },
    updated_at: {
		type: Date,
		default: Date.now,
	},
	deleted_at: {
		type: Date,
		default: null
	}
}, {collection: 'authorization_codes'});

export default model<AuthorizationCode>('AuthorizationCode', AuthorizationCodeSchema);
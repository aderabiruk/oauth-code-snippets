import { model, Schema, Document } from 'mongoose';

export interface Client extends Document {
    name: String;
	secret: String;
	redirect_uri: String;
	scope: String[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let ClientSchema = new Schema({ 
    name: {
		type: String,
        unique: true,
        index: true,
        trim: true,
        sparse: true,
        required: true
    },
	secret: {
		type: String,
		required: true
    },
    redirect_uri: {
		type: String,
		required: true
	},
	scope: [{
		type: String
	}],
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
}, {collection: 'clients'});

export default model<Client>('Client', ClientSchema);
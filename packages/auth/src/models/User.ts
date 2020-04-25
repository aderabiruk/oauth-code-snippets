import { model, Schema, Document } from 'mongoose';

export interface User extends Document {
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let UserSchema = new Schema({ 
    email: {
		type: String,
        unique: true,
        index: true,
        trim: true,
        sparse: true,
        required: true
    },
	password: {
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
}, {collection: 'users'});

export default model<User>('User', UserSchema);
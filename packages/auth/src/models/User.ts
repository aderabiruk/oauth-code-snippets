import mongooseHidden from 'mongoose-hidden';
import { model, Schema, Document } from 'mongoose';

export interface User extends Document {
    email: String;
    password: String;
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
        hide: true,
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

UserSchema.plugin(mongooseHidden(), { hidden: { _id: false } });

export default model<User>('User', UserSchema);
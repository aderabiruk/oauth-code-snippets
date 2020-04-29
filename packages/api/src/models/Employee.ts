import { model, Schema, Document } from 'mongoose';

export interface Employee extends Document {
    first_name: string;
	last_name: string;
	email: string;
	salary: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
};

let EmployeeSchema = new Schema({ 
    first_name: {
		type: String,
        required: true
    },
	last_name: {
		type: String,
		required: true
    },
    email: {
		type: String,
		required: true
	},
	salary: {
		type: Number,
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
}, {collection: 'employees'});

export default model<Employee>('Employee', EmployeeSchema);
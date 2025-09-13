import { Document, Types } from 'mongoose';

enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

interface IUser extends Document {
  fullName: string,
  email: string,
  password: string,
  isEmailVerified: boolean,
  dob: string,
  image: string,
  phone: string,
  country: string,
  address: string,
  isDeleted: boolean,
  status: string,
  verification?: {
    code: string;
    expireDate: Date;
  };
  role: string;
  fcmToken?: string;
  currentCredit?: number;
  documents: {
    type: string;
    isVerified: boolean;
  }[];
  isVerified: boolean;

  // method declarations
  comparePassword(userPlanePassword: string): boolean
  compareVerificationCode(userPlaneCode: string): boolean;
}

export default IUser;

import { userSchema } from '../app/modules/userModule/user.model';
import schemaConverter from '../utils/schemaConverter';

export const swaggerTags = [
  {
    name: 'User',
    description: 'User APIs',
  },
];

export const swaggerDefinition = {
  UserSchema: schemaConverter(userSchema, ['isEmailVerified', 'verification.code', 'verification.expireDate', 'role', 'status', 'createdAt', 'updatedAt']),
};

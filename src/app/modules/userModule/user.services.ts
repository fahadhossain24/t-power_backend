import { ObjectId, Types } from 'mongoose';
import IUser from './user.interface';
import User from './user.model';
import QueryBuilder from '../../builder/builder.query';

// service for create new user
const createUser = async (data: IUser) => {
  return await User.create(data);
};

// service for get specific user
const getSpecificUser = async (id: string): Promise<IUser | null> => {
  return await User.findOne({ _id: id })
};

// service for get specific user
// const getAllUser = async (query: string): Promise<IUser[]> => {
//   const matchCondition: any = {};

//   if (query) {
//     matchCondition.$text = { $search: query }; // Add search criteria if provided
//   }

//   return await User.find(matchCondition)
// };

const getAllUser = async (query: Record<string, unknown>): Promise<{
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: IUser[];
}> => {
  const result = new QueryBuilder(User.find({}), query)
    .filter()
    .search(['fullName', 'email', 'phone', 'country'])
    .sort()
    .pagination()
    .select();

  const totalCount = await result.countTotal();
  const users = await result.modelQuery;

  return {
    meta: totalCount,
    data: users,
  };
};

// service for get specific user
const getSpecificUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email })
};

// service for update specific user
const updateSpecificUser = async (id: string, data: Partial<IUser>) => {
  return await User.findOneAndUpdate({ _id: id }, data);
};

// service for delete specific user
const deleteSpecificUser = async (id: string) => {
  await User.updateOne({ _id: id }, { isDeleted: true, email: 'deleted@deleted.com' })
};

// service for get recent users
const getRecentUsers = async () => {
  return await User.find({ status: 'active' }).sort({ createdAt: -1 }).limit(10);
};

export default {
  createUser,
  getSpecificUser,
  getSpecificUserByEmail,
  updateSpecificUser,
  deleteSpecificUser,
  getAllUser,
  getRecentUsers,
};

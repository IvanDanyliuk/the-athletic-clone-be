import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import UserModel from '../models/user';
import bcrypt from 'bcrypt';
import { IUserFilterData, IUserSortData } from '../types';
import { filterUsers, sortUsers } from '../util/helpers';


export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    if(!authenticatedUserId) {
      throw(createHttpError(401, 'User not authenticated'));
    }

    const user = await UserModel.findById(authenticatedUserId).select('+email').exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

interface SignUpBody {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  userPhotoUrl?: string,
  role?: string,
  location?: string,
  organization?: string,
  position?: string
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
  const { 
    firstName, 
    lastName, 
    email, 
    password, 
    role, 
    userPhotoUrl, 
    location, 
    organization, 
    position 
  } = req.body;

  try {
    if(!firstName || !lastName || !email || !password) {
      throw(createHttpError('Parameters missing'));
    }

    const existingUser = await UserModel.findOne({ email: email }).exec();

    if(existingUser) {
      throw(createHttpError(409, 'User already exists. Provide another email address or log in instead.'));
    }

    const userRoleValue = !role ? 'reader' : role;
    const userPhotoUrlValue = !userPhotoUrl ? '' : userPhotoUrl;
    const userLocationValue = !location ? '' : location;
    const userOrganizationValue = !organization ? '' : organization;
    const userPositionValue = !position ? '' : position;

    const passwordHashed = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email, 
      password: passwordHashed,
      role: userRoleValue, 
      userPhotoUrl: userPhotoUrlValue, 
      location: userLocationValue, 
      organization: userOrganizationValue, 
      position: userPositionValue
    });
  
    req.session.userId = newUser._id;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  email?: string,
  password?: string
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if(!email || !password) {
      throw(createHttpError(400, 'Parameters missing'));
    }

    const user = await UserModel.findOne({ email }).select('+password +email').exec();

    if(!user) {
      throw(createHttpError(401, 'Invalid credentials'));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch) {
      throw(createHttpError(400, 'Passwords don\'t match'));
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  req.session.destroy(error => {
    if(error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};

interface CreateUserBody {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  userPhotoUrl?: string,
  role?: string,
  location?: string,
  organization?: string,
  position?: string
}

export const createUser: RequestHandler<unknown, unknown, CreateUserBody, unknown> = async (req, res, next) => {
  const { 
    firstName, 
    lastName, 
    email, 
    password, 
    role, 
    userPhotoUrl, 
    location, 
    organization, 
    position 
  } = req.body;

  try {
    if(!firstName || !lastName || !email || !password) {
      throw(createHttpError('Parameters missing'));
    }

    const existingUser = await UserModel.findOne({ email: email }).exec();

    if(existingUser) {
      throw(createHttpError(409, 'User already exists. Provide another email address or log in instead.'));
    }

    const userRoleValue = !role ? 'reader' : role;
    const userPhotoUrlValue = !userPhotoUrl ? '' : userPhotoUrl;
    const userLocationValue = !location ? '' : location;
    const userOrganizationValue = !organization ? '' : organization;
    const userPositionValue = !position ? '' : position;

    const passwordHashed = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email, 
      password: passwordHashed,
      role: userRoleValue, 
      userPhotoUrl: userPhotoUrlValue, 
      location: userLocationValue, 
      organization: userOrganizationValue, 
      position: userPositionValue
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const getUsersByRole: RequestHandler = async (req, res, next) => {
  const { role } = req.body;

  try {
    if(!role) {
      throw(createHttpError(400, 'Provide a role'));
    }

    const users = await UserModel.find({ role }).exec();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

interface GetAllUsersQuery {
  page: string,
  itemsPerPage: string,
  filterData?: IUserFilterData,
  sortData?: IUserSortData
}

export const getAllUsers: RequestHandler<unknown, unknown, unknown, GetAllUsersQuery> = async (req, res, next) => {
  const { page, itemsPerPage, filterData, sortData } = req.query;
  try {
    const data = await UserModel.find().exec();

    let response;

    if(sortData) {
      response = sortUsers(data, sortData);
    }

    if(filterData) {
      response = filterUsers(data, filterData);
    }

    if(filterData && sortData) {
      const filteredData = filterUsers(data, filterData);
      response = sortUsers(filteredData, sortData);
    }

    if(!filterData && !sortData) {
      response = data;
    }

    res.status(200).json({
      users: response?.slice(+itemsPerPage * +page, +itemsPerPage * (+page + 1)),
      usersCount: response ? response.length : data.length 
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersLocations: RequestHandler = async (req, res, next) => {
  try {
    const data = await UserModel.find().exec();
    const countries = data.map(user => user.location ? user.location : 'Unknown');
    const uniqueValues = [...new Set(countries)];
    res.status(200).json(uniqueValues);
  } catch (error) {
    next(error);
  }
};

interface UpdateUserBody {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  password?: string,
  userPhotoUrl?: string,
  role: string,
  location?: string,
  organization?: string,
  position?: string
}

export const updateUser: RequestHandler<unknown, unknown, UpdateUserBody, unknown> = async (req, res, next) => {
  const userToUpdate = req.body;

  try {
    if(!userToUpdate.firstName || !userToUpdate.lastName) {
      throw(createHttpError(401, 'User must have first name and last name'));
    }

    if(!userToUpdate.email) {
      throw(createHttpError(401, 'User must have an email'));
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userToUpdate._id, userToUpdate);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const { id, page, itemsPerPage } = req.query;
  
  try {
    if(!mongoose.isValidObjectId(id)) {
      throw(createHttpError(400, 'Invalid user id'));
    }

    await UserModel.findByIdAndDelete(id);
    const data = await UserModel.find().exec();

    res.status(200).json({
      users: data?.slice(+itemsPerPage! * +page!, +itemsPerPage! * (+page! + 1)),
      usersCount: data.length
    });
  } catch (error) {
    next(error);
  }
}
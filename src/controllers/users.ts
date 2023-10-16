import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import UserModel from '../models/user';
import bcrypt from 'bcrypt';
import { filterUsers, setQueryParams, sortUsers } from '../util/helpers';
import { CreateUserBody, GetAllUsersQuery, LoginBody, SignUpBody, UpdateUserBody } from '../types/users';


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
      throw(createHttpError(400, 'Incorrect password'));
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
  const { role } = req.query;
  
  try {
    if(!role) {
      throw(createHttpError(400, 'Provide a role'));
    }

    const users = await UserModel.find({ role }).sort({ createdAt: -1 }).exec();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers: RequestHandler<unknown, unknown, unknown, GetAllUsersQuery> = async (req, res, next) => {
  const { page, itemsPerPage, filterData, sortData } = req.query;

  const order = !sortData || sortData.order === 'desc' ? -1 : 1;
  const sortIndicator = sortData ? sortData.indicator : 'createdAt';
  const query = filterData ? setQueryParams(filterData) : {};

  try {
    const data = await UserModel
      .find(query)
      .sort({ [sortIndicator]: order })
      .skip(+page * +itemsPerPage)
      .limit(+itemsPerPage)
      .exec();

    const count = await UserModel.countDocuments(query);

    res.status(200).json({
      users: data,
      usersCount: count
    })
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

export const updateUser: RequestHandler<unknown, unknown, UpdateUserBody, unknown> = async (req, res, next) => {
  const userToUpdate = req.body;

  try {
    if(!userToUpdate.firstName || !userToUpdate.lastName) {
      throw(createHttpError(401, 'User must have first name and last name'));
    }

    if(!userToUpdate.email) {
      throw(createHttpError(401, 'User must have an email'));
    }

    await UserModel.findByIdAndUpdate(userToUpdate._id, userToUpdate);
    const updatedUser = await UserModel.findById(userToUpdate._id);

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updatePassword: RequestHandler = async (req, res, next) => {
  const { id, newPassword, currPassword } = req.body;
  try {
    const user = await UserModel.findById(id).exec();
    const isPasswordMatch = await bcrypt.compare(currPassword, user!.password);

    if(!user) {
      throw(createHttpError(401, 'User does not exist'));
    }
    
    if(isPasswordMatch) {
      const newPasswordHashed = await bcrypt.hash(newPassword, 10);
      await UserModel.findByIdAndUpdate(id, { ...user.toObject(), password: newPasswordHashed });
      const updatedUser = await UserModel.findById(id);
      res.status(200).json(updatedUser);
    } else {
      throw(createHttpError(401, 'Passwords do not match'));
    }
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
    const data = await UserModel.find().sort({ createdAt: -1 }).exec();

    res.status(200).json({
      users: data?.slice(+itemsPerPage! * +page!, +itemsPerPage! * (+page! + 1)),
      usersCount: data.length
    });
  } catch (error) {
    next(error);
  }
}
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import UserModel from '../models/user';
import bcrypt from 'bcrypt';


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
  role: string,
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
    if(!firstName || !lastName || !email || !password || !role) {
      throw(createHttpError('Parameters missing'));
    }

    const existingUser = await UserModel.findOne({ email: email }).exec();

    if(existingUser) {
      throw(createHttpError(409, 'User already exists. Provide another email address or log in instead.'));
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email, 
      password: passwordHashed,
      role, 
      userPhotoUrl, 
      location, 
      organization, 
      position
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

    const passwordMatch = await bcrypt.compare(password, password);

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
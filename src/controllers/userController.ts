import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import getErrorMessage from '../utils/errors.util';

export const register = async (req : Request, res : Response) => {
  try {
    const user = req.body;
    const { username, email, password } = user;

    const isEmailAllReadyExist = await User.findOne({
      email,
    });

    if (isEmailAllReadyExist) {
      res.status(400).json({
        status: 400,
        message: 'Email all ready in use',
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: passwordHash,
    });

    res.status(200).json({
      status: 201,
      success: true,
      message: ' User created Successfully',
    });
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.log(errorMessage);

    res.status(400).json({
      status: 400,
      message: errorMessage,
    });
  }
};

export const login = async (req : Request, res : Response) => {
  try {
    const user = req.body;
    const { email, password } = user;

    const isUserExist = await User.findOne({
      email,
    });

    if (!isUserExist) {
      res.status(404).json({
        status: 404,
        success: false,
        message: 'User not found',
      });
      return;
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      isUserExist?.password,
    );

    if (!isPasswordMatched) {
      res.status(400).json({
        status: 400,
        success: false,
        message: 'wrong password',
      });
      return;
    }

    const token = jwt.sign(
      { _id: isUserExist?._id, email: isUserExist?.email },
      process.env.SECRET_KEY as string,
      {
        expiresIn: '1d',
      },
    );

    res.status(200).json({
      status: 200,
      success: true,
      message: 'login success',
      token,
    });
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.log(errorMessage);

    res.status(400).json({
      status: 400,
      message: errorMessage,
    });
  }
};

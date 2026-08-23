import type { Request, Response } from "express";

import { 
  changeEmail,
  changePassword, 
  getCurrentUser, 
  loginUser, 
  registerUser } from "./auth.service.js";

import { StatusCodes } from "http-status-codes";

import { 
  ChangeEmailInput,
  ChangePasswordInput, 
  LoginInput, 
  RegisterInput } from "./auth.validation.js";
import prisma from "../../config/database.js";

// register 
export const registerController =  async (req: Request, res: Response) => {
   

    const body = res.locals.body as RegisterInput; //typescript type controller

    const user = await registerUser(body);

    res.status(201).json({
      success: true,
      data: user,
      message: "User registered successfully",
    });
  };


  //login
  export const loginController =  async (req: Request, res: Response) => {
    
    const body = res.locals.body as LoginInput;
    const result = await loginUser(body);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: result,
    });
  };


  export const changePasswordController = async (req: Request, res: Response) => {

  const userId = req.user!.userId;
  const body = res.locals.body as ChangePasswordInput;

  await changePassword(userId, body);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Password changed successfully. You have been signed out of all sessions.",
  });
};

  export const changeEmailController = async (req: Request, res: Response) => {

  const userId = req.user!.userId;
  const body = res.locals.body as ChangeEmailInput;

  await changeEmail(userId, body);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Email changed successfully. Logging out is required for security",
  });
};



  //get current user
  export const getMeController = 
  async (req: Request, res: Response) => {
    // req.user is attached by authenticate middleware
    const user = await getCurrentUser(req.user!.userId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: user,
    });
  };
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  addFavorite,
  removeFavorite,
  getMyFavorites,
} from "./favorite.service.js";

export const addFavoriteController = async (req: Request, res: Response) => {
  const clientId = req.user!.userId;
  const { propertyId } = res.locals.params;

  const favorite = await addFavorite(clientId, propertyId);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Property added to favorites",
    data: favorite,
  });
};

export const removeFavoriteController = async (req: Request, res: Response) => {
  const clientId = req.user!.userId;
  const { propertyId } = res.locals.params;

  await removeFavorite(clientId, propertyId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Property removed from favorites",
  });
};

export const getMyFavoritesController = async (req: Request, res: Response) => {
  const clientId = req.user!.userId;

  const favorites = await getMyFavorites(clientId);

  res.status(StatusCodes.OK).json({
    success: true,
    count: favorites.length,
    data: favorites,
  });
};
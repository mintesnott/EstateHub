import type { Request, Response } from "express";
import { createProperty, deleteProperty, getMyProperties, getProperties, getPropertyById, updateProperty } from "./property.service.js";
import { StatusCodes } from "http-status-codes";
import { 
  CreatePropertyInput, 
  GetPropertiesQueryInput, 
  UpdatePropertyInput
} from "./property.validation.js";

export const createPropertyController = async(
  req: Request,
  res: Response,
) => {
  const body = res.locals.body as CreatePropertyInput;

  const property = await createProperty(req.user!.userId, body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Property created successfully",
    data: property,
  })

}

export const getPropertiesController = async (req: Request, res: Response) => {

  const query = res.locals.query as GetPropertiesQueryInput;

  const result = await getProperties(query); 

  res.status(StatusCodes.OK).json({
    success: true,
    data: result.properties,
    pagination: result.pagination,
  });
}

//get /api/v1/properties/:id
export const getPropertyByIdController = async(
  req:Request,
  res: Response,
) => {

  const { id } = res.locals.params as { id: string };

  const property = await getPropertyById(id);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: property,
  });
};

// PATCH /api/v1/properties/:id
export const updatePropertyController = async (
  req: Request,
  res: Response,
) => {

  const { id } = res.locals.params as { id: string };

  const userId = req.user!.userId;
  const userRole = req.user!.role;

  const body = res.locals.body as UpdatePropertyInput;

  const updatedProperty = await updateProperty(id, userId, userRole, body);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Property updated successfully",
    data: updatedProperty,
  });
}

// delete --> /api/v1/properties/:id
export const deletePropertyController = async (req: Request, res: Response) => {
  const { id } = res.locals.params as { id: string };
  const userRole = req.user!.role;
  const userId = req.user!.userId;

  await deleteProperty(id, userId, userRole);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Property deleted successfully",
  });
};

export const getMyPropertiesController = async (req: Request, res: Response) => {
  const query = res.locals.query as GetPropertiesQueryInput;
  const result = await getMyProperties(req.user!.userId, query);

  res.status(StatusCodes.OK).json({
    success: true,
    data: result.properties,
    pagination: result.pagination,
  });
};
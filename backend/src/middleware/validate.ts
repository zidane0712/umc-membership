// [DEPENDENCIES]
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// [FUNCTION]
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        errors: error.details.map(
          (err: Joi.ValidationErrorItem) => err.message
        ),
      });
    }
    next();
  };
};

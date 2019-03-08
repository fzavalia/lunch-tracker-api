import { Request } from "express";
import { isNullOrUndefined } from "util";

export enum Type {
  String,
  Number,
  Email
}

interface Schema {
  [prop: string]: {
    type: Type,
    required?: boolean,
  }
}

class ExpressRequestBodyValidator {

  constructor(private request: Request, private schema: Schema) { }

  validate = () => new Promise((resolve, reject) => {

    const errors = this.getValidationErrors();

    if (errors.length > 0) reject(errors);
    
    else resolve();
  });

  private getValidationErrors = () => Object.keys(this.schema).reduce((errors: string[], prop) => {

    const error = this.validateProp(prop)

    return error ? errors.concat(error) : errors

  }, []);

  private validateProp = (prop: string) => {

    const propValidations = this.schema[prop];

    const propToValidate = this.request.body[prop];

    if (propValidations.required && isNullOrUndefined(propToValidate)) {
      return `${prop} is required`;
    }

    if (!isNullOrUndefined(propToValidate)) {

      switch (propValidations.type) {
        case Type.Number:
          if (isNaN(propToValidate)) {
            return `${prop} has to be numeric`;
          }
          break;
        case Type.String:
          if (typeof propToValidate !== 'string') {
            return `${prop} has to be a string`;
          }
          if (propToValidate.length === 0) {
            return `${prop} cannot be an empty string`;
          }
          break;
        case Type.Email:
          if (!this.isEmail(propToValidate)) {
            return `${prop} has to be an email`;
          }
          break;
      }
    }

    return null
  }

  private isEmail = (email: string) => {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(email).toLowerCase());
  };
}

export default ExpressRequestBodyValidator
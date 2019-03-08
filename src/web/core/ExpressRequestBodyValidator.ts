import { Request } from "express";
import { isNullOrUndefined } from "util";
import moment from 'moment'

export enum ExpressRequestBodyValidatorTypes {
  String,
  Number,
  Email,
  Date
}

export interface Schema {
  [prop: string]: {
    type: ExpressRequestBodyValidatorTypes,
    required?: boolean,
    oneOf?: any[]
  }
}

class ExpressRequestBodyValidator {

  constructor(private request: Request, private schema: Schema) { }

  validate = () => this.getValidationErrors();

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
        case ExpressRequestBodyValidatorTypes.Number:
          if (isNaN(propToValidate)) {
            return `${prop} has to be numeric`;
          }
          break;
        case ExpressRequestBodyValidatorTypes.String:
          if (typeof propToValidate !== 'string') {
            return `${prop} has to be a string`;
          }
          if (propToValidate.length === 0) {
            return `${prop} cannot be an empty string`;
          }
          break;
        case ExpressRequestBodyValidatorTypes.Email:
          if (!this.isEmail(propToValidate)) {
            return `${prop} has to be an email`;
          }
          break;
        case ExpressRequestBodyValidatorTypes.Date:
          if (!moment(propToValidate, moment.ISO_8601, true).isValid()) {
            return `${prop} has to be an ISO_8601 date`;
          }
          break;
      }

      if (propValidations.oneOf && !propValidations.oneOf.includes(propToValidate)) {
        return `${prop} has to be one of: ${propValidations.oneOf.join(', ')}`;
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
import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import { getRepository } from "typeorm";

@ValidatorConstraint()
export class UniqueFieldValidator implements ValidatorConstraintInterface {


	/**
	 * Return true if the value does not exist in the database
	 *
	 * @param value
	 * @param validationArguments
	 */
	async validate( value: string, validationArguments?: ValidationArguments ): Promise<boolean>  {
		const [uniqueField, tableClass] = validationArguments.constraints;

		if (!value) {
			return false;
		}

		const findOneSearch = {};
		findOneSearch[uniqueField] = value;

		const objectExists = await getRepository(tableClass, process.env.DB_CONNECTION_NAME).findOne(findOneSearch);

		return objectExists === undefined;
	}

	defaultMessage( validationArguments?: ValidationArguments ): string {
		const [uniqueField, tableClass] = validationArguments.constraints;

		return `Please tell developer to enter a valid error message for UniqueFieldValidator [uniqueField] => '${uniqueField}' and [tableClass] => '${tableClass}'`;
	}


}

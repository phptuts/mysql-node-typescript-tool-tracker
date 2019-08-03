import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import { getRepository } from "typeorm";
import { injectable } from "inversify";

@ValidatorConstraint()
export class UniqueFieldValidator implements ValidatorConstraintInterface {



	async validate( value: string, validationArguments?: ValidationArguments ): Promise<boolean>  {
		const [uniqueField, tableClass] = validationArguments.constraints;

		console.log(uniqueField, tableClass, value);
		console.log(value);
		if (!value) {
			return false;
		}

		const findOneSearch = {};
		findOneSearch[uniqueField] = value;

		const objectExists = await getRepository(tableClass).findOne(findOneSearch);

		console.log(objectExists, 'does object exist');

		return objectExists === undefined;
	}

	defaultMessage( validationArguments?: ValidationArguments ): string {
		return "";
	}


}

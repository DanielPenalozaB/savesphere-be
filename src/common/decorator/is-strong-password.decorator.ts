import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'isStrongPassword',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: {
				message:
					'Password must meet the following criteria:\n' +
					'- At least 8 characters long\n' +
					'- At least one uppercase letter\n' +
					'- At least one lowercase letter\n' +
					'- At least one number\n' +
					'- At least one special character (!@#$%^&*(),.?":{}[]|<>)',
				...validationOptions,
			},
			validator: {
				validate(value: any, args: ValidationArguments) {
					const password = value as string;

					const hasMinLength = password.length >= 8;
					const hasUpperCase = /[A-Z]/.test(password);
					const hasLowerCase = /[a-z]/.test(password);
					const hasNumbers = /\d/.test(password);
					const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

					return (
						hasMinLength &&
						hasUpperCase &&
						hasLowerCase &&
						hasNumbers &&
						hasSpecialChars
					);
				},
			},
		});
	};
}

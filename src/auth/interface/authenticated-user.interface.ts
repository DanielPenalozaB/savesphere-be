export interface IAuthenticatedUser {
	id: string;
	name: string;
	email: string;
	twoFactorSecret: string;
	twoFactorAuthenticated: boolean;
	twoFactorSetupInProgress: boolean;
}

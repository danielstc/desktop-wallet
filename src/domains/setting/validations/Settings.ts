import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";

export const settings = (t: any, env: Environment) => ({
	name: (id: string) => ({
		required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
			field: t("SETTINGS.GENERAL.PERSONAL.NAME"),
		}).toString(),
		validate: {
			maxLength: (name: string) =>
				name.trim().length > 42
					? t("COMMON.VALIDATION.MAX_LENGTH", {
							field: t("SETTINGS.GENERAL.PERSONAL.NAME"),
							maxLength: 42,
					  })
					: true,
			unique: (name: string) => {
				if (
					env
						.profiles()
						.values()
						.some(
							(profile: Profile) =>
								profile.id() !== id && profile.name().toLowerCase() === name.trim().toLowerCase(),
						)
				) {
					return t("PROFILE.PAGE_CREATE_PROFILE.VALIDATION.NAME_EXISTS");
				}

				return true;
			},
		},
	}),
});

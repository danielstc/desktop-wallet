export const pluginData = {
	name: "ARK Explorer",
	author: "ARK Ecosystem",
	about:
		"Use the ARK Explorer to get full visibility of critical data from the ARK network. Data such as the latest blocks, wallet addresses and transactions. Plus monitor delegate status, their position and more.",
	permissions: ["Embedded Webpages", "API Requests", "Access to Profiles"],
	screenshots: [1, 2, 3],
	category: "Utility",
	url: "github.com",
	averageRating: "4.6",
	version: "1.3.8",
	size: "4.2",
};

export const paths = {
	featured: "/?path=/story/domains-plugin-pages-plugins-category--featured",
	topRated: "/?path=/story/domains-plugin-pages-plugins-category--top-rated",
};

export const plugins = [
	{
		id: 0,
		name: "ARK Explorer",
		author: "ARK Ecosystem",
		description: "This is a description",
		category: "Utility",
		rating: 4.6,
		version: "1.3.8",
		isOfficial: true,
		isGrant: true,
	},
	{
		id: 1,
		name: "Animal Avatars",
		author: "Breno Polanski",
		description: "This is a description",
		category: "Utility",
		rating: 4.6,
		version: "1.3.8",
	},
	{
		id: 2,
		name: "ChangeNOW Plugin",
		author: "ChangeNOW",
		description: "This is a description",
		category: "Other",
		rating: 4.8,
		version: "1.3.8",
	},
	{
		id: 4,
		name: "Bold Ninja",
		author: "Delegate Fun",
		description: "This is a description",
		category: "Game",
		rating: 4.9,
		version: "2.0.0",
		isGrant: true,
	},
];

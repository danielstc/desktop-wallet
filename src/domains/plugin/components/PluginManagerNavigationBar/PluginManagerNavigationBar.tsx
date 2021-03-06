import { LayoutControls } from "app/components/LayoutControls";
import { usePluginManagerContext } from "plugins";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { defaultStyle } from "./styles";

type PluginManagerNavigationBar = {
	onSelectGridView?: any;
	onSelectListView?: any;
	selectedViewType?: string;
	menu: any[];
	selected: any;
	onChange?: any;
	installedPluginsCount?: number;
};

const NavWrapper = styled.nav`
	${defaultStyle}
`;

export const PluginManagerNavigationBar = ({
	selected,
	onChange,
	menu,
	onSelectGridView,
	onSelectListView,
	selectedViewType,
	installedPluginsCount,
}: PluginManagerNavigationBar) => {
	const { t } = useTranslation();
	const { allPlugins } = usePluginManagerContext();
	const countsByCategory = menu.reduce(
		(acc, curr) => ({ ...acc, [curr.name]: allPlugins.filter((pkg) => pkg.hasCategory(curr.name)).length }),
		{},
	);

	return (
		<NavWrapper
			data-testid="PluginManagerNavigationBar"
			className="sticky top-21 bg-theme-secondary-100 dark:bg-black"
		>
			<div className="container flex justify-between items-center px-14 mx-auto">
				<div>
					<ul className="flex h-18">
						{menu &&
							menu.map((menuItem: any, index: number) => (
								<li key={index} className="flex">
									<button
										data-testid={`PluginManagerNavigationBar__${menuItem.name}`}
										onClick={() => onChange(menuItem.name)}
										title={menuItem.title}
										className={`PluginManagerNavigationBar__item px-1 focus:outline-none lex items-center font-semibold text-md text-theme-secondary-text hover:text-theme-text transition-colors duration-200 cursor-pointer ${
											selected === menuItem.name ? "active" : ""
										}`}
									>
										<span>{menuItem.title}</span>
										{
											<span className="ml-1 text-theme-secondary-500 dark:text-theme-secondary-700">
												{menuItem.name === "home"
													? allPlugins.length
													: countsByCategory[menuItem.name]}
											</span>
										}
									</button>

									{index < menu.length - 1 && (
										<div className="my-auto mx-6 w-px h-4 border-r PluginManagerNavigationBar__menu-divider border-theme-secondary-300 dark:border-theme-secondary-800" />
									)}
								</li>
							))}
					</ul>
				</div>

				<div className="flex h-18">
					<button
						data-testid="PluginManagerNavigationBar__my-plugins"
						onClick={() => onChange("my-plugins")}
						title="My Plugins"
						className={`PluginManagerNavigationBar__item px-1 focus:outline-none flex items-center font-semibold text-md text-theme-secondary-text hover:text-theme-text transition-colors duration-200 cursor-pointer ${
							selected === "my-plugins" ? "active" : ""
						}`}
					>
						<span>{t("PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.MY_PLUGINS")}</span>
						{installedPluginsCount ? (
							<span
								data-testid="PluginManagerNavigationBar__my-plugins__count"
								className="ml-1 text-theme-secondary-500 dark:text-theme-secondary-700"
							>
								{installedPluginsCount}
							</span>
						) : null}
					</button>

					<div className="my-auto mx-8 w-px h-10 border-r border-theme-secondary-300 dark:border-theme-secondary-800" />

					<LayoutControls
						data-testid="PluginManagerControls"
						onSelectGridView={onSelectGridView}
						onSelectListView={onSelectListView}
						selectedViewType={selectedViewType}
					/>
				</div>
			</div>
		</NavWrapper>
	);
};

PluginManagerNavigationBar.defaultProps = {
	selected: "home",
	menu: [
		{
			title: "Home",
			name: "home",
		},
		{
			title: "Gaming",
			name: "gaming",
		},
		{
			title: "Utility",
			name: "utility",
		},
		{
			title: "Theme",
			name: "theme",
		},
		{
			title: "Other",
			name: "other",
		},
	],
	selectedViewType: "grid",
};

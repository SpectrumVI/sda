import { useEffect, useState } from "react";
import { HeadContent, Link, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/Footer.tsx
function Footer() {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ jsxs("footer", {
		className: "mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left",
			children: [/* @__PURE__ */ jsxs("p", {
				className: "m-0 text-sm",
				children: [
					"© ",
					year,
					" Your name here. All rights reserved."
				]
			}), /* @__PURE__ */ jsx("p", {
				className: "island-kicker m-0",
				children: "Built with TanStack Start"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-4 flex justify-center gap-4",
			children: [/* @__PURE__ */ jsxs("a", {
				href: "https://x.com/tan_stack",
				target: "_blank",
				rel: "noreferrer",
				className: "rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]",
				children: [/* @__PURE__ */ jsx("span", {
					className: "sr-only",
					children: "Follow TanStack on X"
				}), /* @__PURE__ */ jsx("svg", {
					viewBox: "0 0 16 16",
					"aria-hidden": "true",
					width: "32",
					height: "32",
					children: /* @__PURE__ */ jsx("path", {
						fill: "currentColor",
						d: "M12.6 1h2.2L10 6.48 15.64 15h-4.41L7.78 9.82 3.23 15H1l5.14-5.84L.72 1h4.52l3.12 4.73L12.6 1zm-.77 12.67h1.22L4.57 2.26H3.26l8.57 11.41z"
					})
				})]
			}), /* @__PURE__ */ jsxs("a", {
				href: "https://github.com/TanStack",
				target: "_blank",
				rel: "noreferrer",
				className: "rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]",
				children: [/* @__PURE__ */ jsx("span", {
					className: "sr-only",
					children: "Go to TanStack GitHub"
				}), /* @__PURE__ */ jsx("svg", {
					viewBox: "0 0 16 16",
					"aria-hidden": "true",
					width: "32",
					height: "32",
					children: /* @__PURE__ */ jsx("path", {
						fill: "currentColor",
						d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
					})
				})]
			})]
		})]
	});
}
//#endregion
//#region src/components/ThemeToggle.tsx
function getInitialMode() {
	if (typeof window === "undefined") return "auto";
	const stored = window.localStorage.getItem("theme");
	if (stored === "light" || stored === "dark" || stored === "auto") return stored;
	return "auto";
}
function applyThemeMode(mode) {
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const resolved = mode === "auto" ? prefersDark ? "dark" : "light" : mode;
	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(resolved);
	if (mode === "auto") document.documentElement.removeAttribute("data-theme");
	else document.documentElement.setAttribute("data-theme", mode);
	document.documentElement.style.colorScheme = resolved;
}
function ThemeToggle() {
	const [mode, setMode] = useState("auto");
	useEffect(() => {
		const initialMode = getInitialMode();
		setMode(initialMode);
		applyThemeMode(initialMode);
	}, []);
	useEffect(() => {
		if (mode !== "auto") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyThemeMode("auto");
		media.addEventListener("change", onChange);
		return () => {
			media.removeEventListener("change", onChange);
		};
	}, [mode]);
	function toggleMode() {
		const nextMode = mode === "light" ? "dark" : mode === "dark" ? "auto" : "light";
		setMode(nextMode);
		applyThemeMode(nextMode);
		window.localStorage.setItem("theme", nextMode);
	}
	const label = mode === "auto" ? "Theme mode: auto (system). Click to switch to light mode." : `Theme mode: ${mode}. Click to switch mode.`;
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick: toggleMode,
		"aria-label": label,
		title: label,
		className: "rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5",
		children: mode === "auto" ? "Auto" : mode === "dark" ? "Dark" : "Light"
	});
}
//#endregion
//#region src/components/Header.tsx
function Header() {
	return /* @__PURE__ */ jsx("header", {
		className: "sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg",
		children: /* @__PURE__ */ jsxs("nav", {
			className: "page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4",
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "m-0 flex-shrink-0 text-base font-semibold tracking-tight",
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/",
						className: "inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2",
						children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" }), "TanStack Start"]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-none sm:w-auto sm:flex-nowrap sm:pb-0",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "nav-link",
							activeProps: { className: "nav-link is-active" },
							children: "Home"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/about",
							className: "nav-link",
							activeProps: { className: "nav-link is-active" },
							children: "About"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "https://tanstack.com/start/latest/docs/framework/react/overview",
							className: "nav-link",
							target: "_blank",
							rel: "noreferrer",
							children: "Docs"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ml-auto flex items-center gap-1.5 sm:gap-2",
					children: [
						/* @__PURE__ */ jsxs("a", {
							href: "https://x.com/tan_stack",
							target: "_blank",
							rel: "noreferrer",
							className: "hidden rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] sm:block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "sr-only",
								children: "Follow TanStack on X"
							}), /* @__PURE__ */ jsx("svg", {
								viewBox: "0 0 16 16",
								"aria-hidden": "true",
								width: "24",
								height: "24",
								children: /* @__PURE__ */ jsx("path", {
									fill: "currentColor",
									d: "M12.6 1h2.2L10 6.48 15.64 15h-4.41L7.78 9.82 3.23 15H1l5.14-5.84L.72 1h4.52l3.12 4.73L12.6 1zm-.77 12.67h1.22L4.57 2.26H3.26l8.57 11.41z"
								})
							})]
						}),
						/* @__PURE__ */ jsxs("a", {
							href: "https://github.com/TanStack",
							target: "_blank",
							rel: "noreferrer",
							className: "hidden rounded-xl p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)] sm:block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "sr-only",
								children: "Go to TanStack GitHub"
							}), /* @__PURE__ */ jsx("svg", {
								viewBox: "0 0 16 16",
								"aria-hidden": "true",
								width: "24",
								height: "24",
								children: /* @__PURE__ */ jsx("path", {
									fill: "currentColor",
									d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
								})
							})]
						}),
						/* @__PURE__ */ jsx(ThemeToggle, {})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-BAwSkaz7.css";
//#endregion
//#region src/routes/__root.tsx
var THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;
var Route$2 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "TanStack Start Starter" }
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootDocument
});
function RootDocument({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsxs("head", { children: [/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: THEME_INIT_SCRIPT } }), /* @__PURE__ */ jsx(HeadContent, {})] }), /* @__PURE__ */ jsxs("body", {
			className: "font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]",
			children: [
				/* @__PURE__ */ jsx(Header, {}),
				children,
				/* @__PURE__ */ jsx(Footer, {}),
				/* @__PURE__ */ jsx(Scripts, {})
			]
		})]
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$1 = () => import("./routes-DPNfHhvM.js");
var Route$1 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Корочки.есть — обучение для специалистов" }] })
});
//#endregion
//#region src/routes/about.tsx
var $$splitComponentImporter = () => import("./about-D9herq5f.js");
var Route = createFileRoute("/about")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$2
	}),
	AboutRoute: Route.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$2
	})
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0
	});
}
//#endregion
export { getRouter };

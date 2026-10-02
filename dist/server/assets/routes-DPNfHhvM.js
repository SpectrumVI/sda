import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/Carousel.tsx
var SLIDE_ART = [
	"radial-gradient(circle at 24% 18%, rgba(79,184,178,0.55), transparent 60%), linear-gradient(135deg, #2f6a4a, #4fb8b2)",
	"radial-gradient(circle at 78% 24%, rgba(255,255,255,0.45), transparent 58%), linear-gradient(135deg, #328f97, #7ed3bf)",
	"radial-gradient(circle at 30% 76%, rgba(23,58,64,0.4), transparent 62%), linear-gradient(135deg, #4fb8b2, #173a40)",
	"radial-gradient(circle at 70% 30%, rgba(126,211,191,0.6), transparent 60%), linear-gradient(135deg, #173a40, #2f6a4a)"
];
var ARROW_CLASS = "flex h-9 w-9 items-center justify-center rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] text-lg leading-none font-bold text-[var(--sea-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--link-bg-hover)]";
function Carousel({ slides, label = "Карусель", autoPlay = true, intervalMs = 5e3, className = "" }) {
	const count = slides.length;
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const pointerStartX = useRef(null);
	const safeIndex = count > 0 ? (index % count + count) % count : 0;
	const goTo = useCallback((next) => {
		if (count === 0) return;
		setIndex((next % count + count) % count);
	}, [count]);
	const goNext = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex]);
	const goPrev = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex]);
	useEffect(() => {
		if (!autoPlay || paused || count <= 1 || typeof window === "undefined") return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = window.setInterval(() => {
			if (document.hidden) return;
			setIndex((current) => (current + 1) % count);
		}, intervalMs);
		return () => window.clearInterval(timer);
	}, [
		autoPlay,
		paused,
		count,
		intervalMs
	]);
	function handleKeyDown(event) {
		if (event.key === "ArrowRight") {
			event.preventDefault();
			goNext();
		} else if (event.key === "ArrowLeft") {
			event.preventDefault();
			goPrev();
		}
	}
	function handlePointerDown(event) {
		pointerStartX.current = event.clientX;
	}
	function handlePointerUp(event) {
		const startX = pointerStartX.current;
		pointerStartX.current = null;
		if (startX === null) return;
		const deltaX = event.clientX - startX;
		if (Math.abs(deltaX) < 40) return;
		if (deltaX < 0) goNext();
		else goPrev();
	}
	if (count === 0) return null;
	return /* @__PURE__ */ jsxs("section", {
		"aria-roledescription": "карусель",
		"aria-label": label,
		className: `island-shell relative overflow-hidden rounded-[1.75rem] ${className}`.trim(),
		onKeyDown: handleKeyDown,
		onMouseEnter: () => setPaused(true),
		onMouseLeave: () => setPaused(false),
		onFocus: () => setPaused(true),
		onBlur: () => setPaused(false),
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "sr-only",
				"aria-live": "polite",
				children: `Слайд ${safeIndex + 1} из ${count}: ${slides[safeIndex].title}`
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "flex transition-transform duration-500 ease-out motion-reduce:transition-none",
					style: { transform: `translate3d(-${safeIndex * 100}%, 0, 0)` },
					onPointerDown: handlePointerDown,
					onPointerUp: handlePointerUp,
					onPointerCancel: handlePointerUp,
					children: slides.map((slide, slideIndex) => {
						const art = SLIDE_ART[slideIndex % SLIDE_ART.length];
						return /* @__PURE__ */ jsx("article", {
							"aria-hidden": slideIndex !== safeIndex,
							className: "w-full shrink-0 px-5 py-7 sm:px-9 sm:py-9",
							children: /* @__PURE__ */ jsxs("div", {
								className: "grid items-center gap-6 sm:grid-cols-[1.15fr_1fr]",
								children: [/* @__PURE__ */ jsxs("div", { children: [
									slide.badge ? /* @__PURE__ */ jsx("p", {
										className: "island-kicker mb-3",
										children: slide.badge
									}) : null,
									/* @__PURE__ */ jsx("h3", {
										className: "display-title m-0 mb-3 text-2xl leading-tight font-bold text-[var(--sea-ink)] sm:text-4xl",
										children: slide.title
									}),
									/* @__PURE__ */ jsx("p", {
										className: "m-0 max-w-xl text-sm leading-relaxed text-[var(--sea-ink-soft)] sm:text-base",
										children: slide.description
									}),
									slide.href ? /* @__PURE__ */ jsx("a", {
										href: slide.href,
										className: "mt-5 inline-flex rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-4 py-2 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]",
										children: slide.linkLabel ?? "Подробнее"
									}) : null
								] }), /* @__PURE__ */ jsx("div", {
									className: "relative h-40 overflow-hidden rounded-[1.25rem] border border-[var(--line)] sm:h-56",
									children: slide.image ? /* @__PURE__ */ jsx("img", {
										src: slide.image,
										alt: slide.imageAlt ?? slide.title,
										className: "h-full w-full object-cover",
										loading: "lazy"
									}) : /* @__PURE__ */ jsx("div", {
										className: "h-full w-full",
										style: { backgroundImage: art }
									})
								})]
							})
						}, slide.id);
					})
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-4 border-t border-[var(--line)] px-5 py-4 sm:px-9",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-2",
					children: slides.map((slide, slideIndex) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => goTo(slideIndex),
						"aria-label": `Слайд ${slideIndex + 1} из ${count}`,
						"aria-current": slideIndex === safeIndex,
						className: `h-2.5 rounded-full border border-[var(--chip-line)] transition-all ${slideIndex === safeIndex ? "w-7 bg-[var(--lagoon)]" : "w-2.5 bg-[var(--chip-bg)] hover:bg-[var(--link-bg-hover)]"}`
					}, slide.id))
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: goPrev,
						"aria-label": "Предыдущий слайд",
						className: ARROW_CLASS,
						children: "‹"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: goNext,
						"aria-label": "Следующий слайд",
						className: ARROW_CLASS,
						children: "›"
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/courses.ts
var COURSES = [
	{
		title: "Основы алгоритмизации и программирования",
		description: "Научитесь писать чистый и эффективный код с нуля."
	},
	{
		title: "Основы веб-дизайна",
		description: "Создавайте современные и удобные пользовательские интерфейсы."
	},
	{
		title: "Основы проектирования баз данных",
		description: "Освойте принципы построения надёжных хранилищ данных."
	}
];
//#endregion
//#region src/components/CourseForm.tsx
var EMPTY_VALUES = {
	name: "",
	email: "",
	phone: "",
	course: "",
	comment: "",
	consent: false
};
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var PHONE_PATTERN = /^\+?[0-9][\d\s()-]{8,18}$/;
var FIELD_IDS = {
	name: "enroll-name",
	email: "enroll-email",
	phone: "enroll-phone",
	course: "enroll-course",
	comment: "enroll-comment",
	consent: "enroll-consent"
};
function validate(values) {
	const errors = {};
	if (values.name.trim().length < 2) errors.name = "Укажите имя и фамилию";
	if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Введите корректный e-mail";
	if (!PHONE_PATTERN.test(values.phone.trim())) errors.phone = "Формат: +7 (999) 123-45-67";
	if (!values.course) errors.course = "Выберите курс";
	if (!values.consent) errors.consent = "Нужно согласие на обработку данных";
	return errors;
}
function CourseForm() {
	const [values, setValues] = useState(EMPTY_VALUES);
	const [errors, setErrors] = useState({});
	const [submission, setSubmission] = useState(null);
	function update(key, value) {
		setValues((current) => ({
			...current,
			[key]: value
		}));
		setErrors((current) => ({
			...current,
			[key]: void 0
		}));
	}
	function handleSubmit(event) {
		event.preventDefault();
		const nextErrors = validate(values);
		setErrors(nextErrors);
		const firstError = Object.keys(nextErrors)[0];
		if (firstError) {
			document.getElementById(FIELD_IDS[firstError])?.focus();
			return;
		}
		setSubmission({
			name: values.name.trim(),
			email: values.email.trim(),
			phone: values.phone.trim(),
			course: values.course,
			comment: values.comment.trim()
		});
		setValues(EMPTY_VALUES);
	}
	function reset() {
		setSubmission(null);
		setErrors({});
	}
	const errorList = Object.keys(errors).filter((key) => errors[key]);
	const hasErrors = errorList.length > 0;
	if (submission) return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-[rgba(47,106,74,0.3)] bg-[rgba(47,106,74,0.1)] p-5",
		children: [
			/* @__PURE__ */ jsx("h3", {
				className: "display-title mb-2 text-xl font-bold text-[var(--sea-ink)]",
				children: "Заявка принята"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "m-0 text-sm leading-relaxed text-[var(--sea-ink-soft)]",
				children: [
					submission.name,
					", вы записаны на курс «",
					submission.course,
					"». Мы свяжемся с вами по адресу ",
					submission.email,
					" или по телефону",
					" ",
					submission.phone,
					"."
				]
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: reset,
				className: "demo-button mt-4",
				children: "Записаться ещё"
			})
		]
	});
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: handleSubmit,
		noValidate: true,
		className: "flex flex-col gap-4",
		children: [
			hasErrors ? /* @__PURE__ */ jsxs("p", {
				role: "alert",
				className: "demo-alert m-0 text-sm",
				children: [
					"Проверьте заполнение формы: ошибка в",
					" ",
					errorList.length === 1 ? "одном поле" : "нескольких полях",
					"."
				]
			}) : null,
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("label", {
					htmlFor: FIELD_IDS.name,
					className: "mb-1.5 block text-sm font-semibold text-[var(--sea-ink)]",
					children: "Имя и фамилия"
				}),
				/* @__PURE__ */ jsx("input", {
					id: FIELD_IDS.name,
					name: "name",
					type: "text",
					autoComplete: "name",
					placeholder: "Иван Иванов",
					value: values.name,
					onChange: (event) => update("name", event.target.value),
					"aria-invalid": Boolean(errors.name),
					"aria-describedby": errors.name ? `${FIELD_IDS.name}-error` : void 0,
					className: "demo-input"
				}),
				errors.name ? /* @__PURE__ */ jsx("p", {
					id: `${FIELD_IDS.name}-error`,
					className: "mt-1.5 text-xs font-semibold text-[#9f3030]",
					children: errors.name
				}) : null
			] }),
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("label", {
					htmlFor: FIELD_IDS.email,
					className: "mb-1.5 block text-sm font-semibold text-[var(--sea-ink)]",
					children: "E-mail"
				}),
				/* @__PURE__ */ jsx("input", {
					id: FIELD_IDS.email,
					name: "email",
					type: "email",
					autoComplete: "email",
					placeholder: "ivan@example.com",
					value: values.email,
					onChange: (event) => update("email", event.target.value),
					"aria-invalid": Boolean(errors.email),
					"aria-describedby": errors.email ? `${FIELD_IDS.email}-error` : void 0,
					className: "demo-input"
				}),
				errors.email ? /* @__PURE__ */ jsx("p", {
					id: `${FIELD_IDS.email}-error`,
					className: "mt-1.5 text-xs font-semibold text-[#9f3030]",
					children: errors.email
				}) : null
			] }),
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("label", {
					htmlFor: FIELD_IDS.phone,
					className: "mb-1.5 block text-sm font-semibold text-[var(--sea-ink)]",
					children: "Телефон"
				}),
				/* @__PURE__ */ jsx("input", {
					id: FIELD_IDS.phone,
					name: "phone",
					type: "tel",
					autoComplete: "tel",
					placeholder: "+7 (999) 123-45-67",
					value: values.phone,
					onChange: (event) => update("phone", event.target.value),
					"aria-invalid": Boolean(errors.phone),
					"aria-describedby": errors.phone ? `${FIELD_IDS.phone}-error` : void 0,
					className: "demo-input"
				}),
				errors.phone ? /* @__PURE__ */ jsx("p", {
					id: `${FIELD_IDS.phone}-error`,
					className: "mt-1.5 text-xs font-semibold text-[#9f3030]",
					children: errors.phone
				}) : null
			] }),
			/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("label", {
					htmlFor: FIELD_IDS.course,
					className: "mb-1.5 block text-sm font-semibold text-[var(--sea-ink)]",
					children: "Курс"
				}),
				/* @__PURE__ */ jsxs("select", {
					id: FIELD_IDS.course,
					name: "course",
					value: values.course,
					onChange: (event) => update("course", event.target.value),
					"aria-invalid": Boolean(errors.course),
					"aria-describedby": errors.course ? `${FIELD_IDS.course}-error` : void 0,
					className: "demo-select",
					children: [/* @__PURE__ */ jsx("option", {
						value: "",
						children: "Выберите курс"
					}), COURSES.map((course) => /* @__PURE__ */ jsx("option", {
						value: course.title,
						children: course.title
					}, course.title))]
				}),
				errors.course ? /* @__PURE__ */ jsx("p", {
					id: `${FIELD_IDS.course}-error`,
					className: "mt-1.5 text-xs font-semibold text-[#9f3030]",
					children: errors.course
				}) : null
			] }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
				htmlFor: FIELD_IDS.comment,
				className: "mb-1.5 block text-sm font-semibold text-[var(--sea-ink)]",
				children: [
					"Комментарий",
					" ",
					/* @__PURE__ */ jsx("span", {
						className: "font-normal text-[var(--sea-ink-soft)]",
						children: "(необязательно)"
					})
				]
			}), /* @__PURE__ */ jsx("textarea", {
				id: FIELD_IDS.comment,
				name: "comment",
				rows: 4,
				placeholder: "Например: удобнее вечерние занятия",
				value: values.comment,
				onChange: (event) => update("comment", event.target.value),
				className: "demo-textarea"
			})] }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
				htmlFor: FIELD_IDS.consent,
				className: "flex items-start gap-2.5 text-sm text-[var(--sea-ink-soft)]",
				children: [/* @__PURE__ */ jsx("input", {
					id: FIELD_IDS.consent,
					name: "consent",
					type: "checkbox",
					checked: values.consent,
					onChange: (event) => update("consent", event.target.checked),
					"aria-invalid": Boolean(errors.consent),
					"aria-describedby": errors.consent ? `${FIELD_IDS.consent}-error` : void 0,
					className: "mt-1 h-4 w-4 shrink-0 accent-[var(--lagoon-deep)]"
				}), /* @__PURE__ */ jsx("span", { children: "Согласен на обработку персональных данных" })]
			}), errors.consent ? /* @__PURE__ */ jsx("p", {
				id: `${FIELD_IDS.consent}-error`,
				className: "mt-1.5 text-xs font-semibold text-[#9f3030]",
				children: errors.consent
			}) : null] }),
			/* @__PURE__ */ jsx("button", {
				type: "submit",
				className: "demo-button sm:self-start",
				children: "Отправить заявку"
			})
		]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var SLIDES = [
	{
		id: "algo",
		badge: "Новый поток",
		title: "Алгоритмизация и программирование",
		description: "Пишите чистый и эффективный код: от базовых структур данных до решения реальных задач.",
		href: "/about",
		linkLabel: "Узнать больше"
	},
	{
		id: "web-design",
		badge: "Популярный курс",
		title: "Основы веб-дизайна",
		description: "Собирайте современные интерфейсы: сетки, типографика, цвет и кликабельные прототипы.",
		href: "/about",
		linkLabel: "Узнать больше"
	},
	{
		id: "database",
		badge: "Практика",
		title: "Проектирование баз данных",
		description: "Освойте принципы надёжных хранилищ данных, нормализацию и работу с реляционными моделями.",
		href: "/about",
		linkLabel: "Узнать больше"
	},
	{
		id: "format",
		badge: "Формат обучения",
		title: "Онлайн в своём темпе",
		description: "Материалы доступны круглосуточно, а после прохождения курса вы получаете официальный документ.",
		href: "/about",
		linkLabel: "Как проходит обучение"
	}
];
var STEPS = [
	"Выберите курс и оставьте заявку на сайте.",
	"Получите доступ к материалам и изучайте их в удобное время.",
	"Пройдите итоговое тестирование.",
	"Получите официальный документ об обучении."
];
function HomePage() {
	return /* @__PURE__ */ jsxs("main", {
		className: "page-wrap px-4 pb-10 pt-12",
		children: [
			/* @__PURE__ */ jsxs("section", {
				className: "island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14",
				children: [
					/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" }),
					/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" }),
					/* @__PURE__ */ jsx("p", {
						className: "island-kicker mb-3",
						children: "Дополнительное профессиональное образование"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl",
						children: "Корочки.есть — курсы, после которых остаются навыки."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg",
						children: "Повышайте квалификацию онлайн и получайте официальные документы об обучении."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "#zayavka",
								className: "rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]",
								children: "Записаться на курс"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/about",
								className: "rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]",
								children: "О программе"
							}),
							/* @__PURE__ */ jsx("a", {
								href: "https://tanstack.com/start/latest/docs/framework/react/overview",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]",
								children: "Документация TanStack"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "mt-8 rise-in",
				"aria-label": "Популярные направления",
				children: /* @__PURE__ */ jsx(Carousel, {
					slides: SLIDES,
					label: "Популярные направления обучения",
					intervalMs: 5e3
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "island-kicker mb-2",
						children: "Наши курсы"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "display-title mb-5 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl",
						children: "Популярные направления"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: COURSES.map((course, index) => /* @__PURE__ */ jsxs("article", {
							className: "island-shell feature-card rise-in rounded-2xl p-5",
							style: { animationDelay: `${index * 90 + 80}ms` },
							children: [/* @__PURE__ */ jsx("h3", {
								className: "mb-2 text-base font-semibold text-[var(--sea-ink)]",
								children: course.title
							}), /* @__PURE__ */ jsx("p", {
								className: "m-0 text-sm text-[var(--sea-ink-soft)]",
								children: course.description
							})]
						}, course.title))
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "zayavka",
				className: "island-shell mt-8 rounded-2xl p-6 sm:p-8",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "island-kicker mb-2",
						children: "Запись на курс"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "display-title mb-1 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl",
						children: "Оставьте заявку"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mb-6 max-w-2xl text-sm text-[var(--sea-ink-soft)]",
						children: "Заполните форму — подберём поток и свяжемся с вами в течение рабочего дня."
					}),
					/* @__PURE__ */ jsx(CourseForm, {})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "island-shell mt-8 rounded-2xl p-6",
				children: [/* @__PURE__ */ jsx("p", {
					className: "island-kicker mb-2",
					children: "Как проходит обучение"
				}), /* @__PURE__ */ jsx("ol", {
					className: "m-0 list-decimal space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]",
					children: STEPS.map((step) => /* @__PURE__ */ jsx("li", { children: step }, step))
				})]
			})
		]
	});
}
//#endregion
export { HomePage as component };

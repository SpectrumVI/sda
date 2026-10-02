import { Link, createFileRoute } from "@tanstack/react-router"
import Carousel, { type CarouselSlide } from "../components/Carousel"
import CourseForm from "../components/CourseForm"
import { COURSES } from "../courses"

export const Route = createFileRoute("/")({
	component: HomePage,
	head: () => ({
		meta: [{ title: "Корочки.есть — обучение для специалистов" }],
	}),
})

const SLIDES: CarouselSlide[] = [
	{
		id: "algo",
		badge: "Новый поток",
		title: "Алгоритмизация и программирование",
		description:
			"Пишите чистый и эффективный код: от базовых структур данных до решения реальных задач.",
		href: "/about",
		linkLabel: "Узнать больше",
	},
	{
		id: "web-design",
		badge: "Популярный курс",
		title: "Основы веб-дизайна",
		description:
			"Собирайте современные интерфейсы: сетки, типографика, цвет и кликабельные прототипы.",
		href: "/about",
		linkLabel: "Узнать больше",
	},
	{
		id: "database",
		badge: "Практика",
		title: "Проектирование баз данных",
		description:
			"Освойте принципы надёжных хранилищ данных, нормализацию и работу с реляционными моделями.",
		href: "/about",
		linkLabel: "Узнать больше",
	},
	{
		id: "format",
		badge: "Формат обучения",
		title: "Онлайн в своём темпе",
		description:
			"Материалы доступны круглосуточно, а после прохождения курса вы получаете официальный документ.",
		href: "/about",
		linkLabel: "Как проходит обучение",
	},
]

const STEPS = [
	"Выберите курс и оставьте заявку на сайте.",
	"Получите доступ к материалам и изучайте их в удобное время.",
	"Пройдите итоговое тестирование.",
	"Получите официальный документ об обучении.",
]

function HomePage() {
	return (
		<main className="page-wrap px-4 pb-10 pt-12">
			<section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
				<div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
				<div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
				<p className="island-kicker mb-3">
					Дополнительное профессиональное образование
				</p>
				<h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
					Корочки.есть — курсы, после которых остаются навыки.
				</h1>
				<p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
					Повышайте квалификацию онлайн и получайте официальные документы об
					обучении.
				</p>
				<div className="flex flex-wrap gap-3">
					<a
						href="#zayavka"
						className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
					>
						Записаться на курс
					</a>
					<Link
						to="/about"
						className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
					>
						О программе
					</Link>
					<a
						href="https://tanstack.com/start/latest/docs/framework/react/overview"
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
					>
						Документация TanStack
					</a>
				</div>
			</section>

			<section className="mt-8 rise-in" aria-label="Популярные направления">
				<Carousel
					slides={SLIDES}
					label="Популярные направления обучения"
					intervalMs={5000}
				/>
			</section>

			<section className="mt-10">
				<p className="island-kicker mb-2">Наши курсы</p>
				<h2 className="display-title mb-5 text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
					Популярные направления
				</h2>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{COURSES.map((course, index) => (
						<article
							key={course.title}
							className="island-shell feature-card rise-in rounded-2xl p-5"
							style={{ animationDelay: `${index * 90 + 80}ms` }}
						>
							<h3 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
								{course.title}
							</h3>
							<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
								{course.description}
							</p>
						</article>
					))}
				</div>
			</section>

			<section
				id="zayavka"
				className="island-shell mt-8 rounded-2xl p-6 sm:p-8"
			>
				<p className="island-kicker mb-2">Запись на курс</p>
				<h2 className="display-title mb-1 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
					Оставьте заявку
				</h2>
				<p className="mb-6 max-w-2xl text-sm text-[var(--sea-ink-soft)]">
					Заполните форму — подберём поток и свяжемся с вами в течение
					рабочего дня.
				</p>
				<CourseForm />
			</section>

			<section className="island-shell mt-8 rounded-2xl p-6">
				<p className="island-kicker mb-2">Как проходит обучение</p>
				<ol className="m-0 list-decimal space-y-2 pl-5 text-sm text-[var(--sea-ink-soft)]">
					{STEPS.map((step) => (
						<li key={step}>{step}</li>
					))}
				</ol>
			</section>
		</main>
	)
}


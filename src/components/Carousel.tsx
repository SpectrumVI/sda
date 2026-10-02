import type {
	KeyboardEvent as ReactKeyboardEvent,
	PointerEvent as ReactPointerEvent,
} from "react"
import { useCallback, useEffect, useRef, useState } from "react"

export type CarouselSlide = {
	id: string
	title: string
	description: string
	badge?: string
	image?: string
	imageAlt?: string
	href?: string
	linkLabel?: string
}

type CarouselProps = {
	slides: CarouselSlide[]
	label?: string
	autoPlay?: boolean
	intervalMs?: number
	className?: string
}

const SLIDE_ART = [
	"radial-gradient(circle at 24% 18%, rgba(79,184,178,0.55), transparent 60%), linear-gradient(135deg, #2f6a4a, #4fb8b2)",
	"radial-gradient(circle at 78% 24%, rgba(255,255,255,0.45), transparent 58%), linear-gradient(135deg, #328f97, #7ed3bf)",
	"radial-gradient(circle at 30% 76%, rgba(23,58,64,0.4), transparent 62%), linear-gradient(135deg, #4fb8b2, #173a40)",
	"radial-gradient(circle at 70% 30%, rgba(126,211,191,0.6), transparent 60%), linear-gradient(135deg, #173a40, #2f6a4a)",
]

const ARROW_CLASS =
	"flex h-9 w-9 items-center justify-center rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] text-lg leading-none font-bold text-[var(--sea-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--link-bg-hover)]"

export default function Carousel({
	slides,
	label = "Карусель",
	autoPlay = true,
	intervalMs = 5000,
	className = "",
}: CarouselProps) {
	const count = slides.length
	const [index, setIndex] = useState(0)
	const [paused, setPaused] = useState(false)
	const pointerStartX = useRef<number | null>(null)

	const safeIndex = count > 0 ? ((index % count) + count) % count : 0

	const goTo = useCallback(
		(next: number) => {
			if (count === 0) {
				return
			}
			setIndex(((next % count) + count) % count)
		},
		[count],
	)

	const goNext = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex])
	const goPrev = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex])

	useEffect(() => {
		if (!autoPlay || paused || count <= 1 || typeof window === "undefined") {
			return
		}
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return
		}

		const timer = window.setInterval(() => {
			if (document.hidden) {
				return
			}
			setIndex((current) => (current + 1) % count)
		}, intervalMs)

		return () => window.clearInterval(timer)
	}, [autoPlay, paused, count, intervalMs])

	function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
		if (event.key === "ArrowRight") {
			event.preventDefault()
			goNext()
		} else if (event.key === "ArrowLeft") {
			event.preventDefault()
			goPrev()
		}
	}

	function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
		pointerStartX.current = event.clientX
	}

	function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
		const startX = pointerStartX.current
		pointerStartX.current = null

		if (startX === null) {
			return
		}

		const deltaX = event.clientX - startX
		if (Math.abs(deltaX) < 40) {
			return
		}
		if (deltaX < 0) {
			goNext()
		} else {
			goPrev()
		}
	}

	if (count === 0) {
		return null
	}

	return (
		<section
			aria-roledescription="карусель"
			aria-label={label}
			className={`island-shell relative overflow-hidden rounded-[1.75rem] ${className}`.trim()}
			onKeyDown={handleKeyDown}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
		>
			<p className="sr-only" aria-live="polite">
				{`Слайд ${safeIndex + 1} из ${count}: ${slides[safeIndex].title}`}
			</p>

			<div className="overflow-hidden">
				<div
					className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
					style={{ transform: `translate3d(-${safeIndex * 100}%, 0, 0)` }}
					onPointerDown={handlePointerDown}
					onPointerUp={handlePointerUp}
					onPointerCancel={handlePointerUp}
				>
					{slides.map((slide, slideIndex) => {
						const art = SLIDE_ART[slideIndex % SLIDE_ART.length]

						return (
							<article
								key={slide.id}
								aria-hidden={slideIndex !== safeIndex}
								className="w-full shrink-0 px-5 py-7 sm:px-9 sm:py-9"
							>
								<div className="grid items-center gap-6 sm:grid-cols-[1.15fr_1fr]">
									<div>
										{slide.badge ? (
											<p className="island-kicker mb-3">{slide.badge}</p>
										) : null}
										<h3 className="display-title m-0 mb-3 text-2xl leading-tight font-bold text-[var(--sea-ink)] sm:text-4xl">
											{slide.title}
										</h3>
										<p className="m-0 max-w-xl text-sm leading-relaxed text-[var(--sea-ink-soft)] sm:text-base">
											{slide.description}
										</p>
										{slide.href ? (
											<a
												href={slide.href}
												className="mt-5 inline-flex rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-4 py-2 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
											>
												{slide.linkLabel ?? "Подробнее"}
											</a>
										) : null}
									</div>

									<div className="relative h-40 overflow-hidden rounded-[1.25rem] border border-[var(--line)] sm:h-56">
										{slide.image ? (
											<img
												src={slide.image}
												alt={slide.imageAlt ?? slide.title}
												className="h-full w-full object-cover"
												loading="lazy"
											/>
										) : (
											<div
												className="h-full w-full"
												style={{ backgroundImage: art }}
											/>
										)}
									</div>
								</div>
							</article>
						)
					})}
				</div>
			</div>

			<div className="flex items-center justify-between gap-4 border-t border-[var(--line)] px-5 py-4 sm:px-9">
				<div className="flex items-center gap-2">
					{slides.map((slide, slideIndex) => (
						<button
							key={slide.id}
							type="button"
							onClick={() => goTo(slideIndex)}
							aria-label={`Слайд ${slideIndex + 1} из ${count}`}
							aria-current={slideIndex === safeIndex}
							className={`h-2.5 rounded-full border border-[var(--chip-line)] transition-all ${
								slideIndex === safeIndex
									? "w-7 bg-[var(--lagoon)]"
									: "w-2.5 bg-[var(--chip-bg)] hover:bg-[var(--link-bg-hover)]"
							}`}
						/>
					))}
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={goPrev}
						aria-label="Предыдущий слайд"
						className={ARROW_CLASS}
					>
						{"‹"}
					</button>
					<button
						type="button"
						onClick={goNext}
						aria-label="Следующий слайд"
						className={ARROW_CLASS}
					>
						{"›"}
					</button>
				</div>
			</div>
		</section>
	)
}

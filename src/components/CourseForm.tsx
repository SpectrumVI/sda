import type { FormEvent } from "react"
import { useState } from "react"
import { COURSES } from "../courses"

type FormValues = {
	name: string
	email: string
	phone: string
	course: string
	comment: string
	consent: boolean
}

type FieldErrors = Partial<Record<keyof FormValues, string>>

type Submission = {
	name: string
	email: string
	phone: string
	course: string
	comment: string
}

const EMPTY_VALUES: FormValues = {
	name: "",
	email: "",
	phone: "",
	course: "",
	comment: "",
	consent: false,
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^\+?[0-9][\d\s()-]{8,18}$/

const FIELD_IDS: Record<keyof FormValues, string> = {
	name: "enroll-name",
	email: "enroll-email",
	phone: "enroll-phone",
	course: "enroll-course",
	comment: "enroll-comment",
	consent: "enroll-consent",
}

function validate(values: FormValues): FieldErrors {
	const errors: FieldErrors = {}

	if (values.name.trim().length < 2) {
		errors.name = "Укажите имя и фамилию"
	}
	if (!EMAIL_PATTERN.test(values.email.trim())) {
		errors.email = "Введите корректный e-mail"
	}
	if (!PHONE_PATTERN.test(values.phone.trim())) {
		errors.phone = "Формат: +7 (999) 123-45-67"
	}
	if (!values.course) {
		errors.course = "Выберите курс"
	}
	if (!values.consent) {
		errors.consent = "Нужно согласие на обработку данных"
	}

	return errors
}

export default function CourseForm() {
	const [values, setValues] = useState<FormValues>(EMPTY_VALUES)
	const [errors, setErrors] = useState<FieldErrors>({})
	const [submission, setSubmission] = useState<Submission | null>(null)

	function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
		setValues((current) => ({ ...current, [key]: value }))
		setErrors((current) => ({ ...current, [key]: undefined }))
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const nextErrors = validate(values)
		setErrors(nextErrors)

		const firstError = (Object.keys(nextErrors) as (keyof FormValues)[])[0]
		if (firstError) {
			document.getElementById(FIELD_IDS[firstError])?.focus()
			return
		}

		setSubmission({
			name: values.name.trim(),
			email: values.email.trim(),
			phone: values.phone.trim(),
			course: values.course,
			comment: values.comment.trim(),
		})
		setValues(EMPTY_VALUES)
	}

	function reset() {
		setSubmission(null)
		setErrors({})
	}

	const errorList = (Object.keys(errors) as (keyof FormValues)[]).filter(
		(key) => errors[key],
	)
	const hasErrors = errorList.length > 0

	if (submission) {
		return (
			<div className="rounded-xl border border-[rgba(47,106,74,0.3)] bg-[rgba(47,106,74,0.1)] p-5">
				<h3 className="display-title mb-2 text-xl font-bold text-[var(--sea-ink)]">
					Заявка принята
				</h3>
				<p className="m-0 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
					{submission.name}, вы записаны на курс «{submission.course}». Мы
					свяжемся с вами по адресу {submission.email} или по телефону{" "}
					{submission.phone}.
				</p>
				<button
					type="button"
					onClick={reset}
					className="demo-button mt-4"
				>
					Записаться ещё
				</button>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
			{hasErrors ? (
				<p role="alert" className="demo-alert m-0 text-sm">
					Проверьте заполнение формы: ошибка в{" "}
					{errorList.length === 1 ? "одном поле" : "нескольких полях"}.
				</p>
			) : null}

			<div>
				<label
					htmlFor={FIELD_IDS.name}
					className="mb-1.5 block text-sm font-semibold text-[var(--sea-ink)]"
				>
					Имя и фамилия
				</label>
				<input
					id={FIELD_IDS.name}
					name="name"
					type="text"
					autoComplete="name"
					placeholder="Иван Иванов"
					value={values.name}
					onChange={(event) => update("name", event.target.value)}
					aria-invalid={Boolean(errors.name)}
					aria-describedby={
						errors.name ? `${FIELD_IDS.name}-error` : undefined
					}
					className="demo-input"
				/>
				{errors.name ? (
					<p
						id={`${FIELD_IDS.name}-error`}
						className="mt-1.5 text-xs font-semibold text-[#9f3030]"
					>
						{errors.name}
					</p>
				) : null}
			</div>

			<div>
				<label
					htmlFor={FIELD_IDS.email}
					className="mb-1.5 block text-sm font-semibold text-[var(--sea-ink)]"
				>
					E-mail
				</label>
				<input
					id={FIELD_IDS.email}
					name="email"
					type="email"
					autoComplete="email"
					placeholder="ivan@example.com"
					value={values.email}
					onChange={(event) => update("email", event.target.value)}
					aria-invalid={Boolean(errors.email)}
					aria-describedby={
						errors.email ? `${FIELD_IDS.email}-error` : undefined
					}
					className="demo-input"
				/>
				{errors.email ? (
					<p
						id={`${FIELD_IDS.email}-error`}
						className="mt-1.5 text-xs font-semibold text-[#9f3030]"
					>
						{errors.email}
					</p>
				) : null}
			</div>

			<div>
				<label
					htmlFor={FIELD_IDS.phone}
					className="mb-1.5 block text-sm font-semibold text-[var(--sea-ink)]"
				>
					Телефон
				</label>
				<input
					id={FIELD_IDS.phone}
					name="phone"
					type="tel"
					autoComplete="tel"
					placeholder="+7 (999) 123-45-67"
					value={values.phone}
					onChange={(event) => update("phone", event.target.value)}
					aria-invalid={Boolean(errors.phone)}
					aria-describedby={
						errors.phone ? `${FIELD_IDS.phone}-error` : undefined
					}
					className="demo-input"
				/>
				{errors.phone ? (
					<p
						id={`${FIELD_IDS.phone}-error`}
						className="mt-1.5 text-xs font-semibold text-[#9f3030]"
					>
						{errors.phone}
					</p>
				) : null}
			</div>

			<div>
				<label
					htmlFor={FIELD_IDS.course}
					className="mb-1.5 block text-sm font-semibold text-[var(--sea-ink)]"
				>
					Курс
				</label>
				<select
					id={FIELD_IDS.course}
					name="course"
					value={values.course}
					onChange={(event) => update("course", event.target.value)}
					aria-invalid={Boolean(errors.course)}
					aria-describedby={
						errors.course ? `${FIELD_IDS.course}-error` : undefined
					}
					className="demo-select"
				>
					<option value="">Выберите курс</option>
					{COURSES.map((course) => (
						<option key={course.title} value={course.title}>
							{course.title}
						</option>
					))}
				</select>
				{errors.course ? (
					<p
						id={`${FIELD_IDS.course}-error`}
						className="mt-1.5 text-xs font-semibold text-[#9f3030]"
					>
						{errors.course}
					</p>
				) : null}
			</div>

			<div>
				<label
					htmlFor={FIELD_IDS.comment}
					className="mb-1.5 block text-sm font-semibold text-[var(--sea-ink)]"
				>
					Комментарий{" "}
					<span className="font-normal text-[var(--sea-ink-soft)]">
						(необязательно)
					</span>
				</label>
				<textarea
					id={FIELD_IDS.comment}
					name="comment"
					rows={4}
					placeholder="Например: удобнее вечерние занятия"
					value={values.comment}
					onChange={(event) => update("comment", event.target.value)}
					className="demo-textarea"
				/>
			</div>

			<div>
				<label
					htmlFor={FIELD_IDS.consent}
					className="flex items-start gap-2.5 text-sm text-[var(--sea-ink-soft)]"
				>
					<input
						id={FIELD_IDS.consent}
						name="consent"
						type="checkbox"
						checked={values.consent}
						onChange={(event) => update("consent", event.target.checked)}
						aria-invalid={Boolean(errors.consent)}
						aria-describedby={
							errors.consent ? `${FIELD_IDS.consent}-error` : undefined
						}
						className="mt-1 h-4 w-4 shrink-0 accent-[var(--lagoon-deep)]"
					/>
					<span>Согласен на обработку персональных данных</span>
				</label>
				{errors.consent ? (
					<p
						id={`${FIELD_IDS.consent}-error`}
						className="mt-1.5 text-xs font-semibold text-[#9f3030]"
					>
						{errors.consent}
					</p>
				) : null}
			</div>

			<button type="submit" className="demo-button sm:self-start">
				Отправить заявку
			</button>
		</form>
	)
}


import type { APIRoute } from 'astro'
import OpenAI from 'openai'
import { chatbotProfile } from '../data/chatbot-profile'

type ChatMessage = {
	role: 'user' | 'assistant'
	content: string
}

const MAX_MESSAGES = 8
const MAX_MESSAGE_LENGTH = 700

function sanitizeMessages(messages: unknown): ChatMessage[] {
	if (!Array.isArray(messages)) return []

	return messages
		.filter((message): message is ChatMessage => {
			if (!message || typeof message !== 'object') return false
			const maybeMessage = message as Partial<ChatMessage>
			return (
				(maybeMessage.role === 'user' || maybeMessage.role === 'assistant') &&
				typeof maybeMessage.content === 'string' &&
				maybeMessage.content.trim().length > 0
			)
		})
		.slice(-MAX_MESSAGES)
		.map((message) => ({
			role: message.role,
			content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
		}))
}

export const POST: APIRoute = async ({ request }) => {
	const apiKey =
		import.meta.env.OPENAI_API_KEY ??
		import.meta.env.OPEN_AI_KEY ??
		import.meta.env.API_KEY_CHATGPT

	if (!apiKey) {
		return new Response(
			JSON.stringify({
				error: 'OpenAI API key is not configured.',
			}),
			{ status: 503, headers: { 'Content-Type': 'application/json' } },
		)
	}

	let body: { message?: unknown; messages?: unknown; locale?: unknown }

	try {
		body = await request.json()
	} catch {
		return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	const message = typeof body.message === 'string' ? body.message.trim() : ''
	const locale = body.locale === 'en' ? 'en' : 'es'

	if (!message) {
		return new Response(JSON.stringify({ error: 'Message is required.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	const history = sanitizeMessages(body.messages)
	const openai = new OpenAI({ apiKey })

	try {
		const response = await openai.responses.create({
			model: import.meta.env.OPENAI_CHAT_MODEL ?? 'gpt-5.4-mini',
			instructions:
				`Eres MartiMate, el asistente virtual del portfolio personal de Martí Vilàs. ` +
				`Responde en ${locale === 'en' ? 'ingles' : 'espanol'} salvo que el usuario pida otro idioma. ` +
				`Usa exclusivamente la informacion del perfil proporcionado. ` +
				`Si no sabes un dato, no lo inventes: dilo brevemente y sugiere contactar con Marti desde el formulario de contacto. ` +
				`Mantén respuestas claras, naturales y de 2 a 5 frases. ` +
				`No uses markdown, asteriscos, listas con guiones, tablas ni formato especial; responde solo con texto plano.\n\n` +
				`PERFIL DE MARTI:\n${chatbotProfile}`,
			input: [
				...history.map((item) => ({
					role: item.role,
					content: item.content,
				})),
				{
					role: 'user',
					content: message.slice(0, MAX_MESSAGE_LENGTH),
				},
			],
		})

		return new Response(JSON.stringify({ answer: response.output_text.trim() }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch {
		return new Response(
			JSON.stringify({
				error: locale === 'en' ? 'The assistant is unavailable right now.' : 'El asistente no esta disponible ahora mismo.',
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } },
		)
	}
}

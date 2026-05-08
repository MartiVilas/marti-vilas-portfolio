import type { APIRoute } from "astro";

export const prerender = false;

const BREVO_CONTACTS_ENDPOINT = "https://api.brevo.com/v3/contacts";
const BREVO_TRANSACTIONAL_EMAIL_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const DEFAULT_NOTIFICATION_EMAIL = "marti.vilas14@gmail.com";
const DEFAULT_SENDER_NAME = "Marti Vilas Portfolio";

function jsonResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json",
		},
	});
}

function getString(formData: FormData, key: string) {
	const value = formData.get(key);
	return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function getRequestValue(data: FormData | Record<string, unknown>, key: string) {
	if (data instanceof FormData) {
		return getString(data, key);
	}

	const value = data?.[key];
	return typeof value === "string" ? value.trim() : "";
}

function getRequestConsent(data: FormData | Record<string, unknown>) {
	return data instanceof FormData ? data.get("consent") === "on" : data?.consent === true;
}

async function createBrevoContact(apiKey: string, payload: unknown) {
	return fetch(BREVO_CONTACTS_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"api-key": apiKey,
		},
		body: JSON.stringify(payload),
	});
}

async function sendNotificationEmail({
	apiKey,
	name,
	email,
	message,
}: {
	apiKey: string;
	name: string;
	email: string;
	message: string;
}) {
	const notificationEmail = import.meta.env.BREVO_NOTIFICATION_EMAIL ?? DEFAULT_NOTIFICATION_EMAIL;
	const senderEmail = import.meta.env.BREVO_SENDER_EMAIL ?? notificationEmail;
	const senderName = import.meta.env.BREVO_SENDER_NAME ?? DEFAULT_SENDER_NAME;
	const safeName = escapeHtml(name);
	const safeEmail = escapeHtml(email);
	const safeMessage = escapeHtml(message || "Sin mensaje").replaceAll("\n", "<br />");

	return fetch(BREVO_TRANSACTIONAL_EMAIL_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"api-key": apiKey,
		},
		body: JSON.stringify({
			sender: {
				name: senderName,
				email: senderEmail,
			},
			to: [
				{
					email: notificationEmail,
					name: "Marti Vilas",
				},
			],
			replyTo: {
				email,
				name,
			},
			subject: `Nuevo mensaje desde el portfolio de ${name}`,
			htmlContent: `
				<html>
					<body>
						<h2>Nuevo mensaje desde el portfolio</h2>
						<p><strong>Nombre:</strong> ${safeName}</p>
						<p><strong>Email:</strong> ${safeEmail}</p>
						<p><strong>Mensaje:</strong></p>
						<p>${safeMessage}</p>
					</body>
				</html>
			`,
			textContent: `Nuevo mensaje desde el portfolio\n\nNombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message || "Sin mensaje"}`,
		}),
	});
}

export const POST: APIRoute = async ({ request }) => {
	const apiKey = import.meta.env.BREVO_API_KEY;

	if (!apiKey) {
		console.error("BREVO_API_KEY is missing.");
		return jsonResponse({ message: "Brevo API key is not configured." }, 500);
	}

	const contentType = request.headers.get("content-type") ?? "";
	const data = contentType.includes("application/json")
		? ((await request.json()) as Record<string, unknown>)
		: await request.formData();

	const website = getRequestValue(data, "website");

	if (website) {
		return jsonResponse({ message: "ok" });
	}

	const name = getRequestValue(data, "name");
	const email = getRequestValue(data, "email");
	const message = getRequestValue(data, "message");
	const consent = getRequestConsent(data);

	if (!name || !email || !consent) {
		return jsonResponse({ message: "Missing required fields." }, 400);
	}

	const attributes: Record<string, string> = {};

	if (name) {
		attributes.FNAME = name;
	}

	const messageAttribute = import.meta.env.BREVO_MESSAGE_ATTRIBUTE;

	if (message && messageAttribute) {
		attributes[messageAttribute] = message;
	}

	const listId = Number(import.meta.env.BREVO_LIST_ID);
	const payload = {
		email,
		attributes,
		updateEnabled: true,
		...(Number.isFinite(listId) && listId > 0 ? { listIds: [listId] } : {}),
	};

	const contactResponse = await createBrevoContact(apiKey, payload);

	if (!contactResponse.ok) {
		const errorText = await contactResponse.text();

		console.error("Brevo rejected the contact request.", {
			status: contactResponse.status,
			body: errorText,
		});

		return jsonResponse({ message: "Brevo rejected the request." }, 502);
	}

	const emailResponse = await sendNotificationEmail({
		apiKey,
		name,
		email,
		message,
	});

	if (!emailResponse.ok) {
		const errorText = await emailResponse.text();

		console.error("Brevo rejected the notification email request.", {
			status: emailResponse.status,
			body: errorText,
		});

		return jsonResponse({ message: "Brevo rejected the notification email." }, 502);
	}

	return jsonResponse({ message: "ok" });
};

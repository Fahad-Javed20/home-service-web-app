"use server";

import { redirect } from "next/navigation";
import { contactMessageSchema } from "@/backend/validations/contact";

function redirectWithMessage(payload: { status?: string; error?: string }) {
  const params = new URLSearchParams();
  if (payload.status) {
    params.set("status", payload.status);
  }
  if (payload.error) {
    params.set("error", payload.error);
  }

  const query = params.toString();
  const target = query ? `/contact?${query}` : "/contact";
  redirect(target);
}

export async function submitContactFormAction(formData: FormData) {
  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    redirectWithMessage({
      error: parsed.error.issues[0]?.message ?? "Please check the form values.",
    });
  }

  // Placeholder for external integration (CRM/helpdesk/email webhook).
  console.log("Contact form submitted", parsed.data);

  redirectWithMessage({
    status: "message-sent",
  });
}

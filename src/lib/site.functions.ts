import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function checkPassword(pw: string) {
  const expected = process.env['ADMIN_PASSWORD'];
  return !!expected && pw === expected;
}

export const verifyAdmin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => ({ ok: checkPassword(data.password) }));

export const saveSiteContent = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ password: z.string().max(200), content: z.record(z.string(), z.unknown()) }).parse(d),
  )
  .handler(async ({ data }) => {
    if (!checkPassword(data.password)) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const updated_at = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from("site_data")
      .upsert({ id: 1, content: data.content as never, updated_at });
    if (error) throw new Error(error.message);
    return { updated_at };
  });

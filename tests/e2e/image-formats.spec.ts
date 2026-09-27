import { expect, test } from "./fixtures";

test("next/image serves AVIF when the browser accepts it", async ({ request }) => {
  const res = await request.get("/_next/image?url=%2Fimages%2Favatar.jpg&w=256&q=75", {
    headers: { accept: "image/avif,image/webp,image/*,*/*;q=0.8" },
  });
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toBe("image/avif");
});

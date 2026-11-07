/* optimize-media.mjs — بيصغّر الفيديو والصور بأمر واحد (بدون ما تخسر جودة ملحوظة)
   المتطلبات: Node 18+ ، ffmpeg منزّل (https://ffmpeg.org) ، و  npm install
   التشغيل:   npm run media
   • صور السيارات img/cars/*.webp|jpg|png ← نسخة أصلية محسّنة (أقصى عرض 1600) + نسخة صغيرة img/cars/sm/ (640) للبطاقات
   • الفيديو videos/best.mp4 ← نسخة كمبيوتر خفيفة + videos/best-mobile.mp4 للموبايل + img/hero-poster.webp
   النسخة الأصلية بتنحفظ بمجلد _originals/ قبل أي تعديل. */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const BACKUP = "_originals";
fs.mkdirSync(BACKUP, { recursive: true });

/* ---------------- الصور ---------------- */
const dir = "img/cars";
if (fs.existsSync(dir)) {
  fs.mkdirSync(path.join(dir, "sm"), { recursive: true });
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (!fs.statSync(p).isFile() || !/\.(webp|jpe?g|png)$/i.test(f)) continue;
    const name = f.replace(/\.(jpe?g|png)$/i, ".webp");
    const bak = path.join(BACKUP, "cars"); fs.mkdirSync(bak, { recursive: true });
    if (!fs.existsSync(path.join(bak, f))) fs.copyFileSync(p, path.join(bak, f));
    const buf = fs.readFileSync(path.join(bak, f));
    await sharp(buf).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(path.join(dir, name + ".tmp"));
    fs.renameSync(path.join(dir, name + ".tmp"), path.join(dir, name));
    await sharp(buf).rotate().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 72, effort: 5 }).toFile(path.join(dir, "sm", name));
    if (name !== f) fs.rmSync(p);   // jpg/png القديمة (غيّر PHOTO_EXT بـ cars.js إذا لزم)
    console.log("صورة:", f, "→", (fs.statSync(path.join(dir, name)).size / 1024).toFixed(0) + "KB");
  }
}

/* ---------------- الفيديو ---------------- */
const src = "videos/best.mp4";
if (fs.existsSync(src)) {
  const orig = path.join(BACKUP, "best.original.mp4");
  if (!fs.existsSync(orig)) fs.copyFileSync(src, orig);
  const ff = (args) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });
  // كمبيوتر: 1080p، بدون صوت (الفيديو أصلاً muted)، faststart = بيبدأ يشتغل قبل ما يخلّص تحميل
  ff(["-i", orig, "-an", "-vf", "scale='min(1920,iw)':-2,fps=30", "-c:v", "libx264", "-preset", "slow", "-crf", "29", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "videos/best.tmp.mp4"]);
  fs.renameSync("videos/best.tmp.mp4", src);
  // موبايل: 720p أخف
  ff(["-i", orig, "-an", "-t", "12", "-vf", "scale='min(1280,iw)':-2,fps=24", "-c:v", "libx264", "-preset", "slow", "-crf", "31", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "videos/best-mobile.mp4"]);
  // بوستر: أول لقطة
  ff(["-i", orig, "-frames:v", "1", "-vf", "scale='min(1600,iw)':-2", "img/hero-poster.png"]);
  await sharp("img/hero-poster.png").webp({ quality: 70 }).toFile("img/hero-poster.webp");
  fs.rmSync("img/hero-poster.png");
  for (const f of [src, "videos/best-mobile.mp4", "img/hero-poster.webp"]) console.log("فيديو/بوستر:", f, (fs.statSync(f).size / 1024).toFixed(0) + "KB");
}
console.log("خلص ✔");

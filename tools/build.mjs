/* build.mjs — بيجمع ويضغط الملفات لـ css/site.min.css و js/site.min.js
   التشغيل:  npm install   (مرة وحدة)   ثم   npm run bundle   بعد كل تعديل على js/ أو css/  */
import { build } from "esbuild";
import fs from "node:fs";

const JS = ["data", "cars-svg", "cars", "i18n", "sheet", "app", "pages", "home", "shop", "main"]; // الترتيب مهم
const CSS = ["style", "icons"];

const join = (dir, list, ext) => list.map((f) => fs.readFileSync(`${dir}/${f}.${ext}`, "utf8")).join("\n;\n");
fs.writeFileSync("js/.bundle.tmp.js", join("js", JS, "js"));
fs.writeFileSync("css/.bundle.tmp.css", CSS.map((f) => fs.readFileSync(`css/${f}.css`, "utf8")).join("\n"));

await build({ entryPoints: ["js/.bundle.tmp.js"], outfile: "js/site.min.js", minify: true, target: "es2019", charset: "utf8", legalComments: "none" });
await build({ entryPoints: ["css/.bundle.tmp.css"], outfile: "css/site.min.css", minify: true, charset: "utf8" });
fs.rmSync("js/.bundle.tmp.js"); fs.rmSync("css/.bundle.tmp.css");
console.log("OK ✔  js/site.min.js:", fs.statSync("js/site.min.js").size, "bytes | css/site.min.css:", fs.statSync("css/site.min.css").size, "bytes");
console.log("إذا عدّلت، غيّر ?v=19 بـ index.html ورقم VERSION بـ sw.js عشان الزبائن ياخدوا النسخة الجديدة.");

import autoprefixer from "autoprefixer";
import postcssImport from "postcss-import";
import tailwindcss from "tailwindcss";
import nesting from "tailwindcss/nesting/index.js";

export default {
	plugins: [postcssImport(), nesting(), tailwindcss(), autoprefixer()],
};

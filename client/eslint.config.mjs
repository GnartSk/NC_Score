import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "prefer-const": "off", // Tắt bắt buộc dùng 'const'
      "@typescript-eslint/no-explicit-any": "off", // Cho phép sử dụng 'any'
      "no-console": "warn", // Cảnh báo khi sử dụng 'console.log'
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Cảnh báo biến không sử dụng (bỏ qua biến bắt đầu bằng _)
    },
  },
];

export default eslintConfig;

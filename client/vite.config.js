import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const API_URL = "https://bharatjob-1.onrender.com";

function forceProductionApi() {
  return {
    name: "force-production-api",
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === "chunk") {
          chunk.code = chunk.code
            .replaceAll("https://bharatjob-2.onrender.com", API_URL)
            .replaceAll("http://localhost:5000/api", `${API_URL}/api`);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    forceProductionApi(),
  ],
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(API_URL),
  },
});

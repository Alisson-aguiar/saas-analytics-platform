import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/config";

// Verifique se o authOptions está sendo importado corretamente
console.log("📢 NextAuth route loaded", {
    providers: authOptions.providers?.map(p => p.name)
});

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
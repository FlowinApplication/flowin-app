import { clerkMiddleware } from '@clerk/nextjs/server';

// TODO: Adicionar rotas públicas e privadas (Como faz, sei lá ???? ATUALIZOU O CLERK...)

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};

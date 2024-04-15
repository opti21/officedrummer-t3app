import { eq } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/env.mjs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { requests } from "~/server/db/schema";

const allowedUsers = [env.OFD_USER_ID, env.OPTI_USER_ID];

export const songRequestsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const accountInfo = await ctx.db.query.accounts.findFirst({
        where: (accounts, { eq }) => eq(accounts.userId, ctx.session.user.id),
      });

      const twitchId = accountInfo?.providerAccountId;
      if (!allowedUsers.includes(twitchId)) {
        throw new Error("You are not authorized to delete this request");
      }

      await ctx.db.insert(requests).values({
        twitchUser: input.name,
        twitchId: ctx.session.user.id,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const accountInfo = await ctx.db.query.accounts.findFirst({
        where: (accounts, { eq }) => eq(accounts.userId, ctx.session.user.id),
      });

      const twitchId = accountInfo?.providerAccountId;
      if (!allowedUsers.includes(twitchId)) {
        throw new Error("You are not authorized to delete this request");
      }

      await ctx.db.delete(requests).where(eq(requests.id, input.id));
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.requests.findMany({
      orderBy: (posts, { asc }) => [asc(posts.createdAt)],
    });
  }),

  clearAll: protectedProcedure.mutation(async ({ ctx }) => {
    const accountInfo = await ctx.db.query.accounts.findFirst({
      where: (accounts, { eq }) => eq(accounts.userId, ctx.session.user.id),
    });

    const twitchId = accountInfo?.providerAccountId;
    if (!allowedUsers.includes(twitchId)) {
      throw new Error("You are not authorized to delete this request");
    }

    await ctx.db.delete(requests);
  }),
});

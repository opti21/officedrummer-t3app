import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "../trpc";

const adminUsers = [env.OFD_USER_ID, env.OPTI_USER_ID];

export const usersRouter = createTRPCRouter({
    isAdmin: publicProcedure
    .query(async ({ ctx }) => {
        if (!ctx.session) {
            return false
        }

        if (!ctx.session.user) {
            return false
        }

        const accountInfo = await ctx.db.query.accounts.findFirst({
          where: (accounts, { eq }) => eq(accounts.userId, ctx.session!.user.id),
        })

        const twitchId = accountInfo?.providerAccountId
        if (!adminUsers.includes(twitchId)) {
            return false
        }

        return true
    })
})
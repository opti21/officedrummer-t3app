import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const adminUsers = [env.OFD_USER_ID, env.OPTI_USER_ID];

export const usersRouter = createTRPCRouter({
  isAdmin: protectedProcedure.query(({ ctx }) => {
    if (!ctx.session.twitchId) {
      return false;
    }

    if (!adminUsers.includes(ctx.session.twitchId)) {
      return false;
    }

    return true;
  }),
});

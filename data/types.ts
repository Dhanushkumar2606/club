import { z } from "zod";

export const memberSchema = z.object({
  name: z.string(),
  position: z.string(),
  image: z.string().nullish(),
  linkedin: z.string().nullish(),
});
export type Member = z.infer<typeof memberSchema>;

export const clubIdSchema = z.enum(["script-soldiers", "cyber-knights"]);
export type ClubId = z.infer<typeof clubIdSchema>;

export const clubSchema = z.object({
  id: clubIdSchema,
  code: z.string(),
  name: z.string(),
  identity: z.string(),
  focus: z.string(),
  description: z.string(),
  motto: z.string(),
  tagline: z.string().optional(),
  mission: z.string(),
  vision: z.string(),
  logo: z.string().nullish(),
  domains: z.array(z.string()),
  members: z.array(memberSchema),
});
export type Club = z.infer<typeof clubSchema>;

export const leaderSchema = z.object({
  name: z.string(),
  position: z.string(),
  image: z.string().nullish(),
  linkedin: z.string().nullish(),
  club: z.enum(["script-soldiers", "cyber-knights", "both"]),
});
export type Leader = z.infer<typeof leaderSchema>;

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  club: z.enum(["script-soldiers", "cyber-knights", "both"]),
  year: z.string().nullish(),
  date: z.string().nullish(),
  venue: z.string().nullish(),
  description: z.string().nullish(),
  image: z.string().nullish(),
  registrationUrl: z.string().nullish(),
  status: z.enum(["upcoming", "ongoing", "past"]),
});
export type ClubEvent = z.infer<typeof eventSchema>;
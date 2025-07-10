import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pumpInfo: defineTable({
    pumpName: v.string(),
    type: v.string(),
    area: v.string(),
    latitude: v.float64(),
    longitude: v.float64(),
    flowRate: v.number(),
    offSet: v.number(),
    current_pressure: v.number(),
    min_pressure: v.number(),
    max_pressure: v.number(),
  }),
});

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Read all pumps
export const getAllPump = query({
  handler: async (ctx) => {
    const pumpData = await ctx.db.query("pumpInfo").collect();
    return pumpData;
  },
});

// Read a single pump by ID
export const getPump = query({
  args: {
    id: v.id("pumpInfo"),
  },
  handler: async (ctx, args) => {
    const pump = await ctx.db.get(args.id);
    return pump;
  },
});

// Create a new pump
export const createPump = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const pumpId = await ctx.db.insert("pumpInfo", {
      pumpName: args.pumpName,
      type: args.type,
      area: args.area,
      latitude: args.latitude,
      longitude: args.longitude,
      flowRate: args.flowRate,
      offSet: args.offSet,
      current_pressure: args.current_pressure,
      min_pressure: args.min_pressure,
      max_pressure: args.max_pressure,
    });
    return pumpId;
  },
});

// Update an existing pump
export const updatePump = mutation({
  args: {
    id: v.id("pumpInfo"),
    pumpName: v.optional(v.string()),
    type: v.optional(v.string()),
    area: v.optional(v.string()),
    latitude: v.optional(v.float64()),
    longitude: v.optional(v.float64()),
    flowRate: v.optional(v.number()),
    offSet: v.optional(v.number()),
    current_pressure: v.optional(v.number()),
    min_pressure: v.optional(v.number()),
    max_pressure: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
    });
    return id;
  },
});

// Delete a pump
export const deletePump = mutation({
  args: {
    id: v.id("pumpInfo"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

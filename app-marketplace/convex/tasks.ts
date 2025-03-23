import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  tasks: defineTable({
    name: v.string(),
    firebasePath: v.string(),
    status: v.union(v.literal("queued"), v.literal("training"), v.literal("done")),
  }),
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("tasks").collect()).map(task => ({
      id: task._id,
      name: task.name,
      status: task.status,
      firebasePath: task.firebasePath,
      date: new Date(task._creationTime).toISOString().split('T')[0],
    }));
  }
});

export const getFireBasePathById = query({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = (await ctx.db.query("tasks").collect())
    .filter(task => task._id == args.id)[0];

    console.log(task);

    return task.firebasePath;

  }
});


export const createJob = mutation({
  args: {
    name: v.string(),
    firebasePath: v.string(),
    status: v.union(v.literal("queued"), v.literal("training"), v.literal("done")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      name: args.name,
      firebasePath: args.firebasePath,
      status: args.status,
    });
  }
})

export const getJobs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  }
})

export const updateJob = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(v.literal("queued"), v.literal("training"), v.literal("done")),
  },

  handler: async (ctx, args) => {
    const id = args.id;
    return await ctx.db.patch(id, { status: args.status });
  }
})


export const getTrainingModels = query({
  args: {
  },
  handler: async (ctx, args) => {
    return (await ctx.db.query("tasks").collect())
    .filter(task => task.status === "training")
    .map(task => ({
      id: task._id
    }));
  }
});

export const createLogs = mutation({
  args: {
    model_id: v.id("tasks"),
    log: v.string()
  },
  handler(ctx, args) {
    return ctx.db.insert("logs", {
      log: args.log,
      model_id: args.model_id
    });
  },
});

export const getLogs = query({
  args:{
  },
  handler: async (ctx, args)=>{
    const models_id = (await ctx.db.query("tasks").collect())
    .filter(task => task.status == "training")
    .map(task => task._id)[0];

    const ans = (await ctx.db.query("logs").collect())
    .filter(log => log.model_id == models_id)
    .map(log => log.log);

    return ans
  }
})


export const createLoss = mutation({
  args: {
    model_id: v.id("tasks"),
    step: v.number(),
    loss: v.number(),
    max_steps: v.number(),
  },
  handler(ctx, args) {
    return ctx.db.insert("loss", {
      model_id: args.model_id,
      step: args.step,
      loss: args.loss,
      max_steps: args.max_steps
    });
  },
});


export const createEval = mutation({
  args: {
    model_id: v.id("tasks"),
    step: v.number(),
    loss: v.number(),
    max_steps: v.number(),
  },
  handler(ctx, args) {
    return ctx.db.insert("eval", {
      model_id: args.model_id,
      step: args.step,
      loss: args.loss,
      max_steps: args.max_steps
    });
  },
});


export const getMetrics = query({
  args: {},
  handler: async (ctx, args) => {
    const models_id = (await ctx.db.query("tasks").collect())
    .filter(task => task.status == "training")
    .map(task => task._id)[0];

    const [lossData, evalData] = await Promise.all([
      ctx.db.query("loss").collect(),
      ctx.db.query("eval").collect()
    ]);

    const metrics = new Map();

    lossData
      .filter(l => l.model_id === models_id)
      .forEach(l => {
        metrics.set(l.step, { step: l.step, loss: l.loss });
      });

    evalData
      .filter(e => e.model_id === models_id)
      .forEach(e => {
        const entry = metrics.get(e.step) || { step: e.step };
        entry.eval = e.loss;
        metrics.set(e.step, entry);
      });

    const combinedMetrics = Array.from(metrics.values());

    return combinedMetrics;
  }
})


export const getSteps = query({

  args: {},
  handler: async (ctx, args) => {
    const models_id = (await ctx.db.query("tasks").collect())
    .filter(task => task.status == "training")
    .map(task => task._id)[0];

    const lossData = (await ctx.db.query("loss").collect())
    .filter(l => l.model_id === models_id);

    let ans;
    if(lossData.length == 0){
      ans = {
        currentStep: 0,
        totalSteps: 0
      }
    }
    else {
      ans = {
        currentStep: lossData[lossData.length - 1].step,
        totalSteps: lossData[lossData.length - 1].max_steps
      }
    }
    console.log("ans", ans);
    return ans;

  }

})

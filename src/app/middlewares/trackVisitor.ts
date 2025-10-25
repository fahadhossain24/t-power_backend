import Visitor from "../modules/visitorModule/visitor.model";
import { NextFunction, Request, Response } from "express";

export const trackVisitor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"] || "unknown";

    const existingVisitor = await Visitor.findOne({ ip, userAgent });

    if (existingVisitor) {
      existingVisitor.visitCount += 1;
      existingVisitor.lastVisitedAt = new Date();
      await existingVisitor.save();
    } else {
      await Visitor.create({ ip, userAgent });
    }

    next();
  } catch (error) {
    console.error("Visitor tracking error:", error);
    next();
  }
};



// import Visitor from "../modules/visitorModule/visitor.model";
// import { NextFunction, Request, Response } from "express";

// export const trackVisitor = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString();
//     const userAgent = req.headers["user-agent"] || "unknown";

//     const existingVisitor = await Visitor.findOne({ ip, userAgent });

//     if (existingVisitor) {
//       const now = new Date();
//       const lastVisit = existingVisitor.lastVisitedAt || new Date(0);
//       const hoursSinceLastVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60);

//       // Only increment if more than 24h since last visit
//       if (hoursSinceLastVisit >= 24) {
//         existingVisitor.visitCount += 1;
//         existingVisitor.lastVisitedAt = now;
//         await existingVisitor.save();
//       }
//     } else {
//       await Visitor.create({
//         ip,
//         userAgent,
//         visitCount: 1,
//         lastVisitedAt: new Date(),
//       });
//     }

//     next();
//   } catch (error) {
//     console.error("Visitor tracking error:", error);
//     next();
//   }
// };


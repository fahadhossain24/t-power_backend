import { Request, Response } from "express";
import asyncHandler from "../../../shared/asyncHandler";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import Product from "../productModule/product.model";
import Query from "../queryModule/query.model";
import Visitor from "../visitorModule/visitor.model";

const retrieveDashboardMetrics = asyncHandler(async (req: Request, res: Response) => {
  const year = parseInt(req.query.year as string, 10) || new Date().getFullYear();

  try {
    // Get total counts
    const [totalQueries, totalProducts, totalVisitors] = await Promise.all([
      Query.countDocuments(),
      Product.countDocuments({ isDeleted: false }),
      Visitor.countDocuments(),
    ]);

    // Month-wise visitor growth
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const visitorGrowth = Array(12).fill(0);

    const visitorsByMonth = await Visitor.aggregate([
      { $match: { createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
    ]);

    visitorsByMonth.forEach(({ _id, count }: { _id: number; count: number }) => {
      visitorGrowth[_id - 1] = count;
    });

    // Normalize data for smooth chart scaling
    const maxVisitors = Math.max(...visitorGrowth) || 1;
    const normalizedVisitorRatio = visitorGrowth.map((count) => (count / maxVisitors) * 100);

    // Query vs Visitor ratio chart
    const visitorQueryRatio = {
      totalVisitors,
      totalQueries,
    };

    // Fetch NEW (unread) queries as recent activities
    const newQueries = await Query.find({ isRead: false })
      .sort({ createdAt: -1 })
      .select("-updatedAt -__v -productRef -isRead");

    const responseData = {
      totalQueries,
      totalProducts,
      totalVisitors,
      chartData: {
        months,
        visitorRatio: normalizedVisitorRatio,
        visitorQueryRatio,
      },
      newQueries,
    };

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: "success",
      message: "Dashboard metrics retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "error",
      message: "Failed to retrieve dashboard metrics.",
      data: null,
    });
  }
});

export default {
  retrieveDashboardMetrics,
};

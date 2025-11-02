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
    // Total counts
    const [totalQueries, totalProducts, totalVisitors] = await Promise.all([
      Query.countDocuments(),
      Product.countDocuments({ isDeleted: false }),
      Visitor.countDocuments(),
    ]);

    // Month names for the line chart
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const visitorGrowth = Array(12).fill(0);

    // Aggregate visitor count per month
    const visitorsByMonth = await Visitor.aggregate([
      { $match: { createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
    ]);

    visitorsByMonth.forEach(({ _id, count }: { _id: number; count: number }) => {
      visitorGrowth[_id - 1] = count;
    });

    // Prepare line chart data for frontend
    const lineData = months.map((month, index) => ({
      name: month,
      uv: visitorGrowth[index],
    }));

    // Prepare donut chart data for frontend
    const donutData = [
      { name: "Visitors", value: totalVisitors, color: "#1BAE70" }, // green
      { name: "Queries", value: totalQueries, color: "#FF8DAA" },   // pink
      { name: "Other", value: Math.max(totalVisitors - totalQueries, 0), color: "#A3A8B3" }, // gray
    ];

    // Fetch unread (new) queries
    const newQueries = await Query.find({ isRead: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email subject message createdAt");

    const responseData = {
      totalQueries,
      totalProducts,
      totalVisitors,
      lineData,   // frontend line chart
      donutData,  // frontend donut chart
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

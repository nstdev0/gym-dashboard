import { Request, Response } from "express";
import { getMembersService } from "../../../features/services/members/get-members.service";

export const getMembersController = async (req: Request, res: Response) => {
    try {
        const members = await getMembersService();

        if (!members) {
            return res.status(404).json({
                success: false,
                message: "Members not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Members fetched successfully",
            members: members
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching members",
            error
        });
    }
}
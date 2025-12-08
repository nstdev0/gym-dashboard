import { Request, Response } from "express";
import { getMemberService } from "../../../features/services/members/get-member.service";

export const getMemberController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const member = await getMemberService(id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Member fetched successfully",
            member: member
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching member",
            error
        });
    }
}
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { userSkills, targetSkills } = await req.json();

    const intersection = userSkills.filter((skill: string) => 
        targetSkills.includes(skill)
    ).length;

    const union = new Set([...userSkills, ...targetSkills]).size;

    return NextResponse.json({
        score: intersection / union
    });
}
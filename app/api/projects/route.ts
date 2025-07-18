import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

const DB_URI = process.env.DB_URI!;
if (!DB_URI) {
    console.log("No database link");
}


export async function GET(req: NextRequest) {
    const pgClient = new Client(DB_URI)

    try {
        await pgClient.connect();

        const projectsQuery = `select *  from projects`;
        let response = await pgClient.query(projectsQuery);

        // console.log(response);

        return NextResponse.json({
            success: true,
            projects : response.rows
        })

    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                error: 'Error fetching Projects',
                success: false
            },
            { status: 500 },
        )
    } finally {
        try {
            await pgClient.end(); // Ensure connection is closed even if there's an error
        } catch (closeErr) {
            console.error('Error closing database connection:', closeErr);
        }
    }


}
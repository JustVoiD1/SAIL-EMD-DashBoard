import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

const DB_URI = process.env.DB_URI!;
if (!DB_URI) {
    console.log("No database link");
}
const JWT_SECRET = process.env.JWT_SECRET!;


export async function GET(req: NextRequest) {
    const pgClient = new Client(DB_URI)

    try {
        
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '') || req.cookies.get('token')?.value;
        
        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'No token found'
                },
                { status: 401 },
            )
        }
        
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId || payload.id;
        
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid token in Payload"
                },
                {status : 401}
            )
        }
        await pgClient.connect();

        const projectsQuery = `select *  from projects where worker_id = $1`;
        let response = await pgClient.query(projectsQuery, [userId]);


        // console.log(response);

        return NextResponse.json({
            success: true,
            projects: response.rows
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
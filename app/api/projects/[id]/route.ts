import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server"
import { Client } from "pg"

const DB_URI = process.env.DB_URI!
const JWT_SECRET = process.env.JWT_SECRET!

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const pgClient = new Client(DB_URI);

    try {

        const { id } = await params;
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', "") || req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'No tokens found' },
                { status: 401 },
            );


        }
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const userId = payload.id || payload.userId;

        await pgClient.connect();

        const { title, description, region, type, status, progress, start_date, end_date, image_url, video_url, stage_ii_wo, bill_released, remark } = await req.json();

        if (!title || !description == null || !region || !type) {
            return NextResponse.json(
                { success: false, error: 'Title, description, region, and type are required' },
                { status: 400 }
            );
        }

        const updateQuery = `update projects set title = $1, description = $2, region = $3, type = $4, status = $5, progress = $6, start_date = $7, end_date = $8, image_url = $9, video_url = $10, stage_ii_wo = $11, bill_released = $12, remark = $13, updated_at = CURRENT_TIMESTAMP where id = $14 and worker_id = $15 returning *`;

        const result = await pgClient.query(updateQuery, [
            title,
            description,
            region,
            type,
            status,
            progress,
            start_date,
            end_date,
            image_url,
            video_url,
            stage_ii_wo,
            bill_released,
            remark,
            id,
            userId
        ]);

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Project update failed' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                project: result.rows[0]
            }
        )



    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, error: 'Project update failed' },
            { status: 500 }
        );
    }
    finally {
        try {
            await pgClient.end();

        }
        catch (closeErr) {
            console.error('Closing error ', closeErr)
        }
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const pgClient = new Client(DB_URI)

    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', "") || req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'No tokens found' },
                { status: 401 },
            );


        }
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const userId = payload.id || payload.userId;

        await pgClient.connect();
        const deleteQuery = `delete from projects where id = $1 and worker_id = $2 returning id, title`;

        const { id } = await params;
        const result = await pgClient.query(deleteQuery, [id, userId]);

        if (result.rows.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Project not found'
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: `Project : "${result.rows[0].title}" deleted successfully`
            }
        )

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {
                success: false,
                error: 'Error deleting project'
            },
            { status: 500 }
        )
    } finally {
        try {
            await pgClient.end()
        } catch (closeErrr) {
            console.error('Closing error ', closeErrr)
        }

    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const pgClient = new Client(DB_URI);
    try {
        const { id } = await params;
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.replace("Bearer ", "") || req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: "No token Found" },
                { status: 401 }
            );
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id || payload.userId;

        await pgClient.connect();

        const selectQuery = `select * from projects where id = $1 and worker_id = $2`;
        //id from params, userid from token payload
        const result = await pgClient.query(selectQuery, [id, userId]);

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: "Project Not Found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                project: result.rows[0]
            },
            {status  : 200}
            
        );

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, error: 'Error Fetching Project' },
            { status: 500 }
        )
    } finally {
        try {
            await pgClient.end();
        } catch (closeErr) {
            console.error('Closing Erro : ', closeErr);
        }
    }

}

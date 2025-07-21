import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server"
import { Client } from "pg"

const DB_URI = process.env.DB_URI!
const JWT_SECRET = process.env.JWT_SECRET!

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

        const { title, oneliner, progress, start_date, end_date, image_url, video_url } = await req.json();

        const updateQUery = `update projects
        set title = $1, oneliner=$2, progress=$3, start_date=$4, end_date=$5, image_url=$6, video_url=$7, updated_at=CURRENT_TIMESTAMP where id=$8 and worker_id=$9 returning *`;

        const result = await pgClient.query(updateQUery, [title, oneliner, progress, start_date, end_date, image_url, video_url,
            id, userId]);

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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {

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

        const result = await pgClient.query(deleteQuery, [params.id, userId]);

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
                success : false,
                error : 'Error deleting project'
            },
            {status : 500}
        )
    } finally {
        try{
            await pgClient.end()
        } catch (closeErrr) {
            console.error('Closing error ', closeErrr)
        }

    }
}
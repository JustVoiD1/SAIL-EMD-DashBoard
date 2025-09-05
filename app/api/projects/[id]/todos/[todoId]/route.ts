import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";


const DB_URI = process.env.DB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

// get all todos of a project
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string, todoId: string }> }) {
    const { id, todoId } = await params;
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
                {
                    status: 401
                }
            );

        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId;

        const { title, description, priority, due_date, is_done } = await req.json();

        await pgClient.connect();
        const verifyQuery = `
        select pt.id from project_todos as pt join projects p on pt.project_id = p.id 
        where pt.id = $1 and p.id = $2 and p.worker_id = $3
        `;
        const verifyResult = await pgClient.query(verifyQuery, [todoId, id, userId]);

        if (verifyResult.rows.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Todo not found'
                },
                {
                    status: 404
                }
            );
        }

        const updateQuery = `update project_todos 
        set title = $1, description = $2, priority = $3, due_date = $4, is_done = $5, 
        updated_at = CURRENT_TIMESTAMP 
        where id = $6 
        returning *`;

        const updateResult = await pgClient.query(updateQuery,
            [title, description, priority, due_date, is_done, todoId]
        );

        return NextResponse.json(
            {
                success: true,
                todo: updateResult.rows[0]
            },
            {
                status: 200
            }
        );



    } catch (err) {
        console.error('Error updating todo : ', err);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update todo'
            },
            {
                status: 500
            }
        );
    } finally {
        await pgClient.end();
    }

}
// post a todo
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string, todoId : string }> }) {
    const { id, todoId } = await params;
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
                {
                    status: 401
                }
            );

        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId;

        await pgClient.connect();

        const deleteQUery = `delete from project_todos as pt 
        using projects as p
        where pt.id = $1 and pt.project_id = p.id and p.id = $2 and worker_id = $3 
        returning pt.id
        `;
        const deleteResult = await pgClient.query(deleteQUery, [todoId, id, userId]);

        
        if(deleteResult.rows.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Todo not found'
                },
                {
                    status: 404
                }
            );
        }


        return NextResponse.json(
            {
                success: true,
                message: 'Todo deleted successfully'
            },
            {
                status: 200
            }
        );


    } catch (err) {
        console.error('Error deleting todo', err);
        return NextResponse.json(
            {
                success: false,
                error: 'failed to delete todo'
            },
            {
                status: 500
            }
        );

    } finally {
        await pgClient.end();
    }
}
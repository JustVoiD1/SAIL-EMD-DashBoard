import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";


const DB_URI = process.env.DB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

// get all todos of a project
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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

        const projectQuery = 'select id from projects where id = $1 and worker_id = $2';
        const projectResult = await pgClient.query(projectQuery, [id, userId]);

        if (projectResult.rows.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Project not found'
                },
                {
                    status: 404
                }
            );
        }

        const todosQuery = 'select * from project_todos where project_id = $1 order by created_at desc';
        const todoResult = await pgClient.query(todosQuery, [id]);

        return NextResponse.json(
            {
                success: true,
                todos: todoResult.rows
            },
            {
                status: 200
            }
        );



    } catch (err) {
        console.error('Error fetching todos : ', err);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch todos'
            },
            {
                status: 400
            }
        );
    } finally {
        await pgClient.end();
    }

}
// post a todo
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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

        const { title, description, priority, due_date } = await req.json();

        if (!title) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Title is required'
                },
                {
                    status: 401
                }
            );
        }

        await pgClient.connect();

        const projectQUery = 'select id from projects where id = $1 and worker_id = $2';
        const projectResult = await pgClient.query(projectQUery, [id, userId]);

        if (projectResult.rows.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Project Not found'
                },
                {
                    status: 401
                }
            );
        }
        const insertQuery = `insert into project_todos (project_id, title, description, priority, due_date) 
        values ($1, $2, $3, $4, $5) 
        returning *`;
        const insertResult = await pgClient.query(insertQuery, [id, title, description, priority || 'medium', due_date]);


        return NextResponse.json(
            {
                success: true,
                todo: insertResult.rows[0]
            },
            {
                status: 200
            }
        );


    } catch (err) {
        console.error('Error creating todo', err);
        return NextResponse.json(
            {
                success: false,
                error: 'failed to create todo'
            },
            {
                status: 500
            }
        );

    } finally {
        await pgClient.end();
    }
}
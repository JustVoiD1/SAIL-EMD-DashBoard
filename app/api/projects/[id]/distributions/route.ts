import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";


const DB_URI = process.env.DB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;


function getColorForCategory(category: string): string {
  const colors: { [key: string]: string } = {
    'Material': '#0088FE',
    'Labor': '#00C49F', 
    'Equipment': '#FFBB28',
    'Overhead': '#FF8042',
    'Transport': '#8884D8',
    'Other': '#82CA9D'
  };
  return colors[category] || '#666666';
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const pgClient = new Client(DB_URI)
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '') || req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({
                success: false,
                error: 'No token found'
            },
                {
                    status: 401
                }
            );
        }
        const secret = new TextEncoder().encode(JWT_SECRET)
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId;

        await pgClient.connect();

        const amountQuery = 'select stage_ii_wo from projects where id = $1 and worker_id = $2';
        const result = await pgClient.query(amountQuery, [id, userId])

        if (result.rows.length == 0) {
            return NextResponse.json({
                success: false,
                error: 'Project not found'
            },
                {
                    status: 404
                });
        }

        const distributionsQuery = 'select * from amount_distributions where project_id = $1 order by created_at desc'
        const distributionsResult = await pgClient.query(distributionsQuery, [id])

        const stageIIWO = parseFloat(result.rows[0].stage_ii_wo);
        const distributions = distributionsResult.rows;
        const totalDistributed = distributions.reduce((sum, dist) => 
            sum + parseFloat(dist.amount), 0
        );
        const undistributed = stageIIWO - totalDistributed;

        return NextResponse.json(
            {
                success : true,
                data : {
                    distributions,
                    totalDistributed,
                    undistributed,
                    stageIIWO,
                    pieData : [
                        ...distributions.map(dist => ({
                            name : dist.category,
                            value : parseFloat(dist.amount),
                            color : getColorForCategory(dist.category)
                        })),
                        ...(undistributed > 0 ?[{
                            name : 'Undistributed',
                            value : undistributed,
                            color : '#9CA3AF'
                        }] : [])
                    ]

                }
            }
        )



    } catch (err) {
        console.error('Error fetching distributions: ', err);
        return NextResponse.json(
            {
                success : false,
                error : 'Failed fetching distributions'
            },
            {
                status : 200
            }
        )

    } finally {
        await pgClient.end();
    }
}

export async function POST(req : NextRequest, {params} : {params : Promise<{id : string}>}){
    const { id } = await params;
    const pgClient = new Client(DB_URI)
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '') || req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({
                success: false,
                error: 'No token found'
            },
                {
                    status: 401
                }
            );
        }

        const secret = new TextEncoder().encode(JWT_SECRET)
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId;

        const {category, amount, description } = await req.json();

        if(!category || !amount){
            return NextResponse.json(
                {
                    success : false,
                    error : 'Category and amount are required'
                },
                {
                    status : 500
                }
            );
        }

        await pgClient.connect();

        const projectQuery = 'select stage_ii_wo from projects where id=$1 and worker_id = $2'
        const projectResult = await pgClient.query(projectQuery, [id, userId]);
       
        if(projectResult.rows.length == 0){
            return NextResponse.json(
                {
                    success : false,
                    error : 'Project not found'
                },
                {
                    status : 404
                }
            );

        }

        const currentDistributionsQUery = 'select sum(amount) as total from amount_distributions where project_id = $1';
        const currentTotal = await pgClient.query(currentDistributionsQUery, [id])

        const existingTotal = parseFloat(currentTotal.rows[0].total || 0);
        const stageIIWO = parseFloat(projectResult.rows[0].stage_ii_wo);
        if(existingTotal + parseFloat(amount)>stageIIWO ){
            return NextResponse.json(
                {
                    success : false,
                    error : "Distribution amount cannot exceed WO amount"
                },
                {
                    status : 500
                }
            )
        }

        const insertQuery = `insert into amount_distributions (project_id, category, amount, description)
        values ($1, $2, $3, $4)
        returning *   
        `;

        const insertResult = await pgClient.query(insertQuery, [id, category, amount, description]);

        return NextResponse.json(
            {
                success : true,
                distribution : insertResult.rows[0]
            },
            {status : 200}
        );




    } catch(err){
        console.error('Error creating distribution : ', err);
        return NextResponse.json(
            {
                success : false,
                errpr : 'Failed to create distribution'
            },
            {status : 200}
        );
    } finally {
        await pgClient.end();
    }
    
}
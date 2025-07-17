import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Client } from "pg";

const DB_URI = process.env.DB_URI!;
if (!DB_URI) {
    console.log("No database link");
}

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
    console.log("no jwt secret");
}

export async function POST(req: NextRequest) {
    const pgClient = new Client(DB_URI);
    
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and Password are necessary" },
                { status: 400 }
            );
        }

        await pgClient.connect();

        const searchQuery = `select id, username, password from admins where username = $1`;

        let response = await pgClient.query(searchQuery, [username]);
        
        // No such user exists
        if (response.rows.length === 0) {
            return NextResponse.json(
                { error: "Invalid Credentials" },
                { status: 401 }
            );
        }

        const user = response.rows[0];

        const passwordValidity = await bcrypt.compare(password, user.password);

        if (!passwordValidity) {
            return NextResponse.json(
                { error: 'Invalid Credentials' },
                { status: 401 }
            );
        }

        const token = jwt.sign({
            userId: user.id,
            username: user.username
        }, JWT_SECRET, {
            expiresIn: '24h'
        });

        return NextResponse.json({
            message: "Signed In Successfully",
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { error: 'Server Error' },
            { status: 500 }
        );
    } finally {
        await pgClient.end();
    }
}

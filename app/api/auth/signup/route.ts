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

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        // Validate username length
        if (username.length < 3) {
            return NextResponse.json(
                { error: "Username must be at least 3 characters long" },
                { status: 400 }
            );
        }

        await pgClient.connect();

        // Check if user already exists
        const checkUserQuery = `SELECT username FROM admins WHERE username = $1`;
        const existingUser = await pgClient.query(checkUserQuery, [username]);

        if (existingUser.rows.length > 0) {
            return NextResponse.json(
                { error: "Username already exists" },
                { status: 409 }
            );
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const insertQuery = `INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id, username`;
        const result = await pgClient.query(insertQuery, [username, hashedPassword]);

        const newUser = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: newUser.id,
                username: newUser.username
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return NextResponse.json({
            message: "Account created successfully",
            token,
            user: {
                id: newUser.id,
                username: newUser.username
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

import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB 연결 설정
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
  try {
    // 요청 본문을 안전하게 파싱
    const body = await req.text();
    if (!body) {
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 }
      );
    }

    let data;
    try {
      data = JSON.parse(body); // JSON 파싱
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const { user } = data; // 구조 분해 할당
    if (!user || !user.email || !user.password || !user.username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // MongoDB 연결
    await client.connect();
    const db = client.db("realworld");
    const usersCollection = db.collection("users");

    // 중복 확인
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // 새 사용자 저장
    const result = await usersCollection.insertOne(user);
    return NextResponse.json({
      message: "User registered successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close(); // 연결 닫기
  }
}

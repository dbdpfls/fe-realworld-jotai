import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // 위에서 만든 MongoDB 연결 코드 불러오기

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("test"); // 사용할 데이터베이스 이름
    const collection = db.collection("users"); // 사용할 컬렉션 이름

    const users = await collection.find({}).toArray(); // 모든 사용자 조회
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user } = body;

    if (!user || !user.email || !user.password || !user.username) {
      return NextResponse.json(
        { error: "필수 입력값이 누락되었습니다." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // 중복 이메일 체크
    const existingUser = await usersCollection.findOne({ email: user.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다." },
        { status: 400 }
      );
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // 새 사용자 저장 (암호화된 비밀번호 사용)
    const result = await usersCollection.insertOne({
      username: user.username,
      email: user.email,
      password: hashedPassword,
    });

    return NextResponse.json({
      message: "회원가입 성공",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  }
}

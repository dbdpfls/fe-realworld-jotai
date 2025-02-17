import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 환경 변수에서 JWT 시크릿 키 가져오기
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET 환경 변수가 설정되지 않았습니다.");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력하세요." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // 사용자 조회
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "잘못된 이메일 또는 비밀번호입니다." },
        { status: 401 }
      );
    }

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "잘못된 이메일 또는 비밀번호입니다." },
        { status: 401 }
      );
    }

    // JWT 생성
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // 페이로드
      JWT_SECRET, // 비밀키
      { expiresIn: "7d" } // 옵션: 7일간 유효
    );

    // 응답 반환 (토큰 전달)
    return NextResponse.json({
      message: "로그인 성공",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

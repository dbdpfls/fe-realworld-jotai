import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // .env.local에서 환경 변수 가져오기
if (!uri) {
  throw new Error("❌ MONGODB_URI 환경 변수가 설정되지 않았습니다.");
}

const client = new MongoClient(uri);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // 개발 환경에서는 클라이언트를 전역 객체에 저장하여 핫 리로딩 시 유지
  if (!(global as any)._mongoClientPromise) {
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // 프로덕션 환경에서는 새로운 클라이언트를 생성
  clientPromise = client.connect();
}

export default clientPromise;

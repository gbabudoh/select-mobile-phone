import { NextRequest, NextResponse } from "next/server";
import { uploadFile, getDownloadUrl } from "@/lib/minio";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    
    await uploadFile(fileName, buffer, {
      "Content-Type": file.type,
      "Uploaded-By": (session.user as { id: string }).id,
    });

    const url = await getDownloadUrl(fileName);

    return NextResponse.json({ 
      success: true, 
      fileName, 
      url 
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

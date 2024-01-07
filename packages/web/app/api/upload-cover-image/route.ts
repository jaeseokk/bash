import { supabase } from "@/server/clients";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

const uploadCoverImage = async (file: File) => {
  const fileName = nanoid();
  const fileExtension = file.name.split(".").pop();
  const { data, error } = await supabase.storage
    .from("custom-cover-images")
    .upload(`${fileName}.${fileExtension}`, file, {
      contentType: "image/*",
    });

  if (error) {
    throw error;
  }

  return data;
};

export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.get("file") as File;

  if (!file) {
    return new NextResponse("File not found", { status: 400 });
  }

  try {
    const data = await uploadCoverImage(file);
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json((e as Error).message, { status: 500 });
  }
}

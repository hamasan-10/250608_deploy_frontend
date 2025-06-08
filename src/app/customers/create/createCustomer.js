"use server";
import { revalidatePath } from "next/cache";

// prevState は useFormState から渡される前の状態
export default async function createCustomer(prevState, formData) {
  const creating_customer_name = formData.get("customer_name");
  const creating_customer_id = formData.get("customer_id");
  const raw_age = formData.get("age"); // ageの型変換も考慮
  const creating_gender = formData.get("gender");

  if (!creating_customer_id || creating_customer_id.trim() === "") {
    return { message: "Customer IDは必須です。" }; // エラーメッセージをオブジェクトで返す
  }

  let parsed_age;
  if (raw_age && raw_age.trim() !== "") {
    parsed_age = parseInt(raw_age, 10);
    if (isNaN(parsed_age)) {
      return { message: "年齢は有効な数値を入力してください。" };
    }
  } else {
    // ageが必須かどうかに応じて。必須ならここでエラーを返す。
    // return { message: "年齢は必須です。" };
    parsed_age = null; // またはバックエンドの期待値に合わせる
  }

  const body_msg = JSON.stringify({
    customer_name: creating_customer_name,
    customer_id: creating_customer_id,
    age: parsed_age,
    gender: creating_gender,
  });

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + `/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body_msg,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // JSONパース失敗も考慮
      return { message: errorData.detail || `API Error: ${res.status}` };
    }

    revalidatePath(`/customers`);
    return { message: "顧客情報が正常に作成されました。", success: true }; // 成功時
  } catch (error) {
    // fetch自体のネットワークエラーなど
    return { message: `An unexpected error occurred: ${error.message || "Unknown network error"}` };
  }
}
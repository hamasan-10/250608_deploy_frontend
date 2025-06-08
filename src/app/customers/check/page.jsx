// page.jsx の修正案

'use client'; // ← このままでも良いですが、サーバーコンポーネントでは不要な場合もあります。一旦残しておきましょう。
export const dynamic = 'force-dynamic';

import OneCustomerInfoCard from "@/app/components/one_customer_info_card.jsx";

async function fetchCustomer(id) {
  // ... (この関数は変更なし)
}

// ページのPropsの受け取り方を変更
export default async function ReadPage({ searchParams }) { 
  const id = searchParams.customer_id; // queryからsearchParamsに変更

  // idが存在しない場合は、何も表示しないか、ローディング表示をする
  if (!id) {
    return <div>Loading or invalid customer ID...</div>;
  }

  const customerInfo = await fetchCustomer(id);

  return (
    <>
      <div className="alert alert-success">更新しました</div>
      <div className="card bordered bg-white border-blue-200 max-w-sm m-4">
        {/* customerInfoが存在し、かつデータがあることを確認 */}
        {customerInfo && customerInfo.length > 0 && (
          <OneCustomerInfoCard {...customerInfo[0]} />
        )}
      </div>
      <button className="btn btn-outline btn-accent">
        <a href="/customers">一覧に戻る</a>
      </button>
    </>
  );
}
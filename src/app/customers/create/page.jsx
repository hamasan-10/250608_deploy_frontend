// app/customers/create/page.jsx
'use client';

import { useRef, useEffect } from 'react'; // useState は useFormState が代わりになる部分がある
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom'; // これらをインポート
import createCustomer from './createCustomer';

const initialState = { // useFormState の初期状態
  message: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary m-4 text-2xl" disabled={pending}>
      {pending ? '作成中...' : '作成'}
    </button>
  );
}

export default function CreatePage() {
  const formRef = useRef();
  const router = useRouter();
  // useFormState を使う
  const [state, formAction] = useFormState(createCustomer, initialState);

  useEffect(() => {
    if (state?.success) { // サーバーアクションが success: true を返した場合
      alert(state.message); // 成功メッセージ (例: "顧客情報が正常に作成されました。")
      router.push('/customers');
    } else if (state?.message) { // エラーメッセージがある場合
      // state.message を使ってUIにエラーを表示する (下のJSXで表示)
      // alert(`エラー: ${state.message}`); // デバッグ用にalertも可
    }
  }, [state, router]); // stateが変更されたら実行

  return (
    <>
      <div className="card bordered bg-white border-blue-200 border-2 max-w-md m-4">
        <div className="m-4 card bordered bg-blue-200 duration-200 hover:border-r-red">
          {/* formのactionにuseFormStateから得たformActionを渡す */}
          {/* ref は useFormState を使う場合は必須ではないことが多いが、リセットなどに使える */}
          <form ref={formRef} action={formAction}> 
            <div className="card-body">
              <h2 className="card-title">
                <p>
                  <input type="text" name="customer_name" placeholder="桃太郎" className="input input-bordered"/>
                </p>
              </h2>
              <p>
                Customer ID:
                <input type="text" name="customer_id" placeholder="C030" className="input input-bordered"/>
              </p>
              <p>
                Age:
                <input type="number" name="age" placeholder="30" className="input input-bordered"/>
              </p>
              <p>
                Gender:
                <input type="text" name="gender" placeholder="女" className="input input-bordered"/>
              </p>
            </div>

            {/* useFormStateからのエラーメッセージ表示 */}
            {state?.message && !state.success && (
              <div className="alert alert-error shadow-lg m-4">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>エラー: {state.message}</span>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <SubmitButton /> {/* 送信ボタンコンポーネント */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
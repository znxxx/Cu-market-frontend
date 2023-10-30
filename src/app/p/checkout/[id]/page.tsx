"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function BuyingConclusionPage({ params }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [error, setError] = useState(false);

  const { data: session, status } = useSession();
  const access_token = session?.user.access_token;
  const access_paotungToken = session?.user.paotungToken;
  const [lightbulb, setLightbulb] = useState<number | null>(null);

  async function
  const resProduct = await axios.get(
    `https://localhost:4000/product/details/${params.id}`
  ,{
    headers: {Authorization: `Bearer ${access_token}`},
  });


  const receiverId = "";
  const endPrice = "";

  async function handlePay(e) {
    e.preventDefault();

    const res = await axios.post(
      `https://paotooong.thinc.in.th/v1/wallet/pay/${receiverId}`,
      {
        headers: { Authorization: `Bearer ${access_paotungToken}` },
        body: JSON.stringify({
          id: receiverId, //input pleasepay id (see at paotung website please pay id เอามาจาก backend)
          amount: endPrice,
        }),
      }
    );

    if (res.status === 200) {
      setAlreadyPaid(true);
      return;
    } else {
      setError(true);
    }
  }

  return (
    <div className="bg-[#353966] h-full flex text-stone-100">
      <div>Product</div>
      <div className="flex flex-col">
        <div>Pay with Paotung</div>
        <form className="flex flex-col">
          <label className="ml-7 mt-3">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="ml-7 mt-3">Password</label>
          <input
            type="text"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={(e) => handlePay(e)}>Pay</button>
        </form>
      </div>
    </div>
  );
}
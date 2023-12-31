"use client";
"use strict";
import React, { useState } from "react";
import Image from "next/image";
import Navbar from "../../../../../components/Navbar";
import { useEffect } from "react";
import { useCountdown } from "../../../../../components/hooks/countdown";
import io from "socket.io-client";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Win from "../../../../../components/won";

function Bidpage({ params }) {
  // console.log(params.id);
  const [showWinComponent, setShowWinComponent] = useState(false);
  const { data: session, status } = useSession();
  const access_token = session?.user.access_token;
  const access_studentId = session?.user.studentId;

  const [product, setProduct] = useState({});
  const [expire, setExpire] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [socket, setSocket] = useState(null);
  const [biddingData, setBiddingData] = useState({});
  const [bidAmount, setBidAmount] = useState(0);
  const [rating, setRating] = useState(0);

  const loadData = async () => {
    await getData();
    await getReview();
    // console.log(product);
  };

  const router = useRouter();

  const linkPage = (page: string) => {
    router.push(page);
  };

  const [days, hours, minutes, seconds] = useCountdown(expire);

  useEffect(() => {
    const socket = io("http://localhost:4000/auction");
    setSocket(socket);
    socket.emit("enterRoom", `bid-${params.id}`);

    socket.on("biddingData", (data) => {
      const {
        room,
        sellerStudentId,
        startPrice,
        currentBidder,
        currentPrice,
        bidHistory,
      } = data;
      setBiddingData(data);
    });

    socket.on("newBidReceived", (data) => {
      //   console.log("Received new bid data:", data);
      setBiddingData((prevData) => ({
        ...prevData,
        currentPrice: data.currentPrice,
        bidHistory: data.bidHistory,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [biddingData]);

  const handleBid = () => {
    const bidAmountNumber = Number(bidAmount);

    if (bidAmountNumber <= biddingData?.currentPrice) {
      Swal.fire({
        title: "Bid error",
        text: "Bid amount cannot be lower than or equal to the current price",
        icon: "error",
        background: "#40477B",
        color: "#F5F1F0",
        iconColor: "#FF8BBC",
        confirmButtonColor: "#FF8BBC",
      });
      return; // Stop the bidding process
    }
    const bidData = {
      room: `bid-${params.id}`,
      bidderId: access_studentId,
      bidPrice: Number(bidAmount),
    };
    socket.emit("newBid", bidData);
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: "Bid successful",
      background: "#40477B",
      color: "#F5F1F0",
      iconColor: "#FF8BBC",
    });
  };

  function getData() {
    fetch(`http://localhost:4000/product/details/${params.id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setProduct(response);
        setExpire(response?.expiryTime);
      })
      .catch((err) => {
        console.error("err", err);
      })
      .finally(() => {
        // console.log(product);
      });
  }
  function getReview() {
    fetch(`http://localhost:4000/review/star/${product?.studentId}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        setRating(res);
      })
      .catch((err) => {
        console.error("err", err);
      })
      .finally(() => {
        // console.log(product);
      });
  }
  useEffect(() => {
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      const highestBidder = biddingData?.bidHistory?.at(0).studentId;
      if (access_studentId === highestBidder) {
        setTimeout(() => {
          setShowWinComponent(true);
        }, 10000);
        socket.emit("bidEnd", `bid-${params.id}`);
        linkPage(`/p/checkout/${params.id}`);
      } else {
        setTimeout(() => {
          setShowWinComponent(false);
        }, 10000);
        socket.emit("bidEnd", `bid-${params.id}`);
        linkPage("/u");
      }
    } else if (days < -2 || hours < -2 || minutes < -2 || seconds < -2) {
      socket.emit("bidEnd", `bid-${params.id}`);
      linkPage("/notfound");
    }
  }, [days, hours, minutes, seconds, biddingData]);

  // console.log(product.image?.at(0));
  // console.log(biddingData?.bidHistory?.at(0).studentId);
  // console.log(access_studentId === biddingData?.bidHistory?.at(0).studentId);
  // console.log(access_studentId);
  // console.log(biddingData?.bidHistory?.at(0).studentId);

  // console.log(rating);
  useEffect(() => {
    if (status === "loading") return;
    getData();
  }, [status]);
  useEffect(() => {
    if (product) {
      getReview();
    }
  }, [product]);

  return (
    <>
      {showWinComponent ? (
        <Win />
      ) : (
        <div className="bg-[#353966] flex flex-col">
          <header className="border self-stretch flex w-full pb-0 flex-col pt-4 border-solid border-black max-md:max-w-full">
            {/* <Navbar /> */}
          </header>
          <section className="self-center w-full max-w-[1374px] 2xl:max-w-[1700px] mt-12 max-md:max-w-full max-md:mt-10">
            <div className="2xl:gap-40 lg:gap-16 md:gap-16 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
              <div className="flex flex-col items-stretch w-[44%] max-md:w-full max-md:ml-0">
                <div className="shadow-[8px_8px_15px_5px_rgba(0,0,0,0.15)] bg-[#40477B] flex grow flex-col w-full mx-auto pt-5 pb-1.5 rounded-3xl max-md:max-w-full max-md:mt-10">
                  <h1 className="text-stone-100 text-5xl font-extrabold max-w-[543px] ml-5 max-md:text-4xl max-md:ml-2.5 mb-3">
                    {product?.productName}
                  </h1>
                  <div className="flex bg-white grow">
                    <Image
                      src={product.image?.at(0).url}
                      className="overflow-hidden w-[750px] h-[440px] object-cover flex self-center justify-center items-center"
                      alt="Product Image"
                      width={750}
                      height={360}
                    />
                  </div>
                  <div className="flex flex-auto justify-center">
                    <div className="flex max-w-full items-center justify-center gap-3 mt-2 max-md:justify-center max-md:ml-1.5">
                      <div className="">
                        <Image
                          src="/images/Rectangle 22.png"
                          alt="sample"
                          className="self-center"
                          width={100}
                          height={65}
                        />
                      </div>
                      <div className="">
                        <Image
                          src="/images/Rectangle 22.png"
                          alt="sample"
                          className="self-center"
                          width={100}
                          height={65}
                        />
                      </div>
                      <div className="">
                        <Image
                          src="/images/Rectangle 22.png"
                          alt="sample"
                          className="self-center"
                          width={100}
                          height={65}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch w-[56%] ml-5 max-md:w-full max-md:ml-0">
                <div className="flex flex-col max-md:max-w-full max-md:mt-10">
                  <div className="flex w-[400px] max-w-full items-start gap-4 max-md:ml-1.5">
                    <div className="rounded-full bg-[#FF8BBC] w-[70px] h-[70px] flex items-center justify-center shadow-black shadow-inner">
                      <Image
                        src="/images/icons/Light-bulb.svg"
                        alt="logo"
                        className=""
                        width={55}
                        height={55}
                      />
                    </div>
                    <div className="text-stone-100 text-3xl font-semibold self-center my-auto">
                      start at {product?.startPrice} bulbs
                    </div>
                  </div>
                  <div className="text-black text-xl self-stretch grow bg-stone-100 mt-4 pl-3.5 pr-5 pt-4 pb-8 rounded-3xl max-md:max-w-full">
                    {product?.description}
                  </div>
                  <div className="shadow-[6px_10px_30px_0px_rgba(69,13,37,0.20)_inset,3px_4px_7px_0px_rgba(0,0,0,0.20)_inset] self-stretch mt-8 pr-6 rounded-[120px] max-md:max-w-full bg-gradient-to-l from-[#6A5AFA] from-4% to-[#FF8BBC] to-68%">
                    <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                      <div className="flex flex-col items-stretch w-[37%] max-md:w-full max-md:ml-0">
                        <div className="grow rounded-full bg-[#FF8BBC] w-[251px] h-[244px] flex flex-col items-center justify-center shadow-[#FF8BBC] drop-shadow-2xl shadow-inner gap-3">
                          <Image
                            src="/images/icons/Light-bulb.svg"
                            alt="logo"
                            className=""
                            width={101}
                            height={99}
                          />
                          <h1 className="text-5xl font-bold text-white">
                            {biddingData
                              ? biddingData?.currentPrice
                              : "Loading..."}
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-col items-stretch w-[63%] max-md:w-full max-md:ml-0">
                        <div className="flex flex-col my-auto max-md:max-w-full max-md:mt-10">
                          <div className="text-stone-100 text-center text-4xl font-semibold self-center -ml-11">
                            Time Left
                          </div>
                          <div className="text-stone-100 text-center text-5xl font-bold -ml-0.5 -mr-1 mt-5 pr-10 max-md:max-w-full max-md:text-4xl max-md:mr-2">
                            <p>
                              {days} : {hours} : {minutes} : {seconds}
                            </p>
                          </div>
                          <div className="self-center flex mt-0 max-w-full items-start justify-between gap-7 max-md:justify-center max-md:ml-2.5">
                            <div className="text-stone-100 text-xl font-medium -ml-5">
                              Days
                            </div>
                            <div className="text-stone-100 text-xl font-medium">
                              Hours
                            </div>
                            <div className="text-stone-100 text-xl font-medium">
                              Minutes
                            </div>
                            <div className="text-stone-100 text-xl font-medium">
                              Seconds
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <section
                  className="bg-indigo-500 flex items-start justify-between gap-5 pl-7 pr-1.5 rounded-[50px] max-md:flex-wrap my-6 w-[537px] h-[58px] ml-32 2xl:ml-48 mt-6"
                  aria-label="Bid Component"
                >
                  <input
                    type="text"
                    className="justify-start grow text-neutral-300 text-xl font-medium flex-1 my-auto mx-auto bg-indigo-500 rounded-[50px] py-3 px-auto border-transparent focus:border-transparent focus:ring-0 text-center focus:outline-none"
                    placeholder="Type in the amount"
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                  <button
                    className="text-stone-100 text-3xl font-bold shadow-[6px_10px_30px_0px_rgba(45,124,188,0.42)_inset,3px_4px_7px_0px_rgba(0,0,0,0.20)_inset] bg-[#40A9FD] flex-1 mt-1.5 rounded-[50px] h-[47px]"
                    onClick={handleBid}
                  >
                    BIDDING
                  </button>
                </section>
              </div>
            </div>
          </section>
          <section className="self-center flex w-full max-w-[1374px] 2xl:max-w-[1700px] items-start justify-between mt-4 mb-8 px-5 max-md:max-w-full max-md:flex-wrap">
            <div className="flex flex-col items-start gap-3 mt-3.5">
              <div className="text-stone-100 text-center text-2xl font-semibold shadow-[6px_10px_30px_0px_rgba(45,124,188,0.42)_inset,3px_4px_7px_0px_rgba(0,0,0,0.20)_inset] bg-[#40A9FD] w-[178px] max-w-full h-[47px] pt-2 pb-3 px-5 rounded-[50px]">
                <p>subscribe</p>
              </div>
              <div className="flex flex-row gap-5 mt-3">
                <Image
                  src="/images/icons/CU Black Market icon.svg"
                  alt="profile-logo"
                  className=""
                  width={60}
                  height={60}
                />
                <div className="flex flex-col gap-2">
                  <div className="text-stone-100 font-black text-xl">
                    {product?.studentId}
                  </div>
                  <div className="flex flex-row">
                    {[...Array(5)].map((value, key) => (
                      <Image
                        src={`/images/icons/${
                          key + 1 <= rating
                            ? "Yellow Star.svg"
                            : "White Star.svg"
                        }`}
                        alt="White-star"
                        className="flex items-center cursor-pointer flex-row -m-1"
                        width={40}
                        height={40}
                      />
                    ))}
                    <p className="text-stone-100 text-base font-normal mt-[3px]">
                      ({rating})
                    </p>
                  </div>

                  {/* <div className="text-stone-100 font-black text-lg">rating: {rating}</div> */}
                </div>
              </div>

              {/* <Image
          alt="bookmark"
          src="/images/icons/bookmark.svg"
          width={55}
          height={55}
        /> */}
            </div>
            <div className="bg-[#40477B] flex flex-col w-[743px] rounded-3xl max-md:max-w-full">
              <div className="shadow-[4px_4px_6px_0px_rgba(0,0,0,0.20)_inset,2px_2px_8px_0px_rgba(0,0,0,0.20)_inset,4px_4px_8px_0px_rgba(0,0,0,0.25)] bg-[#6A5AFA] self-stretch flex flex-col w-full pb-2 rounded-3xl max-md:max-w-full">
                <div className="shadow-[4px_4px_6px_0px_rgba(0,0,0,0.20)_inset,2px_2px_8px_0px_rgba(0,0,0,0.20)_inset,4px_4px_8px_0px_rgba(0,0,0,0.25)] bg-[#40A9FD] self-stretch flex w-full items-start justify-between gap-5 pl-6 pr-7 pt-2 pb-2 rounded-3xl max-md:flex-wrap max-md:justify-center">
                  <div className="text-stone-100 text-3xl font-semibold mr-auto mt-auto">
                    Bid history
                  </div>
                  <div className="self-center flex items-start gap-1 my-auto">
                    <div className="self-stretch flex w-[19px] h-[19px] flex-col" />
                    <div className="text-stone-100 text-base font-bold self-center ml-5 my-auto pl-48 flex flex-row">
                      <div>
                        <Image
                          src="/images/icons/bids-icon.svg"
                          alt="bidder-icon"
                          className="mx-1.5"
                          width={19}
                          height={19}
                        />
                      </div>
                      {biddingData?.bidHistory?.length} Bids
                    </div>
                  </div>
                  <div className="self-center flex items-start gap-0.5 my-auto">
                    <div className="self-stretch flex w-[19px] h-[19px] flex-col" />
                    <div className="text-stone-100 text-base font-bold self-center -ml-px mr-5 my-auto flex flex-row">
                      <div>
                        <Image
                          src="/images/icons/bidder-icon.svg"
                          alt="bidder-icon"
                          className="mx-1.5"
                          width={19}
                          height={19}
                        />
                      </div>
                      {biddingData?.bidHistory?.length} Bidders
                    </div>
                  </div>
                </div>
                <div className="self-center flex w-[575px] max-w-full items-start justify-between gap-5 -ml-0.5 mt-4 max-md:flex-wrap max-md:justify-center">
                  <div className="text-stone-100 text-base font-bold self-stretch">
                    BIDDER
                  </div>
                  <div className="text-stone-100 text-base font-bold self-stretch mr-1">
                    BID
                  </div>
                  <div className="text-stone-100 text-base font-bold self-stretch ml-0 mr-6">
                    TIME
                  </div>
                </div>
              </div>
              <div className="self-center w-[786px] max-w-full flex flex-col -ml-1 mt-3.5 text-[#D2D2D2]">
                <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                  {biddingData && biddingData.bidHistory ? (
                    <div className="self-center w-[786px] max-w-full flex flex-col -ml-1 mt-3.5 text-[#D2D2D2]">
                      {biddingData.bidHistory.slice(0, 5).map((bid, index) => (
                        <div
                          key={index}
                          className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0"
                        >
                          <div className="flex flex-col items-stretch w-[33%] max-md:w-full max-md:ml-0">
                            <div className="relative shrink-0 box-border h-auto ml-8 mt-1 mb-4">
                              {bid.studentId}
                            </div>
                          </div>
                          <div className="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0">
                            <div className="relative shrink-0 box-border h-auto mx-auto mt-1 mb-4">
                              {bid.bidPrice}
                            </div>
                          </div>
                          <div className="flex flex-col items-stretch w-[33%] ml-5 max-md:w-full max-md:ml-0">
                            <div className="relative shrink-0 box-border h-auto mt-1 mb-4 mx-auto">
                              Time
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default Bidpage;

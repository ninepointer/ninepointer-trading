import React, { useContext, useState } from "react";
import { useEffect } from "react";
import Styles from "./Reports.module.css";
import axios from "axios";
import { userContext } from "../AuthContext";
import { io } from "socket.io-client";


export default function Reports() {
    let baseUrl1 = process.env.NODE_ENV === "production" ? "/" : "http://localhost:9000/"
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"

    let socket;
    try {
        // socket = io.connect("http://localhost:9000/")
        socket = io.connect(`${baseUrl1}`)

    } catch (err) {
        throw new Error(err);
    }

    let date = new Date();
    let valueInSecondDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    let valueInFirstDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const getDetails = useContext(userContext);
    const [detailPnlArr, setDetailPnl] = useState([]);
    const [userDetail, setUserDetail] = useState([]);
    const [tradeData, setTradeData] = useState([]);
    const [userTradeDetails, setUserTradeDetails] = useState([]);
    let [firstDate, setFirstDate] = useState(valueInFirstDate);
    let [secondDate, setSecondDate] = useState(valueInSecondDate);
    const [selectUserState, setSelectUserState] = useState("All User");
    const [marketData, setMarketData] = useState([]);

    let totalArr = [];
    let [allBrokerage, setAllBrokerage] = useState(0);
    let [allNet, setAllNet] = useState(0);
    let [allGross, setAllGross] = useState(0);
    let [totaltrades, setTotalTrades] = useState(0);
    // let secondDate = "";
    let userId = (getDetails.userDetails.role === "user") && getDetails.userDetails.email;

    let detailPnl = [];
    let totalPnl = 0;
    let transactionCost = 0;
    let numberOfTrade = 0;
    let lotUsed = 0;
    let name = "";
    let runninglots = 0;
    let firstDateSplit;

    let detailArr = [];

    useEffect(() => {
        console.log("rendering")
        console.log(socket);
        socket.on("connect", () => {
            console.log(socket.id);
            socket.emit("hi", true)
        })

        socket.on("tick", (data) => {
            console.log("this is live market data", data);
            setMarketData(data);
        })
    }, [])

    useEffect(() => {
        axios.get(`${baseUrl}api/v1/readuserdetails`)
            .then((res) => {
                setUserDetail(res.data);
            }).catch((err) => {
                return new Error(err);
            })

        axios.get(`${baseUrl}api/v1/readInstrumentDetails`)
            .then((res) => {
                let dataArr = (res.data).filter((elem) => {
                    return elem.status === "Active"
                })
                detailArr = dataArr;
                setTradeData(dataArr)
            }).catch((err) => {
                return new Error(err);
            })
    }, [getDetails])

    useEffect(() => {
        return () => {
            console.log('closing');
            socket.close();
        }
    }, [])

    function firstDateChange(e) {
        e.preventDefault();
        
        if((e.target.value > secondDate) && secondDate){
            window.alert("Date range is not valid")
            return;
        }
        setFirstDate((e.target.value));
        console.log(firstDate > secondDate, firstDate , secondDate)
        firstDateSplit = (e.target.value).split("-");
        firstDate = `${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`
        setFirstDate(firstDate);
        console.log(firstDate);
        let secondDateSplit = (secondDate).split("-");
        secondDate = `${secondDateSplit[0]}-${secondDateSplit[1]}-${secondDateSplit[2]}`
        setSecondDate(secondDate);
        console.log(firstDate, secondDate);
        console.log(firstDate < secondDate);

        if (getDetails.userDetails.role === "user") {
            axios.get(`${baseUrl}api/v1/readmocktradeuseremail/${userId}`)
                .then((res) => {
                    let filteredData = (res.data).filter((elem) => {
                        let timeStamp = elem.order_timestamp;
                        let oneDateSplit = (timeStamp).split(" ");
                        let twoDateSplit = oneDateSplit[0].split("-");
                        timeStamp = `${twoDateSplit[2]}-${twoDateSplit[1]}-${twoDateSplit[0]}`

                        return timeStamp >= firstDate && timeStamp <= secondDate;
                    })
                    console.log(filteredData);
                    if (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                        while (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                            // let firstDateDigit = Number(firstDateSplit[2]);
                            // let secondDateDigit = Number(secondDateSplit[2]);
                            let singleDateData = filteredData.filter((elem) => {
                                let splitting = (elem.order_timestamp).split(" ");
                                return splitting[0] === (`${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`)
                            })

                            console.log(singleDateData, `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`);
                            let newObj = pnlCalculation(singleDateData);
                            newObj.date = `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`;

                            console.log(newObj);
                            if (newObj.numberOfTrade) {
                                detailPnl.push(JSON.parse(JSON.stringify(newObj)));
                            }

                            transactionCost = 0;
                            totalPnl = 0;
                            numberOfTrade = 0;
                            lotUsed = 0;

                            console.log(detailPnl);
                            setDetailPnl(detailPnl)

                            if ((firstDateSplit[2]) < 9) {
                                (firstDateSplit[2]) = `0${Number(firstDateSplit[2]) + 1}`
                            }
                            else if ((firstDateSplit[2]) === 31) {
                                (firstDateSplit[2]) = `01`;

                                console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`)
                                if ((firstDateSplit[1]) < 9) {
                                    (firstDateSplit[1]) = `0${Number(firstDateSplit[1]) + 1}`;
                                }
                                else if ((firstDateSplit[1]) === 13) {
                                    (firstDateSplit[1]) = `01`;
                                    (firstDateSplit[0]) = Number(firstDateSplit[0]) + 1;
                                } else {
                                    (firstDateSplit[1]) = Number(firstDateSplit[1]) + 1;
                                }
                            } else {
                                (firstDateSplit[2]) = Number(firstDateSplit[2]) + 1;
                            }
                        }
                    }

                }).catch((err) => {
                    return new Error(err);
                })
        } else if (getDetails.userDetails.role === "admin") {
            console.log(selectUserState);
            if (selectUserState === "All User") {

                axios.get(`${baseUrl}api/v1/readmocktradeuser`)
                    .then((res) => {
                        let filteredData = (res.data).filter((elem) => {
                            let timeStamp = elem.order_timestamp;
                            let oneDateSplit = (timeStamp).split(" ");
                            let twoDateSplit = oneDateSplit[0].split("-");
                            timeStamp = `${twoDateSplit[2]}-${twoDateSplit[1]}-${twoDateSplit[0]}`

                            return timeStamp >= firstDate && timeStamp <= secondDate;
                        })
                        console.log(filteredData);
                        if (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                            while (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                                console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`, secondDate)
                                // let firstDateDigit = Number(firstDateSplit[2]);
                                // let secondDateDigit = Number(secondDateSplit[2]);
                                let singleDateData = filteredData.filter((elem) => {
                                    let splitting = (elem.order_timestamp).split(" ");
                                    return splitting[0] === (`${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`)
                                })

                                console.log(singleDateData, `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`);
                                let newObj = pnlCalculationUser(singleDateData);
                                // newObj.date = `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`;

                                console.log(newObj);
                                detailPnl.push(JSON.parse(JSON.stringify(newObj)));
                                // if(newObj.numberOfTrade){

                                // }

                                transactionCost = 0;
                                totalPnl = 0;
                                numberOfTrade = 0;
                                lotUsed = 0;

                                console.log(detailPnl);
                                setDetailPnl(detailPnl)
                                if ((firstDateSplit[2]) < 9) {
                                    (firstDateSplit[2]) = `0${Number(firstDateSplit[2]) + 1}`
                                }
                                else if ((firstDateSplit[2]) === 31) {
                                    (firstDateSplit[2]) = `01`;

                                    console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`)
                                    if ((firstDateSplit[1]) < 9) {
                                        (firstDateSplit[1]) = `0${Number(firstDateSplit[1]) + 1}`;
                                    }
                                    else if ((firstDateSplit[1]) === 13) {
                                        (firstDateSplit[1]) = `01`;
                                        (firstDateSplit[0]) = Number(firstDateSplit[0]) + 1;
                                    } else {
                                        (firstDateSplit[1]) = Number(firstDateSplit[1]) + 1;
                                    }
                                } else {
                                    (firstDateSplit[2]) = Number(firstDateSplit[2]) + 1;
                                }

                            }
                        }

                    }).catch((err) => {
                        return new Error(err);
                    })

            } else {
                let data = userDetail.filter((elem) => {
                    return elem.name === selectUserState
                })

                axios.get(`${baseUrl}api/v1/readmocktradeuseremail/${data[0].email}`)
                    .then((res) => {
                        let filteredData = (res.data).filter((elem) => {
                            let timeStamp = elem.order_timestamp;
                            let oneDateSplit = (timeStamp).split(" ");
                            let twoDateSplit = oneDateSplit[0].split("-");
                            timeStamp = `${twoDateSplit[2]}-${twoDateSplit[1]}-${twoDateSplit[0]}`

                            return timeStamp >= firstDate && timeStamp <= secondDate;
                        })
                        console.log(filteredData);
                        if (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                            while (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                                // let firstDateDigit = Number(firstDateSplit[2]);
                                // let secondDateDigit = Number(secondDateSplit[2]);
                                let singleDateData = filteredData.filter((elem) => {
                                    let splitting = (elem.order_timestamp).split(" ");
                                    return splitting[0] === (`${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`)
                                })

                                console.log(singleDateData, `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`);
                                let newObj = pnlCalculation(singleDateData);
                                newObj.date = `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`;

                                console.log(newObj);
                                if (newObj.numberOfTrade) {
                                    detailPnl.push(JSON.parse(JSON.stringify(newObj)));
                                }

                                transactionCost = 0;
                                totalPnl = 0;
                                numberOfTrade = 0;
                                lotUsed = 0;

                                console.log(detailPnl);
                                setDetailPnl(detailPnl)

                                if ((firstDateSplit[2]) < 9) {
                                    (firstDateSplit[2]) = `0${Number(firstDateSplit[2]) + 1}`
                                }
                                else if ((firstDateSplit[2]) === 31) {
                                    (firstDateSplit[2]) = `01`;

                                    console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`)
                                    if ((firstDateSplit[1]) < 9) {
                                        (firstDateSplit[1]) = `0${Number(firstDateSplit[1]) + 1}`;
                                    }
                                    else if ((firstDateSplit[1]) === 13) {
                                        (firstDateSplit[1]) = `01`;
                                        (firstDateSplit[0]) = Number(firstDateSplit[0]) + 1;
                                    } else {
                                        (firstDateSplit[1]) = Number(firstDateSplit[1]) + 1;
                                    }
                                } else {
                                    (firstDateSplit[2]) = Number(firstDateSplit[2]) + 1;
                                }
                            }
                        }

                    }).catch((err) => {
                        return new Error(err);
                    })

            }
        }




    }

    function secondDateChange(e) {
        e.preventDefault();
        if (((firstDate > e.target.value) && firstDate)) {
            window.alert("Date range is not valid")
            return;
        }
        console.log(userDetail)
        firstDateSplit = (firstDate).split("-");
        firstDate = `${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`
        setFirstDate(firstDate);
        console.log(firstDate);
        let secondDateSplit = (e.target.value).split("-");
        secondDate = `${secondDateSplit[0]}-${secondDateSplit[1]}-${secondDateSplit[2]}`
        setSecondDate(secondDate);

        console.log(firstDate, secondDate);
        console.log(firstDate < secondDate);

        if (getDetails.userDetails.role === "user") {
            axios.get(`${baseUrl}api/v1/readmocktradeuseremail/${userId}`)
                .then((res) => {
                    let filteredData = (res.data).filter((elem) => {
                        let timeStamp = elem.order_timestamp;
                        let oneDateSplit = (timeStamp).split(" ");
                        let twoDateSplit = oneDateSplit[0].split("-");
                        timeStamp = `${twoDateSplit[2]}-${twoDateSplit[1]}-${twoDateSplit[0]}`

                        return timeStamp >= firstDate && timeStamp <= secondDate;
                    })
                    console.log(filteredData);
                    if (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                        while (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                            // let firstDateDigit = Number(firstDateSplit[2]);
                            // let secondDateDigit = Number(secondDateSplit[2]);
                            let singleDateData = filteredData.filter((elem) => {
                                let splitting = (elem.order_timestamp).split(" ");
                                return splitting[0] === (`${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`)
                            })

                            console.log(singleDateData, `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`);
                            let newObj = pnlCalculation(singleDateData);
                            newObj.date = `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`;

                            console.log(newObj);
                            if (newObj.numberOfTrade) {
                                detailPnl.push(JSON.parse(JSON.stringify(newObj)));
                            }

                            transactionCost = 0;
                            totalPnl = 0;
                            numberOfTrade = 0;
                            lotUsed = 0;

                            console.log(detailPnl);
                            setDetailPnl(detailPnl)

                            if ((firstDateSplit[2]) < 9) {
                                (firstDateSplit[2]) = `0${Number(firstDateSplit[2]) + 1}`
                            }
                            else if ((firstDateSplit[2]) === 31) {
                                (firstDateSplit[2]) = `01`;

                                console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`)
                                if ((firstDateSplit[1]) < 9) {
                                    (firstDateSplit[1]) = `0${Number(firstDateSplit[1]) + 1}`;
                                }
                                else if ((firstDateSplit[1]) === 13) {
                                    (firstDateSplit[1]) = `01`;
                                    (firstDateSplit[0]) = Number(firstDateSplit[0]) + 1;
                                } else {
                                    (firstDateSplit[1]) = Number(firstDateSplit[1]) + 1;
                                }
                            } else {
                                (firstDateSplit[2]) = Number(firstDateSplit[2]) + 1;
                            }
                        }
                    }

                }).catch((err) => {
                    return new Error(err);
                })
        } else if (getDetails.userDetails.role === "admin") {
            console.log(selectUserState);
            if (selectUserState === "All User") {

                axios.get(`${baseUrl}api/v1/readmocktradeuser`)
                    .then((res) => {
                        let filteredData = (res.data).filter((elem) => {
                            let timeStamp = elem.order_timestamp;
                            let oneDateSplit = (timeStamp).split(" ");
                            let twoDateSplit = oneDateSplit[0].split("-");
                            timeStamp = `${twoDateSplit[2]}-${twoDateSplit[1]}-${twoDateSplit[0]}`

                            return timeStamp >= firstDate && timeStamp <= secondDate;
                        })
                        console.log(filteredData);
                        if (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                            while (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                                console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`, secondDate)
                                // let firstDateDigit = Number(firstDateSplit[2]);
                                // let secondDateDigit = Number(secondDateSplit[2]);
                                let singleDateData = filteredData.filter((elem) => {
                                    let splitting = (elem.order_timestamp).split(" ");
                                    return splitting[0] === (`${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`)
                                })

                                console.log(singleDateData, `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`);
                                let newObj = pnlCalculationUser(singleDateData);
                                // newObj.date = `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`;

                                console.log(newObj);
                                detailPnl.push(JSON.parse(JSON.stringify(newObj)));
                                // if(newObj.numberOfTrade){

                                // }

                                transactionCost = 0;
                                totalPnl = 0;
                                numberOfTrade = 0;
                                lotUsed = 0;

                                console.log(detailPnl);
                                setDetailPnl(detailPnl)
                                if ((firstDateSplit[2]) < 9) {
                                    (firstDateSplit[2]) = `0${Number(firstDateSplit[2]) + 1}`
                                }
                                else if ((firstDateSplit[2]) === 31) {
                                    (firstDateSplit[2]) = `01`;

                                    console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`)
                                    if ((firstDateSplit[1]) < 9) {
                                        (firstDateSplit[1]) = `0${Number(firstDateSplit[1]) + 1}`;
                                    }
                                    else if ((firstDateSplit[1]) === 13) {
                                        (firstDateSplit[1]) = `01`;
                                        (firstDateSplit[0]) = Number(firstDateSplit[0]) + 1;
                                    } else {
                                        (firstDateSplit[1]) = Number(firstDateSplit[1]) + 1;
                                    }
                                } else {
                                    (firstDateSplit[2]) = Number(firstDateSplit[2]) + 1;
                                }

                            }
                        }

                    }).catch((err) => {
                        return new Error(err);
                    })

            } else {
                let data = userDetail.filter((elem) => {
                    return elem.name === selectUserState
                })

                axios.get(`${baseUrl}api/v1/readmocktradeuseremail/${data[0].email}`)
                    .then((res) => {
                        let filteredData = (res.data).filter((elem) => {
                            let timeStamp = elem.order_timestamp;
                            let oneDateSplit = (timeStamp).split(" ");
                            let twoDateSplit = oneDateSplit[0].split("-");
                            timeStamp = `${twoDateSplit[2]}-${twoDateSplit[1]}-${twoDateSplit[0]}`

                            return timeStamp >= firstDate && timeStamp <= secondDate;
                        })
                        console.log(filteredData);
                        if (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                            while (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                                // let firstDateDigit = Number(firstDateSplit[2]);
                                // let secondDateDigit = Number(secondDateSplit[2]);
                                let singleDateData = filteredData.filter((elem) => {
                                    let splitting = (elem.order_timestamp).split(" ");
                                    return splitting[0] === (`${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`)
                                })

                                console.log(singleDateData, `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`);
                                let newObj = pnlCalculation(singleDateData);
                                newObj.date = `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`;

                                console.log(newObj);
                                if (newObj.numberOfTrade) {
                                    detailPnl.push(JSON.parse(JSON.stringify(newObj)));
                                }

                                transactionCost = 0;
                                totalPnl = 0;
                                numberOfTrade = 0;
                                lotUsed = 0;

                                console.log(detailPnl);
                                setDetailPnl(detailPnl)

                                if ((firstDateSplit[2]) < 9) {
                                    (firstDateSplit[2]) = `0${Number(firstDateSplit[2]) + 1}`
                                }
                                else if ((firstDateSplit[2]) === 31) {
                                    (firstDateSplit[2]) = `01`;

                                    console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`)
                                    if ((firstDateSplit[1]) < 9) {
                                        (firstDateSplit[1]) = `0${Number(firstDateSplit[1]) + 1}`;
                                    }
                                    else if ((firstDateSplit[1]) === 13) {
                                        (firstDateSplit[1]) = `01`;
                                        (firstDateSplit[0]) = Number(firstDateSplit[0]) + 1;
                                    } else {
                                        (firstDateSplit[1]) = Number(firstDateSplit[1]) + 1;
                                    }
                                } else {
                                    (firstDateSplit[2]) = Number(firstDateSplit[2]) + 1;
                                }
                            }
                        }

                    }).catch((err) => {
                        return new Error(err);
                    })

            }
        }

        console.log(detailPnl);
    }


    function pnlCalculation(data) {
        let hash = new Map();

        for (let i = data.length - 1; i >= 0; i--) {
            numberOfTrade += 1;
            transactionCost += Number(data[i].brokerage);
            if (hash.has(data[i].symbol)) {
                let obj = hash.get(data[i].symbol);
                if (data[i].buyOrSell === "BUY") {
                    if (obj.totalBuy === undefined || obj.totalBuyLot === undefined) {
                        obj.totalBuy = Number(data[i].average_price) * (Number(data[i].Quantity))
                        obj.totalBuyLot = (Number(data[i].Quantity))
                    } else {
                        obj.totalBuy = obj.totalBuy + Number(data[i].average_price) * (Number(data[i].Quantity))
                        obj.totalBuyLot = obj.totalBuyLot + (Number(data[i].Quantity))
                    }

                } if (data[i].buyOrSell === "SELL") {
                    if (obj.totalSell === undefined || obj.totalSellLot === undefined) {

                        obj.totalSell = Number(data[i].average_price) * (Number(data[i].Quantity))
                        obj.totalSellLot = (Number(data[i].Quantity))
                    } else {

                        obj.totalSell = obj.totalSell + Number(data[i].average_price) * (Number(data[i].Quantity))
                        obj.totalSellLot = obj.totalSellLot + (Number(data[i].Quantity))
                    }

                }
            } else {
                if (data[i].buyOrSell === "BUY") {
                    hash.set(data[i].symbol, {
                        totalBuy: Number(data[i].average_price) * (Number(data[i].Quantity)),
                        totalBuyLot: (Number(data[i].Quantity)),
                        totalSell: 0,
                        totalSellLot: 0,
                        symbol: data[i].symbol,
                        Product: data[i].Product,
                        name: data[0].createdBy
                    })
                } if (data[i].buyOrSell === "SELL") {
                    hash.set(data[i].symbol, {
                        totalSell: Number(data[i].average_price) * (Number(data[i].Quantity)),
                        totalSellLot: (Number(data[i].Quantity)),
                        totalBuy: 0,
                        totalBuyLot: 0,
                        symbol: data[i].symbol,
                        Product: data[i].Product,
                        name: data[0].createdBy
                    })
                }
            }
        }

        let overallPnl = [];
        for (let value of hash.values()) {
            overallPnl.push(value);
        }
        let liveDetailsArr = [];
        overallPnl.map((elem) => {
            tradeData.map((element) => {
                if (element.symbol === elem.symbol) {
                    marketData.map((subElem) => {
                        if (subElem !== undefined && subElem.instrument_token === element.instrumentToken) {
                            liveDetailsArr.push(subElem)
                        }
                    })
                }
            })
        })

        console.log(liveDetailsArr)
        overallPnl.map((elem, index) => {
            if (selectUserState === "All user") {
                name = "All User"
            } else {
                name = elem.name;
            }
            if (elem.totalBuyLot + elem.totalSellLot === 0) {
                totalPnl += -(elem.totalBuy + elem.totalSell)
            } else {
                totalPnl += (-(elem.totalBuy + elem.totalSell - (elem.totalBuyLot + elem.totalSellLot) * liveDetailsArr[index]?.last_price))

            }

            console.log(liveDetailsArr[index]?.last_price)
            console.log(elem.totalBuy, elem.totalSell, elem.totalBuyLot, elem.totalSellLot, liveDetailsArr[index]?.last_price)
            lotUsed += Math.abs(elem.totalBuyLot) + Math.abs(elem.totalSellLot);
        })

        let newObj = {
            brokerage: transactionCost,
            pnl: totalPnl,
            name: name,
            numberOfTrade: numberOfTrade,
            lotUsed: lotUsed
        }

        return newObj;
    }

    function selectUser(e) {
        e.preventDefault();
        setSelectUserState(e.target.value);
        console.log("e.target.value", e.target.value);
        console.log(selectUserState, userDetail)
        // secondDateChange(e)
        detailPnl = [];
        firstDateSplit = (firstDate).split("-");

        console.log("e.target.value", e.target.value);

        if (e.target.value === "All User") {

            axios.get(`${baseUrl}api/v1/readmocktradeuser`)
                .then((res) => {
                    let filteredData = (res.data).filter((elem) => {
                        let timeStamp = elem.order_timestamp;
                        let oneDateSplit = (timeStamp).split(" ");
                        let twoDateSplit = oneDateSplit[0].split("-");
                        timeStamp = `${twoDateSplit[2]}-${twoDateSplit[1]}-${twoDateSplit[0]}`

                        return timeStamp >= firstDate && timeStamp <= secondDate;
                    })
                    console.log(filteredData);
                    if (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                        while (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                            console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`, secondDate)
                            // let firstDateDigit = Number(firstDateSplit[2]);
                            // let secondDateDigit = Number(secondDateSplit[2]);
                            let singleDateData = filteredData.filter((elem) => {
                                let splitting = (elem.order_timestamp).split(" ");
                                return splitting[0] === (`${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`)
                            })

                            console.log(singleDateData, `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`);
                            let newObj = pnlCalculationUser(singleDateData);
                            // newObj.date = `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`;

                            console.log(newObj);
                            detailPnl.push(JSON.parse(JSON.stringify(newObj)));
                            // if(newObj.numberOfTrade){

                            // }

                            transactionCost = 0;
                            totalPnl = 0;
                            numberOfTrade = 0;
                            lotUsed = 0;

                            console.log(detailPnl);
                            setDetailPnl(detailPnl)
                            if ((firstDateSplit[2]) < 9) {
                                (firstDateSplit[2]) = `0${Number(firstDateSplit[2]) + 1}`
                            }
                            else if ((firstDateSplit[2]) === 31) {
                                (firstDateSplit[2]) = `01`;

                                console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`)
                                if ((firstDateSplit[1]) < 9) {
                                    (firstDateSplit[1]) = `0${Number(firstDateSplit[1]) + 1}`;
                                }
                                else if ((firstDateSplit[1]) === 13) {
                                    (firstDateSplit[1]) = `01`;
                                    (firstDateSplit[0]) = Number(firstDateSplit[0]) + 1;
                                } else {
                                    (firstDateSplit[1]) = Number(firstDateSplit[1]) + 1;
                                }
                            } else {
                                (firstDateSplit[2]) = Number(firstDateSplit[2]) + 1;
                            }

                        }
                    }

                }).catch((err) => {
                    return new Error(err);
                })

        } else {
            let data = userDetail.filter((elem) => {
                return elem.name === e.target.value
            })

            axios.get(`${baseUrl}api/v1/readmocktradeuseremail/${data[0].email}`)
                .then((res) => {
                    let filteredData = (res.data).filter((elem) => {
                        let timeStamp = elem.order_timestamp;
                        let oneDateSplit = (timeStamp).split(" ");
                        let twoDateSplit = oneDateSplit[0].split("-");
                        timeStamp = `${twoDateSplit[2]}-${twoDateSplit[1]}-${twoDateSplit[0]}`

                        return timeStamp >= firstDate && timeStamp <= secondDate;
                    })
                    console.log(filteredData);
                    if (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                        while (`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}` <= secondDate) {
                            // let firstDateDigit = Number(firstDateSplit[2]);
                            // let secondDateDigit = Number(secondDateSplit[2]);
                            let singleDateData = filteredData.filter((elem) => {
                                let splitting = (elem.order_timestamp).split(" ");
                                return splitting[0] === (`${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`)
                            })

                            console.log(singleDateData, `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`);
                            let newObj = pnlCalculation(singleDateData);
                            newObj.date = `${firstDateSplit[2]}-${firstDateSplit[1]}-${firstDateSplit[0]}`;

                            console.log(newObj);
                            if (newObj.numberOfTrade) {
                                detailPnl.push(JSON.parse(JSON.stringify(newObj)));
                            }

                            transactionCost = 0;
                            totalPnl = 0;
                            numberOfTrade = 0;
                            lotUsed = 0;

                            console.log(detailPnl);
                            setDetailPnl(detailPnl)

                            if ((firstDateSplit[2]) < 9) {
                                (firstDateSplit[2]) = `0${Number(firstDateSplit[2]) + 1}`
                            }
                            else if ((firstDateSplit[2]) === 31) {
                                (firstDateSplit[2]) = `01`;

                                console.log(`${firstDateSplit[0]}-${firstDateSplit[1]}-${firstDateSplit[2]}`)
                                if ((firstDateSplit[1]) < 9) {
                                    (firstDateSplit[1]) = `0${Number(firstDateSplit[1]) + 1}`;
                                }
                                else if ((firstDateSplit[1]) === 13) {
                                    (firstDateSplit[1]) = `01`;
                                    (firstDateSplit[0]) = Number(firstDateSplit[0]) + 1;
                                } else {
                                    (firstDateSplit[1]) = Number(firstDateSplit[1]) + 1;
                                }
                            } else {
                                (firstDateSplit[2]) = Number(firstDateSplit[2]) + 1;
                            }
                        }
                    }

                }).catch((err) => {
                    return new Error(err);
                })

        }
    }

    function pnlCalculationUser(allTrade) {
        let detailPnl = [];
        userDetail.map((elem) => {

            let data = allTrade.filter((element) => {
                return elem.email === element.userId;
            })


            let hash = new Map();

            for (let i = data.length - 1; i >= 0; i--) {
                numberOfTrade += 1;
                transactionCost += Number(data[i].brokerage);
                if (hash.has(data[i].symbol)) {
                    let obj = hash.get(data[i].symbol);
                    if (data[i].buyOrSell === "BUY") {
                        if (obj.totalBuy === undefined || obj.totalBuyLot === undefined) {
                            obj.totalBuy = Number(data[i].average_price) * (Number(data[i].Quantity))
                            obj.totalBuyLot = (Number(data[i].Quantity))
                        } else {
                            obj.totalBuy = obj.totalBuy + Number(data[i].average_price) * (Number(data[i].Quantity))
                            obj.totalBuyLot = obj.totalBuyLot + (Number(data[i].Quantity))
                        }

                    } if (data[i].buyOrSell === "SELL") {
                        if (obj.totalSell === undefined || obj.totalSellLot === undefined) {

                            obj.totalSell = Number(data[i].average_price) * (Number(data[i].Quantity))
                            obj.totalSellLot = (Number(data[i].Quantity))
                        } else {

                            obj.totalSell = obj.totalSell + Number(data[i].average_price) * (Number(data[i].Quantity))
                            obj.totalSellLot = obj.totalSellLot + (Number(data[i].Quantity))
                        }
                    }
                } else {
                    if (data[i].buyOrSell === "BUY") {
                        hash.set(data[i].symbol, {
                            totalBuy: Number(data[i].average_price) * (Number(data[i].Quantity)),
                            totalBuyLot: (Number(data[i].Quantity)),
                            totalSell: 0,
                            totalSellLot: 0,
                            symbol: data[i].symbol,
                            Product: data[i].Product,
                            name: data[0].createdBy,
                            date: data[0].order_timestamp
                        })
                    } if (data[i].buyOrSell === "SELL") {
                        hash.set(data[i].symbol, {
                            totalSell: Number(data[i].average_price) * (Number(data[i].Quantity)),
                            totalSellLot: (Number(data[i].Quantity)),
                            totalBuy: 0,
                            totalBuyLot: 0,
                            symbol: data[i].symbol,
                            Product: data[i].Product,
                            name: data[0].createdBy,
                            date: data[0].order_timestamp
                        })
                    }
                }
            }

            let overallPnl = [];
            for (let value of hash.values()) {
                overallPnl.push(value);
            }
            let liveDetailsArr = [];
            overallPnl.map((elem) => {
                tradeData.map((element) => {
                    if (element.symbol === elem.symbol) {
                        marketData.map((subElem) => {
                            if (subElem !== undefined && subElem.instrument_token === element.instrumentToken) {
                                liveDetailsArr.push(subElem)
                            }
                        })
                    }
                })
            })

            let name = "";
            let date = "";
            overallPnl.map((elem, index) => {
                date = elem.date;
                name = elem.name;
                if (elem.totalBuyLot + elem.totalSellLot === 0) {
                    totalPnl += -(elem.totalBuy + elem.totalSell)
                } else {
                    totalPnl += (-(elem.totalBuy + elem.totalSell - (elem.totalBuyLot + elem.totalSellLot) * liveDetailsArr[index]?.last_price))

                }
                console.log(elem.totalBuy, elem.totalSell, elem.totalBuyLot, elem.totalSellLot, liveDetailsArr[index]?.last_price)
                // totalPnl += (-(elem.totalBuy+elem.totalSell-(elem.totalBuyLot+elem.totalSellLot)*liveDetailsArr[index]?.last_price))
                lotUsed += Math.abs(elem.totalBuyLot) + Math.abs(elem.totalSellLot);
                runninglots += elem.totalBuyLot + elem.totalSellLot;
                console.log(runninglots);
            })



            let newObj = {
                brokerage: transactionCost,
                pnl: totalPnl,
                name: name,
                numberOfTrade: numberOfTrade,
                lotUsed: lotUsed,
                runninglots: runninglots,
                date: (date.split(" "))[0]
            }

            console.log("overallPnl", overallPnl, newObj)
            console.log(transactionCost, totalPnl, name, runninglots);
            detailPnl.push(JSON.parse(JSON.stringify(newObj)));
            transactionCost = 0;
            totalPnl = 0;
            numberOfTrade = 0;
            lotUsed = 0;
            runninglots = 0;
            // runninglots = 0;
        })

        detailPnl.sort((a, b) => {
            return (b.pnl - b.brokerage) - (a.pnl - a.brokerage)
        });

        return detailPnl;
    }

    detailPnlArr.map((elem) => {
        if (elem.brokerage) {
            allBrokerage = allBrokerage + Number(elem.brokerage);
        }

        if (elem.pnl) {
            allGross = allGross + Number(elem.pnl);
            
        }
        totaltrades += elem.numberOfTrade;

        allNet = (allGross - allBrokerage);
        // console.log(detailPnlArr, allBrokerage, allGross, allNet)

        let obj = {
            allBrokerage: allBrokerage,
            allGross: allGross,
            allNet: allNet,
            totaltrades: totaltrades
        }
        // console.log(obj)
        totalArr.push(obj);
    })

    if(selectUserState === "All User" && getDetails.userDetails.role === "admin"){
        detailPnlArr.map((element)=>{
            if(element){
                element.map((elem)=>{
                    if(elem.brokerage){
                        allBrokerage = allBrokerage + Number(elem.brokerage);
                    }

                    if (elem.pnl) {
                        allGross = allGross + Number(elem.pnl);
                    }
                    totaltrades += elem.numberOfTrade;

                    allNet = (allGross - allBrokerage);
                    console.log(allBrokerage, allGross, allNet, totaltrades)

                    // let obj = {
                    //     allBrokerage: allBrokerage,
                    //     allGross: allGross,
                    //     allNet: allNet
                    // }
                    // console.log(obj)
                    // totalArr.push(obj);
                })
            }
        })
    }


    console.log(detailPnlArr, totalArr)

    return (
        <div>
            <div className="main_Container">
                <div className="right_side">
                    <div className="rightside_maindiv">
                    <div className={Styles.selectboxmain}>
                        <div className={Styles.selectbox}>
                        <div className={Styles.main_dateSelData1}>
                            <div className={Styles.form_div1}>
                                <form action="">
                                    <label htmlFor="" className={Styles.formLable1}>Start Date</label>
                                    <input type="date" value={firstDate} className={Styles.formInput1} onChange={(e) => { firstDateChange(e) }} />
                                    <label htmlFor="" className={Styles.formLable1}>End Date</label>
                                    <input type="date" value={secondDate} className={Styles.formInput1} onChange={(e) => { secondDateChange(e) }} />
                                    {getDetails.userDetails.role === "admin" &&
                                        <>
                                            <label htmlFor="" className={Styles.formLable1}>Trader</label>
                                            <select name="" id="" className={Styles.formSelect} onChange={(e) => { selectUser(e) }} >
                                                <option value="Select User">Select User</option>
                                                {userDetail.map((elem) => {
                                                    return (
                                                        <option value={elem.name}>{elem.name}</option>
                                                    )
                                                })}
                                                {/* <option value="All User">All User</option> */}
                                            </select>
                                        </>
                                    }
                                </form>
                            </div>
                            </div>
                            </div>
                            
                            {/* Adding info box section */}

                            <div className={Styles.infobox}>
                            <div className={Styles.box1}>
                            <div className={Styles.btn_div_one1}>
                                    
                                <div className={`${Styles.header}`}>Gross P&L</div>
                                <div className={Styles.header}>Transaction Cost</div>
                                <div className={Styles.header}>Net P&L</div>
                                <div className={Styles.header}>Total Trades</div>
                                <div className={Styles.header}>Trading Days</div>
                            </div>
                            <div className={Styles.btn_div_one1}>
                                <div style={allGross > 0.00 ? { color: "green" } : allGross === 0.00 ? { color: "grey" } : { color: "red" }} className={`${Styles.headervalues}`}>{allGross > 0.00 ? "+₹" + (allGross.toFixed(2)) : allGross === 0 ? "" : "-₹" + ((-(allGross)).toFixed(2))}</div>
                                
                                <div className={`${Styles.headervalues}`}>{allBrokerage === 0 ? " " : "₹" + (allBrokerage.toFixed(2))}</div>
                    
                                <div className={`${Styles.headervalues}`} style={allNet > 0.00 ? { color: "green" } : allBrokerage === 0.00 ? { color: "grey" } : { color: "red" }} >{allNet > 0.00 ? "+₹" + (allNet.toFixed(2)) : allNet === 0 ? " " : "-₹" + ((-(allNet)).toFixed(2))}</div>

                                <div className={`${Styles.headervalues}`}>{totaltrades}</div>

                                <div className={`${Styles.headervalues}`}>{totaltrades}</div>
                            </div>
                            </div>
                        </div>

                            {/* End of Info box section */}

                        </div>
                        <div className={Styles.infobox}>
                        <div className={Styles.box1}>
                        <div className={Styles.grid_1}>
                            <table className="grid1_table">
                                <tr className="grid2_tr">
                                    <th className="grid2_th">Trader Name</th>
                                    <th className="grid2_th">Date</th>
                                    <th className="grid2_th">Gross P&L</th>
                                    <th className="grid2_th">Transaction Cost</th>
                                    <th className="grid2_th">Net P&L</th>
                                    <th className="grid2_th"># of Trades</th>
                                    <th className="grid2_th"># of Lots Used</th>
                                    {/* <th className="grid2_th">{detailPnl[0].name}</th> */}
                                </tr>
                                {selectUserState === "All User" && getDetails.userDetails.role === "admin" ?

                                    detailPnlArr.map((element) => {
                                        allBrokerage = allBrokerage + Number(element.brokerage);
                                        allGross = allGross + element.pnl;
                                        allNet = allNet + (allGross - allBrokerage);
                                        totaltrades += numberOfTrade;
                                        console.log(element, selectUserState)

                                        return (
                                            element.map((elem) => {
                                                console.log(elem)
                                                return (
                                                    <>
                                                        {elem.name &&
                                                            <tr>
                                                                <td className="grid2_td">{elem.name}</td>
                                                                <td className="grid2_td">{elem.date}</td>
                                                                {!elem.pnl ?
                                                                    <td className="grid2_td" style={elem.pnl >= 0.00 ? { color: "green" } : { color: "red" }}>{elem.pnl > 0.00 ? "+₹" + (elem.pnl) : "-₹" + (-(elem.pnl))}</td>
                                                                    :
                                                                    <td className="grid2_td" style={elem.pnl >= 0.00 ? { color: "green" } : { color: "red" }}>{elem.pnl > 0.00 ? "+₹" + (elem.pnl.toFixed(2)) : "-₹" + ((-(elem.pnl)).toFixed(2))}</td>}
                                                                {!elem.brokerage ?
                                                                    <td className="grid2_td" >{elem.brokerage > 0.00 ? "₹" + (elem.brokerage) : "₹" + 0.00}</td>
                                                                    :
                                                                    <td className="grid2_td" >{elem.brokerage > 0.00 ? "₹" + (elem.brokerage).toFixed(2) : "₹" + 0.00}</td>}
                                                                {(elem.pnl - elem.brokerage) !== undefined &&
                                                                    <td className="grid2_td" style={(elem.pnl - elem.brokerage) >= 0.00 ? { color: "green" } : { color: "red" }}> {elem.pnl - elem.brokerage > 0.00 ? "+₹" + (elem.pnl - elem.brokerage).toFixed(2) : "-₹" + ((-(elem.pnl - elem.brokerage)).toFixed(2))}</td>}
                                                                <td className="grid2_td">{elem.numberOfTrade}</td>
                                                                <td className="grid2_td">{elem.lotUsed}</td>
                                                            </tr>}
                                                    </>
                                                )
                                            })
                                        )
                                    })
                                    :
                                    detailPnlArr.map((elem) => {
                                        allBrokerage = allBrokerage + Number(elem.brokerage);
                                        allGross = allGross + elem.pnl;
                                        allNet = allNet + (allGross - allBrokerage);
                                        totaltrades = totaltrades + elem.numberOfTrade;
                                        // setTotalBrokerage(allBrokerage); setTotalGross(allGross); setTotalNetPnl(allNet);
                                        return (
                                            <>
                                            {elem.name &&
                                            
                                            <tr>
                                                <td className="grid2_td">{elem.name}</td>
                                                <td className="grid2_td">{elem.date}</td>
                                                {!elem.pnl ?
                                                <td className="grid2_td" style={elem.pnl>=0.00 ? { color: "green"}:  { color: "red"}}>{elem.pnl >0.00 ? "+₹" + (elem.pnl): "-₹" + (-(elem.pnl)) }</td>
                                                :
                                                <td className="grid2_td" style={elem.pnl>=0.00 ? { color: "green"}:  { color: "red"}}>{elem.pnl >0.00 ? "+₹" + (elem.pnl.toFixed(2)): "-₹" + ((-(elem.pnl)).toFixed(2)) }</td>}
                
                                                <td className="grid2_td" >₹{(elem.brokerage).toFixed(2)}</td>
                                            
                                                {(elem.pnl - elem.brokerage) !== undefined &&
                                                <td className="grid2_td" style={(elem.pnl - elem.brokerage)>=0.00 ? { color: "green"}:  { color: "red"}}> {elem.pnl - elem.brokerage > 0.00 ? "+₹" + (elem.pnl - elem.brokerage).toFixed(2): "-₹" + ((-(elem.pnl - elem.brokerage)).toFixed(2))}</td>}
                                                <td className="grid2_td">{elem.numberOfTrade}</td>
                                                <td className="grid2_td">{elem.lotUsed}</td>
                                            </tr>}
                                            
                                            </>
                                        )
                                    })}
                            </table>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

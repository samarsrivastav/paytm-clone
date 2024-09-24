import { useEffect, useState } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import axios from "axios"

export const Dashboard = () => {
    const [value,setValue]=useState(0)
    useEffect(()=>{
        const fetchData =async(params)=> {
            const response=await axios.get("http://localhost:3000/api/v1/account/balance",{
             headers:{
                Authorization:"Bearer "+localStorage.getItem("token")
             }   
            })
            console.log(response.data)
            setValue(response.data.balance.toFixed(2))
        }
        fetchData()
    },[])
    return <div>
        <Appbar />
        <div className="m-8">
            <Balance value={value} />
            <Users />
        </div>
    </div>
}
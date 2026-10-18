import {NextResponse} from "next/server";
import {refreshMarketPrices} from "@/lib/server/market-prices";
export const runtime="nodejs";
export async function GET(request:Request){if(!process.env.CRON_SECRET||request.headers.get("authorization")!==`Bearer ${process.env.CRON_SECRET}`)return NextResponse.json({error:"Unauthorized"},{status:401});try{return NextResponse.json({ok:true,...await refreshMarketPrices()})}catch(error){console.error("Market price refresh failed",error);return NextResponse.json({error:error instanceof Error?error.message:"No se pudieron actualizar las cotizaciones."},{status:500})}}

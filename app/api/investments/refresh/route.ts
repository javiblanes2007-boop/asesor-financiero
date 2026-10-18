import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {refreshMarketPrices} from "@/lib/server/market-prices";
export const runtime="nodejs";
export async function POST(){try{const supabase=await createClient();const{data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Inicia sesión para actualizar tus activos."},{status:401});return NextResponse.json(await refreshMarketPrices(user.id))}catch(error){console.error("Manual market price refresh failed",error);return NextResponse.json({error:error instanceof Error?error.message:"No se pudieron actualizar las cotizaciones."},{status:500})}}

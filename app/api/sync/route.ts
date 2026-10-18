import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

const configured=()=>Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function userClient(){
  if(!configured())return {error:NextResponse.json({error:"La sincronización aún no está configurada."},{status:503})};
  const supabase=await createClient();
  const {data:{user},error}=await supabase.auth.getUser();
  if(error||!user)return {error:NextResponse.json({error:"Inicia sesión para sincronizar tus datos."},{status:401})};
  const allowed=process.env.ALLOWED_EMAIL?.toLowerCase();
  if(allowed&&user.email?.toLowerCase()!==allowed)return {error:NextResponse.json({error:"Cuenta no autorizada."},{status:403})};
  return {supabase,user};
}
export async function GET(){
  const auth=await userClient();if("error" in auth)return auth.error;
  const {data,error}=await auth.supabase.from("user_app_state").select("state,updated_at").eq("user_id",auth.user.id).maybeSingle();
  if(error)return NextResponse.json({error:"No se pudieron cargar los datos sincronizados."},{status:500});
  return NextResponse.json({state:data?.state??null,updatedAt:data?.updated_at??null});
}
export async function PUT(request:Request){
  const auth=await userClient();if("error" in auth)return auth.error;
  let state:unknown;try{state=(await request.json()).state}catch{return NextResponse.json({error:"Datos no válidos."},{status:400})}
  if(!state||typeof state!=="object"||Array.isArray(state))return NextResponse.json({error:"Datos no válidos."},{status:400});
  const {error}=await auth.supabase.from("user_app_state").upsert({user_id:auth.user.id,state,updated_at:new Date().toISOString()},{onConflict:"user_id"});
  if(error)return NextResponse.json({error:"No se pudieron guardar los datos sincronizados."},{status:500});
  return NextResponse.json({ok:true});
}

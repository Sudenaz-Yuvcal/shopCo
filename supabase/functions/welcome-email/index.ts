// // @ts-ignore:
// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// interface WelcomeEmailRequest {
//   email: string;
//   fullName: string;
// }

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers":
//     "authorization, x-client-info, apikey, content-type",
// };

// serve(async (req: Request): Promise<Response> => {
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   try {
//     const { email, fullName }: WelcomeEmailRequest = await req.json();

//     const res = await fetch("https://api.resend.com/emails", {
//       method: "POST",
//       headers: {
//         // @ts-ignore:
//         Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         from: "SHOP.CO <onboarding@resend.dev>",
//         to: [email],
//         subject: "ARAMIZA HOŞ GELDİN | SHOP.CO",
//         html: `
//           <div style="background-color: #ffffff; padding: 40px 20px; font-family: 'Helvetica', Arial, sans-serif; text-align: center; color: #000000;">
//             <div style="max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
              
//               <div style="background-color: #000000; padding: 30px; color: #ffffff;">
//                 <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px; font-style: italic; text-transform: uppercase;">
//                   SHOP.CO
//                 </h1>
//               </div>

//               <div style="padding: 40px 30px;">
//                 <p style="font-size: 14px; font-weight: 700; color: #666666; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px;">
//                   HOŞ GELDİN,
//                 </p>
//                 <h2 style="font-size: 24px; font-weight: 900; margin: 0 0 20px 0; text-transform: uppercase; font-style: italic;">
//                   ${fullName}
//                 </h2>
//                 <div style="height: 1px; background-color: #eeeeee; width: 50px; margin: 20px auto;"></div>
//                 <p style="font-size: 16px; line-height: 1.6; color: #333333; margin-bottom: 30px;">
//                   Tarzını dünyaya konuşturmaya hazır mısın? En yeni koleksiyonlar ve sana özel fırsatlar artık bir tık uzağında.
//                 </p>
                
//                 <a href="https://shop.co" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 16px 32px; text-decoration: none; font-size: 12px; font-weight: 900; border-radius: 50px; text-transform: uppercase; font-style: italic; letter-spacing: 2px;">
//                   Hemen Keşfet →
//                 </a>
//               </div>

//               <div style="background-color: #fafafa; padding: 20px; border-top: 1px solid #eeeeee;">
//                 <p style="font-size: 10px; color: #999999; margin: 0; text-transform: uppercase; font-weight: 700;">
//                   © 2026 SHOP.CO | TÜM HAKLARI SAKLIDIR.
//                 </p>
//               </div>
//             </div>
//           </div>
//         `,
//       }),
//     });

//     const resData = await res.json();

//     return new Response(JSON.stringify(resData), {
//       headers: { ...corsHeaders, "Content-Type": "application/json" },
//       status: 200,
//     });
//   } catch (err: unknown) {
//     let errorMessage = "An unknown error occurred";
//     if (err instanceof Error) errorMessage = err.message;

//     return new Response(JSON.stringify({ error: errorMessage }), {
//       headers: { ...corsHeaders, "Content-Type": "application/json" },
//       status: 400,
//     });
//   }
// });

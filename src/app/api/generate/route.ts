import { NextResponse, NextRequest } from "next/server";
import { DEFAULT_MODEL, sunoApi } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      console.log(process.env.SUNO_COOKIE)
      const body = await req.json();
      const { prompt, make_instrumental, model, wait_audio } = body;
      console.log(body)
      if (!prompt) {
        return new NextResponse(JSON.stringify({ error: 'Prompt is required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
      console.log(prompt, wait_audio)
      const sunoApiResponse = await sunoApi;
      console.log('Heere')

      const audioInfo = await sunoApiResponse.generate(
        prompt,
        Boolean(make_instrumental),
        model || DEFAULT_MODEL,
        Boolean(wait_audio)
      );
      console.log(audioInfo);
      return new NextResponse(JSON.stringify(audioInfo), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error: any) {
      console.log(error);
      console.error('Error generating custom audio:', JSON.stringify(error));
      if (error?.response?.status === 402) {

        return new NextResponse(JSON.stringify(error), {
          status: 402,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
      return new NextResponse(JSON.stringify({ error: 'Internal server error: ' + JSON.stringify(error) }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  } else {
    return new NextResponse('Method Not Allowed', {
      headers: {
        Allow: 'POST',
        ...corsHeaders
      },
      status: 405
    });
  }
}


export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}
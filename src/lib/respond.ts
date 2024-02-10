import {NextResponse} from "next/server";

async function respondWithError(message: string, status: number) {
    return NextResponse.json(
        {error: message},
        {
            status,
            headers: {
                "Content-Type": "application/json"
            }
        });
}

function respondWithSuccess(data: any, status: number) {
    return new NextResponse(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

export {respondWithError, respondWithSuccess};
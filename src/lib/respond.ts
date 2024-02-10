import {NextResponse} from "next/server";

function respondWithError(message: string, status: number) {
    return NextResponse.json(
        {error: message},
        {
            status,
            headers: {
                "Content-Type": "application/json"
            }
        });
}

function respondWithSuccess<T extends object>(data: T, status: number) {
    return new NextResponse(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

export {respondWithError, respondWithSuccess};
'use client';

import React from 'react';
import { usePathname  } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
    const pathname = usePathname()

    // receive last part of the path
    const slug = pathname.split('/').pop();

    return (
        <div>
            <Link href={"/lots/" + "new/"}>
                <Button>Створити новий лот</Button>
            </Link>
        </div>
    );
}

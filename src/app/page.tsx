"use client"

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function Home() {
  const { user } = useUser();

  console.log('Loged as ', user);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <>
        {user ? (
          <section className="w-full max-w-xl space-y-4">
            <header className="flex items-center gap-4">
              <img
                src={"https://image1.mobiauto.com.br/images/api/images/v1.0/346267825/transform/fl_progressive,f_webp,q_auto"}
                alt="Avatar"
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-semibold">
                  {"civic g10 de cria da grigri"}
                </h1>
                {(user.primaryEmailAddress?.emailAddress ||
                  user.emailAddresses?.[0]?.emailAddress) && (
                  <p className="text-sm text-gray-500">
                    {user.primaryEmailAddress?.emailAddress ??
                      user.emailAddresses?.[0]?.emailAddress}
                  </p>
                )}
              </div>
            </header>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">User ID</div>
                <div className="font-mono break-all">{user.id}</div>
              </div>
              {user.username && (
                <div>
                  <div className="text-gray-500">Username</div>
                  <div>{user.username}</div>
                </div>
              )}
            </div>
          </section>
        ) : (
          <p className="text-gray-500">Not signed in.</p>
        )}
      </>
    </div>
  );
}

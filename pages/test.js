import React from "react";
import { NextSeo } from "next-seo";
import Link from "next/link";

function test() {
  return (
    <>
      <NextSeo
        noindex={false}
        nofollow={false}
        title="Test"
        description="Description of Test"
      />

    <div className={"container"}>
        <main className={"main"}>

        <h1>Test page</h1>
        <Link href={"/"}>Home</Link>
        </main>

    </div>
    </>
  );
}

export default test;

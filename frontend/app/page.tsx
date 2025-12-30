'use client'

import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
import { Leva } from "leva";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Leva hidden />
    </>
  );
}

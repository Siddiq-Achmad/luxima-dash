"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { CircleArrowLeftIcon, CircleChevronUp } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const PRIMARY_ORB_HORIZONTAL_OFFSET = 40;
const PRIMARY_ORB_VERTICAL_OFFSET = 20;

export default function NotFound() {
  const handleBack = () => {
    window.history.back();
  }
  return (
    <main className="flex flex-1">
      <div className="w-full relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1),transparent_70%)] text-[var(--foreground)]  mx-auto  border-border border-x border-b border-dashed ">
        <div
          aria-hidden={true}
          className="-z-10 absolute inset-0 overflow-hidden"
        >
          <motion.div
            animate={{
              x: [
                0,
                PRIMARY_ORB_HORIZONTAL_OFFSET,
                -PRIMARY_ORB_HORIZONTAL_OFFSET,
                0,
              ],
              y: [
                0,
                PRIMARY_ORB_VERTICAL_OFFSET,
                -PRIMARY_ORB_VERTICAL_OFFSET,
                0,
              ],
              rotate: [0, 10, -10, 0],
            }}
            className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-3xl"
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5,
              ease: "easeInOut",
            }}
          />
          <motion.div
            animate={{
              x: [
                0,
                -PRIMARY_ORB_HORIZONTAL_OFFSET,
                PRIMARY_ORB_HORIZONTAL_OFFSET,
                0,
              ],
              y: [
                0,
                -PRIMARY_ORB_VERTICAL_OFFSET,
                PRIMARY_ORB_VERTICAL_OFFSET,
                0,
              ],
            }}
            className="absolute right-1/4 bottom-1/3 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-400/10 to-pink-400/10 blur-3xl"
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5,
              ease: "easeInOut",
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
          }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Empty>
            <EmptyHeader>
              <EmptyTitle className="font-extrabold text-8xl">404</EmptyTitle>
              <EmptyDescription className="text-nowrap text-2xl font-semibold">
                Page Not Found
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <p className="text-nowrap font-mono text-muted-foreground">
                The page you&apos;re looking for might have been <br />
                moved or doesn&apos;t exist.
              </p>
              <div className="flex gap-2">
                <Button onClick={handleBack}>

                  <CircleArrowLeftIcon
                    className="mr-2 h-4 w-4"
                  />{" "}
                  Go Back

                </Button>

                <Button variant="outline" asChild>
                  <Link href="/">
                    <CircleChevronUp className="mr-2 h-4 w-4" />
                    Explore
                  </Link>
                </Button>
              </div>
            </EmptyContent>
          </Empty>
        </motion.div>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";

const ButtonApianLogoHome = () => {
  return (
    <Link href="/" aria-label="Go to homepage">
      <Image
        src="/apian_logo.png"
        width={94}
        height={26}
        alt="Apian logo"
        priority={true}
      />
    </Link>
  );
};

export default ButtonApianLogoHome;

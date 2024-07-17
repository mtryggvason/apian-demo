import { ButtonHTMLAttributes } from "react";

import StyledButton from "@/components/buttons/StyledButton";
import { DownloadIcon } from "@/components/icons/DownloadIcon";

interface DownloadButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
}
export const DownloadButton = ({ href, ...props }: DownloadButtonProps) => (
  <StyledButton
    size="xsRoundedMdSquare"
    {...props}
    className={
      props.className ? "group/button " + props.className : "group/button"
    }
  >
    <a
      className="h-full w-full"
      href={href}
      download
      data-testid="download-button"
    >
      <DownloadIcon />
    </a>
  </StyledButton>
);

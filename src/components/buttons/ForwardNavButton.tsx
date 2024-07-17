import StyledButton from "@/components/buttons/StyledButton";
import { ArrowLeft } from "@/components/icons/ArrowLeft";
import Text from "@/components/typography/Text";

interface ForwardNavButtonProps {
  colour: "softBlack" | "white";
  href: string;
  buttonText: string;
}

export default function ForwardNavButton({
  colour,
  href,
  buttonText,
}: ForwardNavButtonProps) {
  return (
    // using <a> tag here because next Link component is making the slider open when the button is used in transfer schedule page
    <a href={href}>
      <StyledButton
        size="smRoundedMd"
        bgColor={colour}
        className="group flex w-full flex-row items-center justify-between"
      >
        <Text textSize="body" textColor="notSpecified">
          {buttonText}
        </Text>
        <ArrowLeft
          className={`ml-1 rotate-180 ${colour === "softBlack" ? "stroke-white" : "stroke-black group-hover:stroke-white"}`}
        />
      </StyledButton>
    </a>
  );
}

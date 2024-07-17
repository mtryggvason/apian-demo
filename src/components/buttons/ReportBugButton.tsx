import StyledButton from "@/components/buttons/StyledButton";
import { Bug } from "@/components/icons/Bug";
import Text from "@/components/typography/Text";
import { PROFILE_REPORT_BUG_BUTTON_TXT } from "@/lib/constants/pageTextConstants";

export default function ReportBugButton() {
  return (
    <StyledButton size="lgRoundedMd" bgColor="white" className="w-[170px]">
      <div className="flex w-full items-center justify-center">
        <Bug width={20} height={20} />
        <Text
          tag="span"
          textSize="body"
          textColor="black"
          className="ml-[10px]"
        >
          {PROFILE_REPORT_BUG_BUTTON_TXT}
        </Text>
      </div>
    </StyledButton>
  );
}
